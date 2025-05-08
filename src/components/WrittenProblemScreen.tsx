import React, { useState, useEffect } from 'react';
import type { MathProblem } from '../types';

type WrittenProblemScreenProps = {
  problem: MathProblem;
  onAnswer: (problem: MathProblem, userAnswer: number) => void;
  totalProblems: number;
  currentProblem: number;
};

export function WrittenProblemScreen({ problem, onAnswer, totalProblems, currentProblem }: WrittenProblemScreenProps) {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 問題が変更されたときに状態をリセット
  useEffect(() => {
    setUserAnswer('');
    setShowAnswer(false);
    setIsSubmitting(false);
  }, [problem.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !userAnswer.trim()) return;
    
    const answer = parseInt(userAnswer, 10);
    if (!isNaN(answer)) {
      setIsSubmitting(true);
      onAnswer(problem, answer);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const getOperationSymbol = (operation: string) => {
    switch (operation) {
      case 'addition':
        return '+';
      case 'subtraction':
        return '-';
      case 'multiplication':
        return '×';
      case 'division':
        return '÷';
      default:
        return '';
    }
  };

  if (!problem.writtenCalculation) {
    return null;
  }

  const { num1, num2, operation } = problem.writtenCalculation;
  const operationSymbol = getOperationSymbol(operation);

  // 最大桁数を取得
  const maxDigits = Math.max(num1.toString().length, num2.toString().length);

  // 右詰めで各数字を配列化
  const padDigits = (num: number) => {
    const digits = num.toString().split('');
    const pad = Array(maxDigits - digits.length).fill('');
    return [...pad, ...digits];
  };
  const num1Digits = padDigits(num1);
  const num2Digits = padDigits(num2);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 mb-2">
            問題 {currentProblem} / {totalProblems}
          </div>
          <h2 className="text-2xl font-bold">ひっさん</h2>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-block">
            {/* 1つ目の数字（右詰め） */}
            <div className="flex flex-row justify-end">
              <span className="inline-block w-8 text-center select-none">&nbsp;</span>
              {num1Digits.map((digit, idx) => (
                <span key={idx} className="inline-block w-8 text-center font-mono text-2xl">{digit}</span>
              ))}
            </div>
            {/* 2つ目の数字（演算子＋右詰め） */}
            <div className="flex flex-row justify-end">
              <span className="inline-block w-8 text-center font-mono text-2xl">{operationSymbol}</span>
              {num2Digits.map((digit, idx) => (
                <span key={idx} className="inline-block w-8 text-center font-mono text-2xl">{digit}</span>
              ))}
            </div>
            {/* 下線 */}
            <div className="flex flex-row justify-end border-b-2 border-gray-400 mt-1 mb-2">
              <span className="inline-block w-8 text-center select-none">&nbsp;</span>
              {Array(maxDigits).fill(0).map((_, idx) => (
                <span key={idx} className="inline-block w-8 text-center">&nbsp;</span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              答えを入力してください
            </label>
            <input
              key={problem.id}
              type="number"
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="答えを入力"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              答え合わせ
            </button>
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              答えを見る
            </button>
          </div>
        </form>

        {showAnswer && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-800">
              <div className="font-medium mb-2">答え: {problem.answer}</div>
              {problem.calculation && (
                <div className="text-sm">
                  計算式: {problem.calculation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 