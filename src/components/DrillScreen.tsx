import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { MathProblem } from '../types';

type DrillScreenProps = {
  problems: MathProblem[];
  timeLimit: number;
  onComplete: (problems: MathProblem[], timeSpent: number) => void;
};

export function DrillScreen({ problems, timeLimit, onComplete }: DrillScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [solvedProblems, setSolvedProblems] = useState<MathProblem[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          onComplete(solvedProblems, timeSpent);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentProblem = problems[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) return;

    const updatedProblem = {
      ...currentProblem,
      userAnswer: parseInt(answer, 10),
    };

    const newSolvedProblems = [...solvedProblems, updatedProblem];
    setSolvedProblems(newSolvedProblems);

    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
    } else {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete(newSolvedProblems, timeSpent);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">
              もんだい {currentIndex + 1} / {problems.length}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-8">
            {currentProblem.question}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && answer) {
                  handleSubmit(e);
                }
              }}
              className="w-full text-center text-3xl px-4 py-3 rounded-xl border-2 border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition"
              placeholder="こたえを入れてね"
              autoFocus
            />

            <button
              type="submit"
              disabled={!answer}
              className={`w-full text-white text-lg font-medium py-3 rounded-xl transition ${
                answer
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              つぎへ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}