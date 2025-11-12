'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QuizData, Question, QuizStatus, TeamInfo, Answers } from './types';
import { quizService } from './services/quizService';
import { useQuizTimer } from './hooks/useQuizTimer';
import Header from './components/Header';
import PreQuizView from './components/PreQuizView';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import LoadingSpinner from './components/LoadingSpinner';

export default function RegistrationTestsPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({ name: '', email: '' });
  const [answers, setAnswers] = useState<Answers>({});
  const [score, setScore] = useState<number | null>(null);
  const [appState, setAppState] = useState<'loading' | 'ready' | 'active' | 'submitted'>('loading');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [submissionTime, setSubmissionTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await quizService.fetchQuizData();
      setQuizData(data);
      setAppState('ready');
    };
    fetchQuiz();
  }, []);

  const { quizStatus, timeRemaining } = useQuizTimer(
    startTime || undefined,
    endTime || undefined
  );

  const handleStart = useCallback(() => {
    const now = new Date();
    const quizDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    setStartTime(now);
    setEndTime(new Date(now.getTime() + quizDuration));
    setAppState('active');
  }, []);

  const handleSubmission = useCallback(async () => {
    if (!quizData || !startTime) return;
    const submitTime = new Date();
    setSubmissionTime(submitTime);
    
    const timeDiff = Math.floor((submitTime.getTime() - startTime.getTime()) / 1000);
    setTimeTaken(timeDiff);
    
    const finalScore = quizService.submitAnswers(answers, quizData.questions);
    setScore(finalScore);
    setAppState('submitted');

    // Send confirmation email
    try {
      const response = await fetch('/api/send-quiz-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: teamInfo.name,
          teamEmail: teamInfo.email,
          timeTaken: timeDiff,
          questions: quizData.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
          })),
          answers: answers,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email:', await response.text());
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't block submission if email fails
    }
  }, [answers, quizData, startTime, teamInfo]);

  useEffect(() => {
    if (quizStatus === QuizStatus.FINISHED && appState === 'active') {
      handleSubmission();
    }
  }, [quizStatus, appState, handleSubmission]);

  // Check if user is admin (you can implement proper admin check later)
  const isAdmin = false; // TODO: Implement proper admin authentication

  const renderContent = () => {
    if (appState === 'loading' || !quizData) {
      return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (appState === 'submitted') {
        return <ResultsView 
                  timeTaken={timeTaken} 
                  teamInfo={teamInfo}
                  isAdmin={isAdmin}
                  score={score}
                  totalQuestions={quizData.questions.length}
                />;
    }

    if (appState === 'ready') {
      return <PreQuizView 
                teamInfo={teamInfo} 
                setTeamInfo={setTeamInfo} 
                onStart={handleStart}
              />;
    }

    if (appState === 'active') {
      return <QuizView 
                questions={quizData.questions}
                answers={answers}
                setAnswers={setAnswers}
                onSubmit={handleSubmission}
                teamInfo={teamInfo}
              />;
    }

    return <div className="text-center p-8">Initializing quiz...</div>;
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

