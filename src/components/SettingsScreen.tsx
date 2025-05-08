import React, { useState } from 'react';
import { Calculator, LogOut } from 'lucide-react';
import type { DrillSettings } from '../types';

// 表示方式の型
const DISPLAY_MODES = [
  { value: 'normal', label: '通常' },
  { value: 'written', label: 'ひっさん' },
  { value: 'flash', label: 'フラッシュ暗算' },
] as const;
type DisplayMode = typeof DISPLAY_MODES[number]['value'];

const OPERATION_OPTIONS_NORMAL = [
  { value: 'addition', label: '足し算' },
  { value: 'subtraction', label: 'ひき算' },
  { value: 'multiplication', label: 'かけ算' },
  { value: 'division', label: 'わり算' },
  { value: 'word', label: '文章問題' },
];
const OPERATION_OPTIONS_WRITTEN = [
  { value: 'addition', label: '足し算' },
  { value: 'subtraction', label: 'ひき算' },
  { value: 'multiplication', label: 'かけ算' },
  { value: 'division', label: 'わり算' },
];
const OPERATION_OPTIONS_FLASH = [
  { value: 'addition', label: '足し算' },
  { value: 'subtraction', label: 'ひき算' },
  { value: 'multiplication', label: 'かけ算' },
  { value: 'division', label: 'わり算' },
];

const PROBLEM_COUNTS = [3, 5, 10];
const DIGIT_OPTIONS = [
  { value: '1digit', label: '1桁' },
  { value: '2digit', label: '2桁' },
  { value: '3digit', label: '3桁' },
];
const TIME_LIMITS = [1, 3, 5, 10];

const FLASH_INTERVAL_OPTIONS = [
  { label: '遅い', value: 1200 },
  { label: '通常', value: 800 },
  { label: '早い', value: 400 },
];

const FLASH_NUMBER_COUNT_OPTIONS = [3, 5, 7, 10];

type SettingsScreenProps = {
  onStart: (settings: DrillSettings, displayMode: 'normal' | 'written' | 'flash') => void;
  username: string;
  grade: 1 | 2 | 3 | 4;
  onShowHistory: () => void;
  onLogout?: () => void;
};

