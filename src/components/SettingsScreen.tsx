import React from 'react';
import { Calculator, Plus, Minus, X, Divide, Clock, Hash, LogOut } from 'lucide-react';
import type { DrillSettings } from '../types';

type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';
type DigitType = '1digit' | '2digit' | '3digit';

type SettingsScreenProps = {
  onStart: (settings: DrillSettings) => void;
  username: string;
  onShowHistory: () => void;
  onLogout?: () => void;
};

const DIGIT_LABELS = {
  '1digit': '1桁',
  '2digit': '2桁',
  '3digit': '3桁',
};

export function SettingsScreen({ onStart, username, onShowHistory, onLogout }: SettingsScreenProps) {
  const [settings, setSettings] = React.useState<DrillSettings>({
    grade: 1,
    operations: ['addition'],
    problemCount: 10,
    timeLimit: 5,
    digits: ['1digit'],
  });

  const toggleOperation = (operation: OperationType) => {
    setSettings(prev => {
      const newOperations = prev.operations.includes(operation)
        ? prev.operations.filter(op => op !== operation)
        : [...prev.operations, operation];
      
      return newOperations.length > 0
        ? { ...prev, operations: newOperations }
        : prev;
    });
  };

  const toggleDigit = (digit: DigitType) => {
    setSettings(prev => {
      const newDigits = prev.digits.includes(digit)
        ? prev.digits.filter(d => d !== digit)
        : [...prev.digits, digit];
      
      return newDigits.length > 0
        ? { ...prev, digits: newDigits }
        : prev;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Calculator className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-green-600">
            {username}さん、どんな問題にちょうせんする？
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              けいさんの種類（複数選べます）
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleOperation('addition')}
                className={`p-4 rounded-xl flex flex-col items-center transition
                  ${settings.operations.includes('addition')
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Plus className="w-8 h-8 mb-2" />
                <span>たし算</span>
              </button>
              <button
                onClick={() => toggleOperation('subtraction')}
                className={`p-4 rounded-xl flex flex-col items-center transition
                  ${settings.operations.includes('subtraction')
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Minus className="w-8 h-8 mb-2" />
                <span>ひき算</span>
              </button>
              <button
                onClick={() => toggleOperation('multiplication')}
                className={`p-4 rounded-xl flex flex-col items-center transition
                  ${settings.operations.includes('multiplication')
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <X className="w-8 h-8 mb-2" />
                <span>かけ算</span>
              </button>
              <button
                onClick={() => toggleOperation('division')}
                className={`p-4 rounded-xl flex flex-col items-center transition
                  ${settings.operations.includes('division')
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Divide className="w-8 h-8 mb-2" />
                <span>わり算</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              数の桁数（複数選べます）
            </label>
            <div className="flex gap-3">
              {(['1digit', '2digit', '3digit'] as const).map((digit) => (
                <button
                  key={digit}
                  onClick={() => toggleDigit(digit)}
                  className={`flex-1 py-3 rounded-xl text-lg font-medium transition flex items-center justify-center gap-2
                    ${settings.digits.includes(digit)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Hash className="w-4 h-4" />
                  {DIGIT_LABELS[digit]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              もんだいの数
            </label>
            <div className="flex gap-3">
              {[5, 10, 15].map((count) => (
                <button
                  key={count}
                  onClick={() => setSettings({ ...settings, problemCount: count })}
                  className={`flex-1 py-3 rounded-xl text-lg font-medium transition
                    ${settings.problemCount === count
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {count}問
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              制限時間（分）
            </label>
            <div className="flex gap-3">
              {[3, 5, 10].map((time) => (
                <button
                  key={time}
                  onClick={() => setSettings({ ...settings, timeLimit: time })}
                  className={`flex-1 py-3 rounded-xl text-lg font-medium transition flex items-center justify-center gap-2
                    ${settings.timeLimit === time
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Clock className="w-4 h-4" />
                  {time}分
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={onLogout}
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-lg font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              もどる
            </button>
            <button
              onClick={onShowHistory}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-medium py-3 rounded-xl hover:opacity-90 transition"
            >
              れきし
            </button>
            <button
              onClick={() => onStart(settings)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-medium py-3 rounded-xl hover:opacity-90 transition"
            >
              スタート！
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}