import React, { useState, useEffect } from 'react';
import { SettingsScreen } from './components/SettingsScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { WordProblemScreen } from './components/WordProblemScreen';
import { WrittenProblemScreen } from './components/WrittenProblemScreen';
import { FlashProblemScreen } from './components/FlashProblemScreen';
import { LoginScreen } from './components/LoginScreen';
import { generateProblem, generateWrittenCalculationProblem } from './utils/mathProblems';
import { generateWordProblems } from './utils/wordProblems';
import type { User, DrillSettings, MathProblem, DrillResult } from './types';

// 画面遷移を管理する型定義
type AppState = {
  screen: 'start' | 'settings' | 'problem' | 'word' | 'flash' | 'written' | 'result' | 'history';
  user?: User;
  problems?: MathProblem[];
  currentProblemIndex?: number;
  solvedProblems?: MathProblem[];
  timeSpent?: number;
  settings?: DrillSettings;
  startTime?: number;
  displayMode?: 'normal' | 'written' | 'flash';
};

const OPERATION_NAMES: Record<string, string> = {
  addition: 'たし算',
  subtraction: 'ひき算',
  multiplication: 'かけ算',
  division: 'わり算',
  word: '文章問題',
  flash: 'フラッシュ暗算',
  written: 'ひっさん'
};