export function SettingsScreen({ onStart, username, grade, onShowHistory, onLogout }: SettingsScreenProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('normal');
  const [operations, setOperations] = useState<DrillSettings['operations']>(['addition']);
  const [problemCount, setProblemCount] = useState(5);
  const [digits, setDigits] = useState<DrillSettings['digits']>(['1digit']);
  const [timeLimit, setTimeLimit] = useState(3);
  const [flashInterval, setFlashInterval] = useState(800);
  const [flashNumberCount, setFlashNumberCount] = useState(3);

  // 表示方式ごとの選択肢
  let operationOptions = OPERATION_OPTIONS_NORMAL;
  if (displayMode === 'written') operationOptions = OPERATION_OPTIONS_WRITTEN;
  if (displayMode === 'flash') operationOptions = OPERATION_OPTIONS_FLASH;

  // 表示方式切り替え時の処理
  const handleDisplayModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
    if (mode === 'flash') {
      setOperations(['addition']);
    } else {
      setOperations(['addition']);
    }
    // ひっさんモードの場合は2桁を初期値に
    if (mode === 'written') {
      setDigits(['2digit']);
    } else {
      setDigits(['1digit']);
    }
  };

  // 問題の種類のトグル（複数選択用）
  const toggleOperation = (operation: DrillSettings['operations'][number]) => {
    setOperations(prev =>
      prev.includes(operation)
        ? prev.filter(op => op !== operation)
        : [...prev, operation]
    );
  };

  // 桁数のトグル
  const toggleDigit = (digit: DrillSettings['digits'][number]) => {
    setDigits(prev =>
      prev.includes(digit)
        ? prev.filter(d => d !== digit)
        : [...prev, digit]
    );
  };

  // 設定の送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalOperations = operations;
    if (displayMode === 'flash') {
      finalOperations = [operations[0]];
    }
    onStart({
      grade,
      operations: finalOperations,
      problemCount,
      timeLimit,
      digits,
      flashInterval,
      flashNumberCount,
    }, displayMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Calculator className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-green-600 text-center">
            {username}さん、どんな問題にちょうせんする？
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2. 表示方式 */}
          <div>
            <label className="block text-lg font-bold underline text-gray-700 mb-2">計算式の表示</label>
            <div className="flex gap-4">
              {DISPLAY_MODES.map(mode => (
                <label key={mode.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value={mode.value}
                    checked={displayMode === mode.value}
                    onChange={() => handleDisplayModeChange(mode.value)}
                    className="accent-blue-500"
                  />
                  <span className="font-bold">{mode.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* 3. 問題の種類 */}
          <div>
            <label className="block text-lg font-bold underline text-gray-700 mb-2">問題の種類</label>
            <div className="grid grid-cols-2 gap-2">
              {displayMode === 'flash'
                ? operationOptions.map(op => (
                    <label key={op.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="operation"
                        value={op.value}
                        checked={operations[0] === op.value}
                        onChange={() => setOperations([op.value as DrillSettings['operations'][number]])}
                        className="accent-blue-500"
                      />
                      <span className="font-bold">{op.label}</span>
                    </label>
                  ))
                : operationOptions.map(op => (
                    <label key={op.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={operations.includes(op.value as DrillSettings['operations'][number])}
                        onChange={() => toggleOperation(op.value as DrillSettings['operations'][number])}
                        className="accent-blue-500"
                      />
                      <span className="font-bold">{op.label}</span>
                    </label>
                  ))}
            </div>
          </div>
          {/* 4. 問題数 */}
          <div>
            <label className="block text-lg font-bold underline text-gray-700 mb-2">問題数</label>
            <div className="flex gap-4">
              {PROBLEM_COUNTS.map(count => (
                <label key={count} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="problemCount"
                    value={count}
                    checked={problemCount === count}
                    onChange={() => setProblemCount(count)}
                    className="accent-blue-500"
                  />
                  <span className="font-bold">{count}問</span>
                </label>
              ))}
            </div>
          </div>
          {/* 5. 桁数 */}
          <div>
            <label className="block text-lg font-bold underline text-gray-700 mb-2">桁数</label>
            <div className="flex gap-4">
              {DIGIT_OPTIONS.map(digit => (
                <label key={digit.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={digits.includes(digit.value as DrillSettings['digits'][number])}
                    onChange={() => toggleDigit(digit.value as DrillSettings['digits'][number])}
                    className="accent-blue-500"
                  />
                  <span className="font-bold">{digit.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* 6. 制限時間 */}
          <div>
            <label className="block text-lg font-bold underline text-gray-700 mb-2">制限時間</label>
            <div className="flex gap-4">
              {TIME_LIMITS.map(limit => (
                <label key={limit} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeLimit"
                    value={limit}
                    checked={timeLimit === limit}
                    onChange={() => setTimeLimit(limit)}
                    className="accent-blue-500"
                  />
                  <span className="font-bold">{limit}分</span>
                </label>
              ))}
            </div>
          </div>
          {/* フラッシュ暗算用 表示間隔 */}
          {displayMode === 'flash' && (
            <div>
              <label className="block text-lg font-bold underline text-gray-700 mb-2">表示間隔</label>
              <div className="flex gap-4">
                {FLASH_INTERVAL_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="flashInterval"
                      value={opt.value}
                      checked={flashInterval === opt.value}
                      onChange={() => setFlashInterval(opt.value)}
                      className="accent-blue-500"
                    />
                    <span className="font-bold">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* フラッシュ暗算用 フラッシュする数字の数 */}
          {displayMode === 'flash' && (
            <div>
              <label className="block text-lg font-bold underline text-gray-700 mb-2">フラッシュする数字の数</label>
              <div className="flex gap-4">
                {FLASH_NUMBER_COUNT_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="flashNumberCount"
                      value={opt}
                      checked={flashNumberCount === opt}
                      onChange={() => setFlashNumberCount(opt)}
                      className="accent-blue-500"
                    />
                    <span className="font-bold">{opt}個</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* 7. メニュー */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button
              type="button"
              onClick={onLogout}
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-lg font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              もどる
            </button>
            <button
              type="button"
              onClick={onShowHistory}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-medium py-3 rounded-xl hover:opacity-90 transition"
            >
              りれき
            </button>
            <button
              type="submit"
              className="text-white text-lg font-medium py-3 rounded-xl hover:opacity-90 transition bg-gradient-to-r from-green-500 to-blue-500"
            >
              スタート！
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}