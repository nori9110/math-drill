export type MathProblem = {
  id: string;
  question: string;
  answer: number;
  userAnswer?: number;
  operation: string;
};

export type DrillSettings = {
  grade: 1 | 2 | 3 | 4;
  operations: ('addition' | 'subtraction' | 'multiplication' | 'division')[];
  problemCount: number;
  timeLimit: number; // 分単位
  digits: ('1digit' | '2digit' | '3digit')[]; // 桁数の選択を追加
};

export type User = {
  username: string;
  grade: 1 | 2 | 3 | 4;
};

export type DrillResult = {
  id: string;
  date: string;
  username: string;
  operations: string[];
  problemCount: number;
  correctCount: number;
  timeLimit: number;
  timeSpent: number; // 秒単位
  score: number;
  problems: MathProblem[];
};