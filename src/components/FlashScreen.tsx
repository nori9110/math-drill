import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import type { MathProblem } from '../types';

type FlashScreenProps = {
  problem: MathProblem;
  onAnswer: (problem: MathProblem, userAnswer: number) => void;
  totalProblems: number;
  currentProblem: number;
};

export function FlashScreen({ problem, onAnswer, totalProblems, currentProblem }: FlashScreenProps) {
  const [answer, setAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showNumber, setShowNumber] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Web Audio APIのセットアップ
  useEffect(() => {
    // AudioContextの作成
    audioContextRef.current = new AudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // ビープ音を再生する関数
  const playBeep = () => {
    if (!audioContextRef.current) return;

    const context = audioContextRef.current;
    
    // オシレーターの作成（純音を生成）
    const oscillator = context.createOscillator();
    oscillator.type = 'sine'; // サイン波（純音）
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A5音（880Hz）

    // ゲイン（音量）ノードの作成
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01); // フェードイン
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1); // フェードアウト

    // オシレーターとゲインノードを接続
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // 音の再生
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  };

  // フラッシュアニメーションの開始
  useEffect(() => {
    if (!problem.flashNumbers || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(-1);
    setShowNumber(false);
    setAnimationComplete(false);
    
    // 最初の数字を表示するまでの遅延
    const startDelay = setTimeout(() => {
      showNextNumber(0);
    }, 1000);
    
    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [problem.flashNumbers]);

  // 次の数字を表示する
  const showNextNumber = (index: number) => {
    if (!problem.flashNumbers) return;
    
    if (index >= problem.flashNumbers.length) {
      setShowNumber(false);
      setAnimationComplete(true);
      return;
    }
    
    setCurrentIndex(index);
    setShowNumber(true);
    
    // ビープ音を再生
    playBeep();
    
    // 数字を表示する時間
    timerRef.current = window.setTimeout(() => {
      setShowNumber(false);
      
      // 次の数字を表示するまでの間隔
      timerRef.current = window.setTimeout(() => {
        showNextNumber(index + 1);
      }, problem.flashInterval || 200);
    }, problem.flashSpeed || 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer || !animationComplete) return;
    
    onAnswer(problem, parseInt(answer, 10));
    setAnswer('');
    setAnimationComplete(false);
    setIsAnimating(false);
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAnimating(false);
    setAnimationComplete(false);
    setCurrentIndex(-1);
    setShowNumber(false);
    
    // 少し遅延してから再開始
    setTimeout(() => {
      setIsAnimating(true);
      showNextNumber(0);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">
              もんだい {currentProblem} / {totalProblems}
            </div>
            <div className="text-blue-600 font-medium">
              フラッシュ暗算
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div 
              className={`w-64 h-64 flex items-center justify-center text-6xl font-bold rounded-lg 
                ${showNumber ? 'bg-blue-500 text-white' : 'bg-gray-100 text-transparent'}
                transition-all duration-200`}
            >
              {currentIndex >= 0 && problem.flashNumbers 
                ? problem.flashNumbers[currentIndex] 
                : '0'}
            </div>
            
            {!isAnimating && !animationComplete && (
              <button
                onClick={handleRestart}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                スタート
              </button>
            )}
            
            {isAnimating && !animationComplete && (
              <div className="mt-4 text-blue-600 font-medium">
                表示中...
              </div>
            )}
          </div>
          
          {animationComplete && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-xl font-medium text-gray-800 mb-2">
                表示された数字の合計はいくつですか？
              </div>
              
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && answer) {
                    handleSubmit(e);
                  }
                }}
                className="w-full text-center text-3xl px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                placeholder="こたえを入れてね"
                autoFocus
              />

              <button
                type="submit"
                disabled={!answer}
                className={`w-full flex items-center justify-center text-white text-lg font-medium py-3 rounded-xl transition ${
                  answer
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <span>つぎへ</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </form>
          )}
          
          {!animationComplete && (
            <div className="mt-4 text-sm text-gray-600">
              {problem.flashNumbers?.length || 0}つの数字が表示されます。
              {problem.flashSpeed && (
                <span> 各数字は{problem.flashSpeed / 1000}秒間表示され、</span>
              )}
              {problem.flashInterval && (
                <span> 間隔は{problem.flashInterval}ミリ秒です。</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 