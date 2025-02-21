import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

type LoginScreenProps = {
  onLogin: (username: string, grade: 1 | 2 | 3 | 4) => void;
};

const GRADES = [
  { value: 1, label: '1年生' },
  { value: 2, label: '2年生' },
  { value: 3, label: '3年生' },
  { value: 4, label: '4年生' },
] as const;

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState<1 | 2 | 3 | 4>(1);

  // ローカルストレージからユーザー名を読み込む
  useEffect(() => {
    const savedUsername = localStorage.getItem('mathDrillUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // ユーザー名をローカルストレージに保存
      localStorage.setItem('mathDrillUsername', username.trim());
      onLogin(username, grade);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <BookOpen className="w-16 h-16 text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold text-blue-600">おかえりなさい！</h1>
          <p className="text-gray-600 mt-2">算数ドリルへようこそ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              なまえを入れてください
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              placeholder="なまえ"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              学年を選んでください
            </label>
            <div className="grid grid-cols-2 gap-4">
              {GRADES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGrade(value)}
                  className={`py-3 px-6 rounded-xl text-lg font-medium transition
                    ${grade === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className={`w-full text-white text-lg font-medium py-3 rounded-xl transition
              ${username.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            はじめる
          </button>
        </form>
      </div>
    </div>
  );
}