'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizData, Question, QuizStatus, TeamInfo, Answers } from './types';
import { useQuizTimer } from './hooks/useQuizTimer';
import Header from './components/Header';
import PreQuizView from './components/PreQuizView';
import QuizView from './components/QuizView';
import EndQuizForm from './components/EndQuizForm';
import ResultsView from './components/ResultsView';
import LoadingSpinner from './components/LoadingSpinner';

// Prevent page reload during quiz
const preventReload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = '';
  return '';
};

export default function RegistrationTestsPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({ name: '', email: '' });
  const [answers, setAnswers] = useState<Answers>({});
  const [score, setScore] = useState<number | null>(null);
  const [appState, setAppState] = useState<'loading' | 'waiting' | 'ready' | 'active' | 'endForm' | 'submitted'>('loading');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [instructions, setInstructions] = useState<string>('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const progressSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedAnswersRef = useRef<string>(''); // Track last saved answers for smart saving
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch quiz configuration from Sanity
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch('/api/quiz/config');
        
        if (!response.ok) {
          if (response.status === 404) {
            // No active quiz configured
            setAppState('ready');
            setQuizData({
              id: 'no-quiz',
              title: 'No Quiz Available',
              globalStartTime: new Date(),
              endTime: new Date(),
              questions: [],
            });
            return;
          }
          throw new Error(`Failed to fetch quiz configuration: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.error) {
          console.error('Quiz config error:', data.error);
          setAppState('ready');
          return;
        }

        const scheduledStart = new Date(data.scheduledStartTime);
        const now = new Date();
        const durationMs = 2 * 60 * 60 * 1000; // Fixed 2 hours duration
        const scheduledEnd = new Date(scheduledStart.getTime() + durationMs);

        // Check if quiz should be active
        if (now < scheduledStart) {
          setAppState('waiting');
          // Auto-reload when quiz starts
          const timeUntilStart = scheduledStart.getTime() - now.getTime();
          if (timeUntilStart > 0 && timeUntilStart < 24 * 60 * 60 * 1000) { // Only if less than 24 hours
            setTimeout(() => {
              window.location.reload();
            }, timeUntilStart);
          }
        } else if (now >= scheduledStart && now <= scheduledEnd) {
          // Quiz is active
          setQuizData({
            id: data.id,
            title: data.title,
            globalStartTime: scheduledStart,
            endTime: scheduledEnd,
            questions: data.questions || [],
          });
          setInstructions(data.instructions || '');
          setAppState('ready');
        } else {
          // Quiz has ended
          setAppState('ready');
          setQuizData({
            id: data.id,
            title: data.title,
            globalStartTime: scheduledStart,
            endTime: scheduledEnd,
            questions: data.questions || [],
          });
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setAppState('ready');
        // Show a message that quiz is not available
        setQuizData({
          id: 'error',
          title: 'Quiz Unavailable',
          globalStartTime: new Date(),
          endTime: new Date(),
          questions: [],
        });
      }
    };
    fetchQuiz();
  }, []);

  // Check for existing submission FIRST - this prevents viewing/editing after submission
  useEffect(() => {
    const checkSubmission = async () => {
      if (!teamInfo.email || !quizData) return;

      try {
        // ALWAYS check if already submitted first - this prevents access to quiz
        const submitCheck = await fetch(`/api/quiz/submit?teamEmail=${encodeURIComponent(teamInfo.email)}`);
        if (submitCheck.ok) {
          const submitData = await submitCheck.json();
          if (submitData.submitted) {
            setAlreadySubmitted(true);
            setAppState('submitted');
            // Fetch submission details
            if (submitData.submission) {
              setTimeTaken(submitData.submission.time_taken);
              setScore(submitData.submission.score);
            }
            // Clear any answers and localStorage to prevent viewing/editing
            setAnswers({});
            localStorage.removeItem('quiz_progress');
            return; // Exit early - don't check progress if already submitted
          }
        }
      } catch (error) {
        console.error('Error checking submission:', error);
      }
    };

    // Check submission status whenever team email or quiz data changes
    if (teamInfo.email && quizData) {
      checkSubmission();
    }
  }, [teamInfo.email, quizData]);

  // Check for existing progress ONLY if not already submitted
  useEffect(() => {
    const checkProgress = async () => {
      // Don't check progress if already submitted
      if (!teamInfo.email || !quizData || alreadySubmitted || appState === 'submitted') return;

      try {
        // Check for saved progress
        const progressResponse = await fetch(`/api/quiz/progress?teamEmail=${encodeURIComponent(teamInfo.email)}`);
        if (progressResponse.ok) {
          const { progress } = await progressResponse.json();
          if (progress) {
            setAnswers(progress.answers || {});
            const savedStartTime = new Date(progress.start_time);
            setStartTime(savedStartTime);
            const quizDuration = quizData ? (quizData.endTime.getTime() - quizData.globalStartTime.getTime()) : 5 * 60 * 1000;
            setEndTime(new Date(savedStartTime.getTime() + quizDuration));
            setAppState('active');
          }
        }
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    if (teamInfo.email && appState === 'ready' && quizData && !alreadySubmitted) {
      checkProgress();
    }
  }, [teamInfo.email, appState, quizData, alreadySubmitted]);

  // Smart progress saving: Save only when answers change (debounced) + safety timer
  // Don't save if already submitted
  useEffect(() => {
    if (appState === 'active' && teamInfo.email && startTime && !alreadySubmitted) {
      // Function to save progress
      const saveProgress = async () => {
        try {
          await fetch('/api/quiz/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              teamName: teamInfo.name,
              teamEmail: teamInfo.email,
              answers,
              startTime: startTime.toISOString(),
              currentQuestion: Object.keys(answers).length + 1,
            }),
          });
          lastSavedAnswersRef.current = JSON.stringify(answers);
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      };

      // Save to localStorage immediately (fast, local)
      localStorage.setItem('quiz_progress', JSON.stringify({
        teamInfo: {
          ...teamInfo,
          vehicleCategory: teamInfo.vehicleCategory, // Ensure vehicle category is saved
        },
        answers,
        startTime: startTime.toISOString(),
      }));

      // Debounced save to server when answers change (wait 2 seconds after last change)
      const currentAnswers = JSON.stringify(answers);
      if (currentAnswers !== lastSavedAnswersRef.current) {
        // Clear any pending save
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        // Schedule save 2 seconds after last change
        saveTimeoutRef.current = setTimeout(() => {
          saveProgress();
        }, 2000);
      }

      // Safety timer: Save every 30 seconds as fallback (in case user doesn't change answers)
      if (!progressSaveInterval.current) {
        progressSaveInterval.current = setInterval(() => {
          const currentAnswersCheck = JSON.stringify(answers);
          if (currentAnswersCheck !== lastSavedAnswersRef.current) {
            saveProgress();
          }
        }, 30000); // 30 seconds fallback
      }

      // Prevent page reload
      window.addEventListener('beforeunload', preventReload);

      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        if (progressSaveInterval.current) {
          clearInterval(progressSaveInterval.current);
          progressSaveInterval.current = null;
        }
        window.removeEventListener('beforeunload', preventReload);
      };
    }
  }, [appState, teamInfo, answers, startTime]);

  // Restore from localStorage on mount
  // But submission check will run automatically when teamInfo.email is set
  useEffect(() => {
    const saved = localStorage.getItem('quiz_progress');
    if (saved && appState === 'ready') {
      try {
        const progress = JSON.parse(saved);
        if (progress.teamInfo?.email) {
          // Set team info first - this will trigger submission check
          setTeamInfo(progress.teamInfo);
          // Don't restore answers yet - wait for submission check
          // If not submitted, the progress check useEffect will restore answers
        }
      } catch (error) {
        console.error('Error restoring progress:', error);
      }
    }
  }, [appState, quizData]);

  const { quizStatus, timeRemaining } = useQuizTimer(
    startTime || undefined,
    endTime || undefined
  );

  const handleStart = useCallback(() => {
    if (!quizData || !teamInfo.vehicleCategory) return;
    
    // Filter questions based on vehicle category
    const filteredQuestions = quizData.questions.filter((q: any) => 
      !q.category || q.category === 'common' || q.category === teamInfo.vehicleCategory
    );
    
    // Update quiz data with filtered questions
    setQuizData({
      ...quizData,
      questions: filteredQuestions,
    });
    
    const now = new Date();
    // Use fixed 2 hours from global start time, not from individual start
    const globalEndTime = quizData.endTime;
    setStartTime(now);
    // End time is always 2 hours from global start, regardless of when user starts
    setEndTime(globalEndTime);
    setAppState('active');

    // Save initial progress
    fetch('/api/quiz/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamName: teamInfo.name,
        teamEmail: teamInfo.email,
        answers: {},
        startTime: now.toISOString(),
        currentQuestion: 1,
      }),
    }).catch(console.error);
  }, [quizData, teamInfo]);

  const calculateScore = useCallback((answers: Answers, questions: Question[]): number => {
    let correctCount = 0;
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer && answer !== 'NO_ANSWER' && answer === question.correctOption) {
        correctCount++;
      }
    });
    return correctCount;
  }, []);

  const handleQuizComplete = useCallback(() => {
    // Move to end form instead of submitting directly
    setAppState('endForm');
  }, []);

  const handleSubmission = useCallback(async () => {
    if (!quizData || !startTime || alreadySubmitted || !teamInfo.vehicleCategory) return;
    
    // Filter questions to match what the team actually answered
    const filteredQuestions = quizData.questions.filter((q: any) => 
      !q.category || q.category === 'common' || q.category === teamInfo.vehicleCategory
    );
    
    const submitTime = new Date();
    const timeDiff = Math.floor((submitTime.getTime() - startTime.getTime()) / 1000);
    setTimeTaken(timeDiff);
    
    const finalScore = calculateScore(answers, filteredQuestions);
    setScore(finalScore);

    // Submit to API FIRST, then update UI
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: teamInfo.name,
          teamEmail: teamInfo.email,
          vehicleCategory: teamInfo.vehicleCategory,
          preferredTeamNumber: teamInfo.preferredTeamNumber,
          alternativeTeamNumber: teamInfo.alternativeTeamNumber,
          fuelType: teamInfo.fuelType,
          answers,
          timeTaken: timeDiff,
          score: finalScore,
          questions: filteredQuestions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctOption: q.correctOption,
          })),
        }),
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch (e) {
          // If response is not JSON, create error object
          const text = await response.text();
          error = { error: text || 'Failed to submit quiz' };
        }
        
        console.error('Submission error:', error);
        
        // Check if team already submitted (multiple ways to detect this)
        if (error.error?.includes('already submitted') || 
            error.alreadySubmitted || 
            error.error?.includes('first submission')) {
          setAlreadySubmitted(true);
          
          // Fetch the first submission to get the correct time
          try {
            const firstSubmissionCheck = await fetch(`/api/quiz/submit?teamEmail=${encodeURIComponent(teamInfo.email)}`);
            if (firstSubmissionCheck.ok) {
              const firstSubmissionData = await firstSubmissionCheck.json();
              if (firstSubmissionData.submission) {
                setTimeTaken(firstSubmissionData.submission.time_taken);
                setScore(firstSubmissionData.submission.score);
              }
            }
          } catch (e) {
            console.error('Error fetching first submission:', e);
          }
          
          setAppState('submitted');
          // Show friendly message
          alert('You have already submitted this quiz. Only your first submission is kept.');
          return;
        }
        
        // Show detailed error message
        const errorMessage = error.details 
          ? `${error.error}: ${error.details}`
          : error.error || 'Failed to submit';
        
        alert(`Failed to submit quiz: ${errorMessage}`);
        return; // Don't set submitted state if submission failed
      }

      // After successful submission, fetch the saved submission to get the actual time_taken
      // This ensures we always show the time from the database (first submission)
      let actualTimeTaken = timeDiff; // Fallback to calculated time
      try {
        const savedSubmissionCheck = await fetch(`/api/quiz/submit?teamEmail=${encodeURIComponent(teamInfo.email)}`);
        if (savedSubmissionCheck.ok) {
          const savedSubmissionData = await savedSubmissionCheck.json();
          if (savedSubmissionData.submission) {
            // Use the time from the database (first submission), not the calculated time
            actualTimeTaken = savedSubmissionData.submission.time_taken;
            setTimeTaken(actualTimeTaken);
            setScore(savedSubmissionData.submission.score);
          }
        }
      } catch (e) {
        console.error('Error fetching saved submission:', e);
        // If fetch fails, keep the calculated time as fallback
      }

      // Only update UI state after successful submission
      setAppState('submitted');

      // Clear progress
      localStorage.removeItem('quiz_progress');
      if (progressSaveInterval.current) {
        clearInterval(progressSaveInterval.current);
      }

      // Send confirmation email ONLY after successful submission
      // Use the actual time from the database
      try {
        const emailResponse = await fetch('/api/send-quiz-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamName: teamInfo.name,
            teamEmail: teamInfo.email,
            timeTaken: actualTimeTaken, // Use the actual time from database
            questions: filteredQuestions.map(q => ({
              id: q.id,
              text: q.text,
              options: q.options,
            })),
            answers,
          }),
        });

        if (!emailResponse.ok) {
          console.warn('Email sending failed, but submission was successful');
        }
      } catch (error) {
        // Don't fail the submission if email fails
        console.error('Error sending email:', error);
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      const errorMessage = error.message || 'Network error. Please check your connection and try again.';
      alert(`Failed to submit quiz: ${errorMessage}`);
      // Don't set submitted state on error
      // Don't send email if submission failed
    }
  }, [answers, quizData, startTime, teamInfo, alreadySubmitted, calculateScore, handleQuizComplete]);

  useEffect(() => {
    if (quizStatus === QuizStatus.FINISHED && appState === 'active') {
      handleQuizComplete();
    }
  }, [quizStatus, appState, handleQuizComplete]);

  const renderContent = () => {
    if (appState === 'loading') {
      return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (appState === 'waiting') {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Not Started</h2>
            <p className="text-gray-600">The quiz will begin at the scheduled time.</p>
            <p className="text-sm text-gray-500 mt-2">This page will automatically reload when the quiz starts.</p>
          </div>
        </div>
      );
    }

    if (appState === 'ready' && quizData && (!quizData.questions || quizData.questions.length === 0)) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Not Available</h2>
            <p className="text-gray-600 mb-4">
              {quizData.id === 'no-quiz' 
                ? 'No active quiz has been configured. Please contact an administrator.'
                : 'The quiz has ended or is not currently available.'}
            </p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact the administrators.
            </p>
          </div>
        </div>
      );
    }

    if (appState === 'submitted' || alreadySubmitted) {
      return (
        <ResultsView 
          timeTaken={timeTaken} 
          teamInfo={teamInfo}
          isAdmin={false}
          score={score}
          totalQuestions={quizData?.questions.length || 0}
        />
      );
    }

    if (appState === 'ready') {
      // Check if we have valid quiz data with questions
      if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Not Available</h2>
              <p className="text-gray-600 mb-4">
                {quizData?.id === 'no-quiz' || quizData?.id === 'error'
                  ? 'No active quiz has been configured. Please contact an administrator.'
                  : 'The quiz has ended or is not currently available.'}
              </p>
              <p className="text-sm text-gray-500">
                If you believe this is an error, please contact the administrators.
              </p>
            </div>
          </div>
        );
      }
      
      return (
        <PreQuizView 
          teamInfo={teamInfo} 
          setTeamInfo={setTeamInfo} 
          onStart={handleStart}
          instructions={instructions}
        />
      );
    }

    if (appState === 'active' && quizData && quizData.questions && quizData.questions.length > 0) {
      // Prevent access if already submitted
      if (alreadySubmitted) {
        return (
          <ResultsView 
            timeTaken={timeTaken} 
            teamInfo={teamInfo}
            isAdmin={false}
            score={score}
            totalQuestions={quizData?.questions.length || 0}
          />
        );
      }
      
      return (
        <QuizView 
          questions={quizData.questions}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={handleQuizComplete}
          teamInfo={teamInfo}
        />
      );
    }

    if (appState === 'endForm') {
      return (
        <EndQuizForm
          teamInfo={teamInfo}
          setTeamInfo={setTeamInfo}
          onSubmit={handleSubmission}
        />
      );
    }

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {appState === 'active' && (
        <Header 
          timeRemaining={timeRemaining}
          quizStatus={quizStatus}
        />
      )}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

