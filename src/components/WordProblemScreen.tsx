import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, HelpCircle } from 'lucide-react';
import type { MathProblem } from '../types';
import { WordProblemType } from '../utils/wordProblems';

type WordProblemScreenProps = {
  problem: MathProblem;
  onAnswer: (problem: MathProblem, userAnswer: number) => void;
  totalProblems: number;
  currentProblem: number;
};

export function WordProblemScreen({ problem, onAnswer, totalProblems, currentProblem }: WordProblemScreenProps) {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 問題が変更されたときに状態をリセット
  useEffect(() => {
    setUserAnswer('');
    setShowAnswer(false);
    setShowHint(false);
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
      setShowHint(false);
    }
  };
  
  // 問題タイプに対応する画像をランダムに選択
  const getRandomImage = () => {
    const imageType = problem.imageType as WordProblemType || 'shopping';
    
    // SVG画像を選択
    const imagePath = `/images/word-problems/${imageType}.svg`;
    
    return imagePath;
  };
  
  // 分数問題の場合の特別な表示処理
  const renderAnswer = () => {
    if (problem.operation === 'fraction' && problem.answerDenominator) {
      return (
        <div className="flex items-center justify-center space-x-4">
          <input
            key={problem.id}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-16 text-center text-3xl px-2 py-1 rounded-xl border-2 border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition"
            placeholder="?"
            autoFocus
          />
          <div className="text-3xl">/</div>
          <div className="text-3xl">{problem.answerDenominator}</div>
        </div>
      );
    }
    
    return (
      <input
        key={problem.id}
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && userAnswer) {
            handleSubmit(e);
          }
        }}
        className="w-full text-center text-3xl px-4 py-3 rounded-xl border-2 border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition"
        placeholder="こたえを入れてね"
        autoFocus
      />
    );
  };

  // 考え方のヒントを表示
  const renderHint = () => {
    if (!problem.calculation) return null;
    
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="text-blue-800 font-medium mb-2">考え方のヒント：</div>
        <div className="text-blue-700 whitespace-pre-line">{problem.calculation}</div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">
              もんだい {currentProblem} / {totalProblems}
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <BookOpen className="w-5 h-5" />
              <span>文章問題</span>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <img 
              src={getRandomImage()} 
              alt="問題のイラスト" 
              className="w-64 h-64 object-contain rounded-lg border-2 border-purple-100"
              onError={(e) => {
                // 画像が読み込めない場合のフォールバック
                const target = e.target as HTMLImageElement;
                target.src = '/images/word-problems/default.png';
              }}
            />
          </div>
          
          <div className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
            {problem.question}
          </div>

          {/* ヒントボタン */}
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="mb-6 flex items-center justify-center mx-auto text-purple-600 hover:text-purple-800"
          >
            <HelpCircle className="w-5 h-5 mr-1" />
            <span>{showHint ? 'ヒントを隠す' : 'ヒントを見る'}</span>
          </button>

          {/* ヒントの表示 */}
          {showHint && renderHint()}

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {renderAnswer()}

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
    </div>
  );
} 