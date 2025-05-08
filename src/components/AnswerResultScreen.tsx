import React from 'react';
import type { MathProblem } from '../types';

interface AnswerResultScreenProps {
  problem: MathProblem;
  userAnswer: number;
  isCorrect: boolean;
  onNext: () => void;
}

const AnswerResultScreen: React.FC<AnswerResultScreenProps> = ({ problem, userAnswer, isCorrect, onNext }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">答え合わせ</h2>
          <div className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? '正解！' : '不正解'}</div>
        </div>
        <div className="mb-4">
          <div className="text-lg mb-2">{problem.question}</div>
          <div className="flex gap-4 justify-center items-center mb-2">
            <span className="font-medium">あなたの答え：</span>
            <span className="text-xl">{userAnswer}</span>
          </div>
          <div className="flex gap-4 justify-center items-center mb-2">
            <span className="font-medium">正解：</span>
            <span className="text-xl">{problem.answer}</span>
          </div>
          {problem.calculation && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
              <span className="font-medium">解説：</span>{problem.calculation}
            </div>
          )}
        </div>
        <button
          onClick={onNext}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default AnswerResultScreen; 