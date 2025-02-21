import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DrillScreen } from './components/DrillScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { generateProblems } from './utils/mathProblems';
import type { User, DrillSettings, MathProblem, DrillResult } from './types';

type AppState = {
  screen: 'login' | 'settings' | 'drill' | 'result' | 'history' | 'history-detail';
  user?: User;
  problems?: MathProblem[];
  solvedProblems?: MathProblem[];
  timeSpent?: number;
  settings?: DrillSettings;
  selectedHistoryItem?: DrillResult;
};

const OPERATION_NAMES = {
  addition: 'たし算',
  subtraction: 'ひき算',
  multiplication: 'かけ算',
  division: 'わり算',
};

function App() {
  const [state, setState] = useState<AppState>({
    screen: 'login',
  });

  const [history, setHistory] = useState<DrillResult[]>(() => {
    const saved = localStorage.getItem('drillHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const handleLogin = (username: string, grade: 1 | 2 | 3 | 4) => {
    setState({
      ...state,
      screen: 'settings',
      user: { username, grade },
    });
  };

  const handleStart = (settings: DrillSettings) => {
    const problems = generateProblems(settings);
    setState({
      ...state,
      screen: 'drill',
      problems,
      settings,
    });
  };

  const handleComplete = (solvedProblems: MathProblem[], timeSpent: number) => {
    if (state.settings && state.user) {
      const correctCount = solvedProblems.filter(
        (p) => p.answer === p.userAnswer
      ).length;
      const score = Math.round((correctCount / solvedProblems.length) * 100);

      const result: DrillResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        username: state.user.username,
        operations: state.settings.operations.map(op => OPERATION_NAMES[op]),
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

    setState({
      ...state,
      screen: 'result',
      solvedProblems,
      timeSpent,
    });
  };

  const handleRetry = () => {
    setState({
      ...state,
      screen: 'settings',
    });
  };

  const handleShowHistory = () => {
    setState({
      ...state,
      screen: 'history',
    });
  };

  const handleShowHistoryDetail = (historyItem: DrillResult) => {
    setState({
      ...state,
      screen: 'history-detail',
      selectedHistoryItem: historyItem,
    });
  };

  const handleLogout = () => {
    setState({
      screen: 'login',
    });
  };

  switch (state.screen) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
    case 'settings':
      return (
        <SettingsScreen
          onStart={handleStart}
          username={state.user?.username || ''}
          onShowHistory={handleShowHistory}
          onLogout={handleLogout}
        />
      );
    case 'drill':
      return state.problems && state.settings ? (
        <DrillScreen
          problems={state.problems}
          timeLimit={state.settings.timeLimit}
          onComplete={handleComplete}
        />
      ) : null;
    case 'result':
      return state.solvedProblems ? (
        <ResultScreen
          problems={state.solvedProblems}
          timeSpent={state.timeSpent}
          onRetry={handleRetry}
        />
      ) : null;
    case 'history':
      return (
        <HistoryScreen
          history={history}
          onBack={() => setState({ ...state, screen: 'settings' })}
          onShowDetail={handleShowHistoryDetail}
        />
      );
    case 'history-detail':
      return state.selectedHistoryItem ? (
        <ResultScreen
          problems={state.selectedHistoryItem.problems}
          timeSpent={state.selectedHistoryItem.timeSpent}
          onRetry={() => setState({ ...state, screen: 'history' })}
          isHistoryView
        />
      ) : null;
    default:
      return null;
  }
}

export default App;