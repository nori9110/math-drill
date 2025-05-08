import React, { useState } from 'react';
import type { DrillResult } from '../types';

type HistoryScreenProps = {
  history: DrillResult[];
  onBack: () => void;
  onShowDetail: (item: DrillResult) => void;
  onClearHistory: () => void;
};

type GroupedHistory = {
  date: string;
  items: DrillResult[];
};

export function HistoryScreen({ history, onBack, onShowDetail, onClearHistory }: HistoryScreenProps) {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 履歴を日付でグループ化
  const groupedHistory = history.reduce<GroupedHistory[]>((groups, item) => {
    const dateOnly = formatDateOnly(item.date);
    const existingGroup = groups.find(group => group.date === dateOnly);
    
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      groups.push({ date: dateOnly, items: [item] });
    }
    
    return groups;
  }, []);

  const toggleExpand = (date: string) => {
    setExpandedDates(prev => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const handleClearHistory = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearHistory = () => {
    onClearHistory();
    setShowConfirmDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">履歴</h1>
          <div className="flex gap-2">
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              履歴をクリア
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              戻る
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            まだ履歴がありません
          </div>
        ) : (
          <div className="space-y-4">
            {groupedHistory.map((group) => (
              <div key={group.date} className="border rounded-lg overflow-hidden">
                <div
                  className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpand(group.date)}
                >
                  <div className="font-bold text-lg">{group.date}</div>
                  <div className="text-sm text-gray-600">
                    {group.items.length}回の挑戦
                  </div>
                </div>
                
                {expandedDates.has(group.date) && (
                  <div className="p-4 space-y-4">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition border"
                        onClick={() => onShowDetail(item)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(item.date)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {item.operations.join('、')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {item.score}点
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.correctCount}/{item.problemCount}問
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          所要時間: {item.timeSpent}秒
                        </div>
                        <div className="mt-3 space-y-2">
                          {item.problems.map((problem, index) => (
                            <div
                              key={problem.id}
                              className={`text-sm p-2 rounded ${
                                problem.answer === problem.userAnswer
                                  ? 'bg-green-50 text-green-800'
                                  : 'bg-red-50 text-red-800'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>問題 {index + 1}: {problem.question}</span>
                                <span>{problem.answer === problem.userAnswer ? '⭕️' : '❌'}</span>
                              </div>
                              <div className="text-xs mt-1">
                                あなたの答え: {problem.userAnswer}
                                {problem.answer !== problem.userAnswer && (
                                  <span className="ml-2">正解: {problem.answer}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 確認ダイアログ */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">履歴をクリアしますか？</h3>
              <p className="text-gray-600 mb-6">
                この操作は取り消せません。全ての履歴が削除されます。
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmClearHistory}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  クリア
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}