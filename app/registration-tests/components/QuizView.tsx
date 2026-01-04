
import React from 'react';
import { Question, Answers, TeamInfo } from '../types';
import Icon from './Icon';

interface QuizViewProps {
  questions: Question[];
  answers: Answers;
  setAnswers: (answers: Answers) => void;
  onSubmit: () => void;
  teamInfo: TeamInfo;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, answers, setAnswers, onSubmit, teamInfo }) => {
  const handleAnswerSelect = (questionId: number, option: string) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };
  
  // Filter questions based on vehicle category
  const filteredQuestions = React.useMemo(() => {
    if (!teamInfo.vehicleCategory) return questions;
    return questions.filter(q => 
      !q.category || q.category === 'common' || q.category === teamInfo.vehicleCategory
    );
  }, [questions, teamInfo.vehicleCategory]);
  
  // Allow submission even if some questions have "NO_ANSWER"
  const allQuestionsAnswered = filteredQuestions.every(q => answers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quiz in Progress</h2>
                    <p className="mt-1 text-gray-500">Select the best answer for each question below.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 text-left sm:text-right bg-gray-50 p-3 rounded-lg border">
                    <p className="text-sm font-medium text-gray-500">Team</p>
                    <p className="font-semibold text-gray-800">{teamInfo.name || 'N/A'}</p>
                </div>
            </div>
        </div>
      
      <div className="space-y-6">
        {filteredQuestions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              <span className="text-blue-600 font-bold mr-2">Q{index + 1}.</span>
              {q.text}
            </p>
            {q.image && (
              <div className="mb-4">
                <img 
                  src={q.image} 
                  alt={`Question ${index + 1} illustration`}
                  className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
            <div className="space-y-3">
              {q.options.map(option => {
                const isSelected = answers[q.id] === option;
                return (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(q.id, option)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-md text-gray-700">{option}</span>
                  </label>
                );
              })}
              <label
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-150 ${
                  answers[q.id] === 'NO_ANSWER'
                    ? 'bg-gray-50 border-gray-500 ring-2 ring-gray-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value="NO_ANSWER"
                  checked={answers[q.id] === 'NO_ANSWER'}
                  onChange={() => handleAnswerSelect(q.id, 'NO_ANSWER')}
                  className="h-4 w-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                />
                <span className="ml-3 text-md text-gray-700 italic">No answer</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center sticky bottom-4">
        <button
          onClick={onSubmit}
          disabled={!allQuestionsAnswered}
          className={`w-full max-w-xs flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white transition-all duration-200 transform hover:scale-105 ${
            allQuestionsAnswered
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Icon name="submit" className="h-5 w-5 mr-2" />
          {allQuestionsAnswered ? 'Submit Final Answers' : 'Answer All Questions'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;
