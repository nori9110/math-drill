import React from 'react';
import type { MathProblem } from '../types';

type ResultScreenProps = {
  problems: MathProblem[];
  timeSpent: number;
  onRetry: () => void;
};

export function ResultScreen({ problems, timeSpent, onRetry }: ResultScreenProps) {
  const correctCount = problems.filter(p => p.answer === p.userAnswer).length;
  const score = Math.round((correctCount / problems.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">結果</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{score}点</div>
            <div className="text-sm text-blue-800">正答率</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{correctCount}/{problems.length}</div>
            <div className="text-sm text-green-800">正解数</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{timeSpent}秒</div>
            <div className="text-sm text-purple-800">所要時間</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {problems.map((problem, index) => (
            <div
              key={problem.id}
              className={`p-4 rounded-lg ${
                problem.answer === problem.userAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium mb-2">
                    問題 {index + 1}: {problem.question}
                  </div>
                  <div className="text-sm text-gray-600">
                    あなたの答え: {problem.userAnswer}
                  </div>
                  {problem.answer !== problem.userAnswer && (
                    <div className="text-sm text-red-600">
                      正解: {problem.answer}
                    </div>
                  )}
                </div>
                <div className="text-2xl">
                  {problem.answer === problem.userAnswer ? '⭕️' : '❌'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            もう一度挑戦する
          </button>
        </div>
      </div>
    </div>
  );
}