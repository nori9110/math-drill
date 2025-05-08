export type MathProblem = {
  id: string;
  question: string;
  answer: number;
  userAnswer?: number;
  operation: string;
  imageType?: string;
  answerDenominator?: number; // 分数の問題用
  calculation?: string; // 文章問題の計算式
  flashNumbers?: number[]; // フラッシュ暗算用の数字配列
  flashSpeed?: number; // フラッシュの表示速度（ミリ秒）
  flashInterval?: number; // フラッシュ表示間の間隔（ミリ秒）
  writtenCalculation?: {
    num1: number;
    num2: number;
    operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  }; // ひっさん用の計算情報
};

export type DrillSettings = {
  grade: 1 | 2 | 3 | 4;
  operations: ('addition' | 'subtraction' | 'multiplication' | 'division' | 'word' | 'flash' | 'written')[];
  problemCount: number;
  timeLimit: number; // 分単位
  digits: ('1digit' | '2digit' | '3digit')[]; // 桁数の選択を追加
  flashSpeed?: number; // フラッシュ暗算の表示速度（ミリ秒）
  flashNumberCount?: number; // フラッシュ暗算の数字の数
  flashInterval?: number; // フラッシュ暗算の数字間の表示間隔（ミリ秒）
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