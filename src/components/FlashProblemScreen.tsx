import React, { useEffect, useState, useRef } from 'react';

interface FlashProblemScreenProps {
  numbers: number[];
  flashInterval: number;
  onAnswer: (userAnswer: number) => void;
  totalProblems: number;
  currentProblem: number;
}

export const FlashProblemScreen: React.FC<FlashProblemScreenProps> = ({
  numbers,
  flashInterval,
  onAnswer,
  totalProblems,
  currentProblem,
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showInput, setShowInput] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Web Audio APIのセットアップ
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // 問題が変更されたときに状態をリセット
  useEffect(() => {
    setCurrentIndex(-1);
    setShowInput(false);
    setUserAnswer('');
    setIsSubmitting(false);
  }, [numbers]);

  // ビープ音を再生する関数
  const playBeep = () => {
    if (!audioContextRef.current) return;
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime); // 880Hz
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  };

  useEffect(() => {
    let idx = -1;
    const timer = setInterval(() => {
      idx++;
      if (idx < numbers.length) {
        setCurrentIndex(idx);
        playBeep();
      } else {
        clearInterval(timer);
        setTimeout(() => setShowInput(true), 500);
      }
    }, flashInterval);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [numbers, flashInterval]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !userAnswer.trim()) return;
    
    const answer = parseInt(userAnswer, 10);
    if (!isNaN(answer)) {
      setIsSubmitting(true);
      onAnswer(answer);
      setUserAnswer('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-500 mb-2">
            問題 {currentProblem} / {totalProblems}
          </div>
          <h2 className="text-2xl font-bold mb-4">フラッシュ暗算</h2>
        </div>
        <div className="flex items-center justify-center h-32 mb-6">
          {currentIndex >= 0 && currentIndex < numbers.length ? (
            <span className="text-6xl font-mono text-blue-600 animate-pulse">{numbers[currentIndex]}</span>
          ) : (
            <span className="text-4xl text-gray-400">&nbsp;</span>
          )}
        </div>
        {showInput && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">合計を入力してください</label>
            <input
              key={numbers.join('-')}
              type="number"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="合計を入力"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              答え合わせ
            </button>
          </form>
        )}
      </div>
    </div>
  );
}; 