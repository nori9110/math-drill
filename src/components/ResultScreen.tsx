import React from 'react';
import { Trophy, RefreshCw, Clock, ArrowLeft } from 'lucide-react';
import type { MathProblem } from '../types';

type ResultScreenProps = {
  problems: MathProblem[];
  timeSpent: number;
  onRetry: () => void;
  isHistoryView?: boolean;
};

const OPERATION_NAMES = {
  addition: 'たし算',
  subtraction: 'ひき算',
  multiplication: 'かけ算',
  division: 'わり算',
};

export function ResultScreen({ problems, timeSpent, onRetry, isHistoryView }: ResultScreenProps) {
  const correctCount = problems.filter(
    (p) => p.answer === p.userAnswer
  ).length;

  const percentage = Math.round((correctCount / problems.length) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  // 演算ごとの正解数を集計
  const statsByOperation = problems.reduce((acc, problem) => {
    const op = problem.operation;
    if (!acc[op]) {
      acc[op] = { total: 0, correct: 0 };
    }
    acc[op].total++;
    if (problem.answer === problem.userAnswer) {
      acc[op].correct++;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            {isHistoryView ? 'けいさんのきろく' : 'おつかれさま！'}
          </h1>
          <div className="text-5xl font-bold text-purple-500 mb-4">
            {percentage}点
          </div>
          <p className="text-gray-600">
            {problems.length}問中{correctCount}問せいかい
          </p>
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <Clock className="w-5 h-5" />
            <span>
              かかった時間: {minutes}分{seconds}秒
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* 演算ごとの成績 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h2 className="font-medium text-gray-700">演算ごとの成績</h2>
            {Object.entries(statsByOperation).map(([op, stats]) => (
              <div key={op} className="flex justify-between items-center">
                <span>{OPERATION_NAMES[op]}</span>
                <span className="text-gray-600">
                  {stats.correct}/{stats.total}問 せいかい
                </span>
              </div>
            ))}
          </div>

          {/* 問題ごとの結果 */}
          {problems.map((problem, index) => (
            <div
              key={problem.id}
              className={`p-4 rounded-xl ${
                problem.answer === problem.userAnswer
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg">
                  {index + 1}.&nbsp;&nbsp;{problem.question}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      problem.answer === problem.userAnswer
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {problem.userAnswer}
                  </span>
                  {problem.answer !== problem.userAnswer && (
                    <span className="text-gray-500">
                      (こたえ: {problem.answer})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-medium py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {isHistoryView ? (
              <>
                <ArrowLeft className="w-5 h-5" />
                もどる
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                もういちど
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}