function App() {
  const [state, setState] = useState<AppState>({
    screen: 'start',
  });

  const [history, setHistory] = useState<DrillResult[]>(() => {
    const saved = localStorage.getItem('drillHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // 通常問題用の入力値を管理
  const [normalAnswer, setNormalAnswer] = useState('');
  useEffect(() => {
    setNormalAnswer('');
  }, [state.currentProblemIndex, state.screen]);

  // 問題タイプに基づいて適切な画面を返す
  const getScreenForProblemType = (operation: string): AppState['screen'] => {
    switch (operation) {
      case 'word':
        return 'word';
      case 'flash':
        return 'flash';
      case 'written':
        return 'written';
      default:
        return 'problem';
    }
  };

  function generateFlashProblem(numbers: number[], operation: string): { numbers: number[], answer: number } {
    let answer = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      switch (operation) {
        case 'addition':
          answer += numbers[i];
          break;
        case 'subtraction':
          answer -= numbers[i];
          break;
        case 'multiplication':
          answer *= numbers[i];
          break;
        case 'division':
          answer = Math.floor(answer / numbers[i]);
          break;
        default:
          answer += numbers[i];
      }
    }
    return { numbers, answer };
  }

  // 設定に基づいて問題を生成
  const generateProblemsBasedOnSettings = (settings: DrillSettings, displayMode: 'normal' | 'written' | 'flash'): MathProblem[] => {
    let problems: MathProblem[] = [];

    // フラッシュ暗算：問題数分だけ各問題で数字列を生成し、計算種別で合計値を計算
    if (displayMode === 'flash' && settings.operations.length > 0) {
      for (let i = 0; i < settings.problemCount; i++) {
        const numbers = generateFlashNumbers(settings.digits, settings.flashNumberCount || 3);
        const { answer } = generateFlashProblem(numbers, settings.operations[0]);
        problems.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + i,
          question: 'フラッシュ暗算',
          answer,
          operation: 'flash',
          flashNumbers: numbers,
          flashInterval: settings.flashInterval,
        });
      }
      return problems;
    }

    // ひっさん・通常：選択した種別で合計が問題数になるよう均等配分＋余り分配
    if ((displayMode === 'written' || displayMode === 'normal') && settings.operations.length > 0) {
      const problemsPerOperation = Math.floor(settings.problemCount / settings.operations.length);
      const remainingProblems = settings.problemCount % settings.operations.length;
      settings.operations.forEach((operation, index) => {
        const count = index < remainingProblems ? problemsPerOperation + 1 : problemsPerOperation;
        for (let i = 0; i < count; i++) {
          if (operation === 'word' || operation === 'flash') {
            // 文章問題やフラッシュ暗算はここでは生成しない
            continue;
          }
          if (displayMode === 'written') {
            problems.push(generateWrittenCalculationProblem(operation, settings.grade, settings.digits));
          } else {
            problems.push(generateProblem(operation, settings.grade, settings.digits));
          }
        }
      });
      // problemsが空の場合は下のword/flash生成に任せる
      if (problems.length > 0) {
        return problems.sort(() => Math.random() - 0.5);
      }
    }

    // 文章問題（通常モードのみ）
    if (displayMode === 'normal' && settings.operations.includes('word')) {
      const wordProblemCount = Math.floor(settings.problemCount / settings.operations.length) || settings.problemCount;
      const wordSettings = { ...settings, problemCount: wordProblemCount };
      const wordProblems = generateWordProblems(wordSettings);
      problems = problems.concat(wordProblems);
      return problems;
    }

    // 問題をシャッフル
    return problems.sort(() => Math.random() - 0.5);
  };

  // 問題回答処理（共通化）
  const handleProblemAnswer = (problem: MathProblem, userAnswer: number) => {
    const updatedProblem = { ...problem, userAnswer };
    const solvedProblems = state.solvedProblems ? [...state.solvedProblems, updatedProblem] : [updatedProblem];
    const timeSpent = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;

    if (state.currentProblemIndex !== undefined && state.problems && state.currentProblemIndex < state.problems.length - 1) {
      // 次の問題へ進む
      const nextProblemIndex = state.currentProblemIndex + 1;
      const nextProblemType = state.problems[nextProblemIndex].operation;
      setState(prevState => ({
        ...prevState,
        screen: getScreenForProblemType(nextProblemType),
        currentProblemIndex: nextProblemIndex,
        solvedProblems,
        timeSpent,
      }));
    } else {
      // 全問題終了、結果画面へ＆履歴保存
      if (state.settings && state.user) {
        const correctCount = solvedProblems.filter(p => p.answer === p.userAnswer).length;
        const score = Math.round((correctCount / solvedProblems.length) * 100);

        const result: DrillResult = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          username: state.user.username,
          operations: state.settings.operations.map(op => OPERATION_NAMES[op as keyof typeof OPERATION_NAMES] || op),
          problemCount: solvedProblems.length,
          correctCount,
          timeLimit: state.settings.timeLimit,
          timeSpent,
          score,
          problems: solvedProblems,
        };

        const newHistory = [result, ...history];
        setHistory(newHistory);
        localStorage.setItem('drillHistory', JSON.stringify(newHistory));
      }
      setState(prevState => ({
        ...prevState,
        screen: 'result',
        solvedProblems,
        timeSpent,
      }));
    }
  };

  // 文章問題とフラッシュ暗算は同じ処理を使用
  const handleWordProblemAnswer = handleProblemAnswer;
  const handleWrittenProblemAnswer = handleProblemAnswer;

  // フラッシュ暗算の問題生成（1問分の数字列を生成）
  const generateFlashNumbers = (digits: ('1digit' | '2digit' | '3digit')[], count: number) => {
    const digit = digits[0] || '1digit';
    let min = 1, max = 9;
    if (digit === '2digit') { min = 10; max = 99; }
    if (digit === '3digit') { min = 100; max = 999; }
    const numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return numbers;
  };

  // メインのレンダリング部分
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ユーザー情報が未設定の場合はログイン画面を表示 */}
      {(!state.user || !state.user.username) && (
        <LoginScreen
          onLogin={(username, grade) => {
            setState({
              screen: 'settings',
              user: { username, grade },
            });
          }}
        />
      )}
      {/* ユーザー情報がある場合のみ他の画面を表示 */}
      {state.user && state.user.username && (
        <>
          {state.screen === 'start' && (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-4xl font-bold mb-8">算数ドリル</h1>
              <div className="space-y-4">
                <button
                  onClick={() => setState({ ...state, screen: 'settings' })}
                  className="w-64 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  はじめる
                </button>
                <button
                  onClick={() => setState({ ...state, screen: 'history' })}
                  className="w-64 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  履歴を見る
                </button>
              </div>
            </div>
          )}
          
          {state.screen === 'settings' && (
            <SettingsScreen
              onStart={(settings, displayMode) => {
                const problems = generateProblemsBasedOnSettings(settings, displayMode);
                const firstOperation = problems[0]?.operation || (settings.operations[0] ?? 'problem');
                setState({
                  ...state,
                  screen: getScreenForProblemType(firstOperation),
                  settings: { ...settings, grade: state.user?.grade ?? 1 },
                  problems,
                  currentProblemIndex: 0,
                  startTime: Date.now(),
                  displayMode,
                });
              }}
              username={state.user?.username || ''}
              grade={state.user?.grade ?? 1}
              onShowHistory={() => setState({ ...state, screen: 'history' })}
            />
          )}
          
          {state.screen === 'problem' && state.problems && state.currentProblemIndex !== undefined && (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {state.problems[state.currentProblemIndex].question}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const answer = parseInt(normalAnswer, 10);
                    if (!isNaN(answer)) {
                      handleProblemAnswer(state.problems![state.currentProblemIndex!], answer);
                      setNormalAnswer('');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                      答えを入力してください
                    </label>
                    <input
                      type="number"
                      id="answer"
                      name="answer"
                      value={normalAnswer}
                      onChange={e => setNormalAnswer(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="答えを入力"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    答え合わせ
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {state.screen === 'word' && state.problems && state.currentProblemIndex !== undefined && (
            <WordProblemScreen
              problem={state.problems[state.currentProblemIndex]}
              onAnswer={handleWordProblemAnswer}
              totalProblems={state.problems.length}
              currentProblem={state.currentProblemIndex + 1}
            />
          )}
          
          {state.screen === 'flash' && state.problems && state.currentProblemIndex !== undefined && state.settings && (
            <FlashProblemScreen
              numbers={state.problems[state.currentProblemIndex!].flashNumbers || []}
              flashInterval={state.settings.flashInterval || 800}
              onAnswer={(userAnswer) => {
                const updatedProblem = {
                  ...state.problems![state.currentProblemIndex!],
                  userAnswer,
                };
                const solvedProblems = state.solvedProblems ? [...state.solvedProblems, updatedProblem] : [updatedProblem];
                if (state.currentProblemIndex! < state.problems!.length - 1) {
                  setState({
                    ...state,
                    currentProblemIndex: state.currentProblemIndex! + 1,
                    solvedProblems,
                  });
                } else {
                  const timeSpent = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
                  setState({
                    ...state,
                    screen: 'result',
                    solvedProblems,
                    timeSpent,
                  });
                }
              }}
              totalProblems={state.problems.length}
              currentProblem={state.currentProblemIndex! + 1}
            />
          )}
          
          {state.screen === 'written' && state.problems && state.currentProblemIndex !== undefined && (
            <WrittenProblemScreen
              problem={state.problems[state.currentProblemIndex]}
              onAnswer={handleWrittenProblemAnswer}
              totalProblems={state.problems.length}
              currentProblem={state.currentProblemIndex + 1}
            />
          )}
          
          {state.screen === 'result' && state.solvedProblems && (
            <ResultScreen
              problems={state.solvedProblems}
              timeSpent={state.timeSpent || 0}
              onRetry={() => setState({
                screen: 'settings',
                user: state.user,
              })}
            />
          )}
          
          {state.screen === 'history' && (
            <HistoryScreen
              history={history}
              onBack={() => setState({ ...state, screen: 'settings' })}
              onShowDetail={(item) => {
                setState({
                  ...state,
                  screen: 'result',
                  solvedProblems: item.problems,
                  timeSpent: item.timeSpent,
                });
              }}
              onClearHistory={() => {
                setHistory([]);
                localStorage.removeItem('drillHistory');
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;