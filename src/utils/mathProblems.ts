import type { DrillSettings, MathProblem } from '../types';

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNumberRange(digit: '1digit' | '2digit' | '3digit', grade: 1 | 2 | 3 | 4): { min: number; max: number } {
  switch (digit) {
    case '1digit':
      return { min: 1, max: 9 };
    case '2digit':
      return { min: 10, max: grade <= 2 ? 50 : 99 };
    case '3digit':
      return { min: 100, max: grade <= 2 ? 500 : 999 };
  }
}

function generateProblem(operation: string, grade: 1 | 2 | 3 | 4, digits: ('1digit' | '2digit' | '3digit')[]): MathProblem {
  // ランダムに桁数を選択
  const selectedDigit = digits[Math.floor(Math.random() * digits.length)];
  const range = getNumberRange(selectedDigit, grade);
  
  let num1: number, num2: number, answer: number, question: string;

  switch (operation) {
    case 'addition':
      num1 = generateRandomNumber(range.min, range.max);
      num2 = generateRandomNumber(range.min, range.max);
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;

    case 'subtraction':
      num1 = generateRandomNumber(range.min, range.max);
      // 引く数は同じ桁数以下になるようにする
      num2 = generateRandomNumber(range.min, num1);
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;

    case 'multiplication':
      if (grade <= 2) {
        // 1,2年生は1桁×1桁のみ
        num1 = generateRandomNumber(1, 9);
        num2 = generateRandomNumber(1, 9);
      } else if (selectedDigit === '1digit') {
        num1 = generateRandomNumber(1, 9);
        num2 = generateRandomNumber(1, 9);
      } else {
        // 3,4年生は2桁までの掛け算
        num1 = generateRandomNumber(range.min, Math.min(range.max, 99));
        num2 = generateRandomNumber(1, grade === 3 ? 9 : 99); // 4年生は2桁×2桁も可能
      }
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;

    case 'division':
      if (grade <= 2) {
        // 1,2年生は簡単な割り算のみ
        answer = generateRandomNumber(1, 5);
        num2 = generateRandomNumber(1, 5);
        num1 = answer * num2;
      } else if (selectedDigit === '1digit') {
        answer = generateRandomNumber(1, 9);
        num2 = generateRandomNumber(1, 9);
        num1 = answer * num2;
      } else {
        // 3,4年生はより複雑な割り算
        answer = generateRandomNumber(range.min, range.max);
        num2 = generateRandomNumber(1, grade === 3 ? 9 : 12);
        num1 = answer * num2;
      }
      question = `${num1} ÷ ${num2} = ?`;
      break;

    default:
      throw new Error('Invalid operation');
  }

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    question,
    answer,
    operation,
  };
}

export function generateProblems(settings: DrillSettings): MathProblem[] {
  const problems: MathProblem[] = [];
  const { operations, problemCount, grade, digits } = settings;

  // 各演算の問題数を計算
  const problemsPerOperation = Math.floor(problemCount / operations.length);
  const remainingProblems = problemCount % operations.length;

  // 各演算の問題を生成
  operations.forEach((operation, index) => {
    const count = index < remainingProblems 
      ? problemsPerOperation + 1 
      : problemsPerOperation;
    
    for (let i = 0; i < count; i++) {
      problems.push(generateProblem(operation, grade, digits));
    }
  });

  // 問題をシャッフル
  return problems.sort(() => Math.random() - 0.5);
}