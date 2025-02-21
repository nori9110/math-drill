import React from 'react';
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react';
import type { DrillResult } from '../types';

type HistoryScreenProps = {
  history: DrillResult[];
  onBack: () => void;
  onShowDetail: (historyItem: DrillResult) => void;
};

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
}

export function HistoryScreen({ history, onBack, onShowDetail }: HistoryScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-indigo-600 ml-4">れきし</h1>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-center text-gray-600">まだれきしがありません</p>
          ) : (
            history.map((result) => (
              <button
                key={result.id}
                onClick={() => onShowDetail(result)}
                className="w-full text-left bg-gray-50 rounded-xl p-4 space-y-2 hover:bg-gray-100 transition group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">
                    {result.operations.join('・')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(result.date)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {result.correctCount}/{result.problemCount}問 せいかい
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {result.score}点
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    制限時間: {result.timeLimit}分 / かかった時間:{' '}
                    {Math.floor(result.timeSpent / 60)}分
                    {result.timeSpent % 60}秒
                  </span>
                </div>
                <div className="flex items-center gap-2 text-indigo-500 group-hover:text-indigo-600 transition">
                  <span>くわしく見る</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}