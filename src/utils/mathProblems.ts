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

export function generateProblem(operation: string, grade: 1 | 2 | 3 | 4, digits: ('1digit' | '2digit' | '3digit')[]): MathProblem {
  while (true) {
    // 学年ごとに出題範囲・演算内容を分岐
    let allowedOperations: string[] = [];
    if (grade === 1) {
      allowedOperations = ['addition', 'subtraction'];
    } else if (grade === 2) {
      allowedOperations = ['addition', 'subtraction', 'multiplication', 'division'];
    } else {
      allowedOperations = ['addition', 'subtraction', 'multiplication', 'division'];
    }
    if (!allowedOperations.includes(operation)) {
      // 許可されていない演算は足し算にフォールバック
      operation = 'addition';
    }
    // ランダムに桁数を選択
    let selectedDigit: '1digit' | '2digit' | '3digit' = digits[Math.floor(Math.random() * digits.length)];
    // 学年ごとに桁数を制限
    if (grade === 1) selectedDigit = selectedDigit === '3digit' ? '2digit' : selectedDigit;
    if (grade === 1 && selectedDigit === '2digit') selectedDigit = Math.random() < 0.5 ? '1digit' : '2digit';
    if (grade === 2 && selectedDigit === '3digit') selectedDigit = '2digit';
    const range = getNumberRange(selectedDigit, grade);
    
    // フラッシュ暗算の場合
    if (operation === 'flash') {
      return generateFlashProblem({ grade, operations: [operation], problemCount: 1, timeLimit: 5, digits, flashNumberCount: 5, flashSpeed: 1000 });
    }
    
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
        num2 = generateRandomNumber(range.min, num1);
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case 'multiplication':
        if (grade === 2) {
          num1 = generateRandomNumber(1, 9);
          num2 = generateRandomNumber(1, 9);
        } else if (grade === 3) {
          num1 = generateRandomNumber(10, 99); // 2桁×1桁
          num2 = generateRandomNumber(1, 9);
        } else if (grade === 4) {
          num1 = generateRandomNumber(10, 99); // 2桁×2桁
          num2 = generateRandomNumber(10, 99);
        } else {
          num1 = generateRandomNumber(1, 9);
          num2 = generateRandomNumber(1, 9);
        }
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      case 'division':
        if (grade === 2) {
          answer = generateRandomNumber(1, 5);
          num2 = generateRandomNumber(1, 5);
          num1 = answer * num2;
        } else if (grade === 3) {
          answer = generateRandomNumber(1, 9);
          num2 = generateRandomNumber(1, 9);
          num1 = answer * num2;
        } else if (grade === 4) {
          answer = generateRandomNumber(10, 99);
          num2 = generateRandomNumber(1, 9);
          num1 = answer * num2;
        } else {
          answer = generateRandomNumber(1, 5);
          num2 = generateRandomNumber(1, 5);
          num1 = answer * num2;
        }
        question = `${num1} ÷ ${num2} = ?`;
        break;
      default:
        throw new Error('Invalid operation');
    }
    if (answer !== 0) {
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        question,
        answer,
        operation,
      };
    }
  }
}

// ひっさん問題を生成する関数
export function generateWrittenCalculationProblem(operation: string, grade: 1 | 2 | 3 | 4, digits: ('1digit' | '2digit' | '3digit')[]): MathProblem {
  while (true) {
    // 学年ごとに出題範囲・演算内容を分岐
    let allowedOperations: string[] = [];
    if (grade === 1) {
      allowedOperations = ['addition', 'subtraction'];
    } else if (grade === 2) {
      allowedOperations = ['addition', 'subtraction', 'multiplication', 'division'];
    } else {
      allowedOperations = ['addition', 'subtraction', 'multiplication', 'division'];
    }
    if (!allowedOperations.includes(operation)) {
      operation = 'addition';
    }
    // ランダムに桁数を選択
    let selectedDigit: '1digit' | '2digit' | '3digit' = digits[Math.floor(Math.random() * digits.length)];
    if (grade === 1) selectedDigit = selectedDigit === '3digit' ? '2digit' : selectedDigit;
    if (grade === 1 && selectedDigit === '2digit') selectedDigit = Math.random() < 0.5 ? '1digit' : '2digit';
    if (grade === 2 && selectedDigit === '3digit') selectedDigit = '2digit';
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
        num2 = generateRandomNumber(range.min, num1);
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case 'multiplication':
        if (grade === 2) {
          num1 = generateRandomNumber(1, 9);
          num2 = generateRandomNumber(1, 9);
        } else if (grade === 3) {
          num1 = generateRandomNumber(10, 99);
          num2 = generateRandomNumber(1, 9);
        } else if (grade === 4) {
          num1 = generateRandomNumber(10, 99);
          num2 = generateRandomNumber(10, 99);
        } else {
          num1 = generateRandomNumber(1, 9);
          num2 = generateRandomNumber(1, 9);
        }
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      case 'division':
        if (grade === 2) {
          answer = generateRandomNumber(1, 5);
          num2 = generateRandomNumber(1, 5);
          num1 = answer * num2;
        } else if (grade === 3) {
          answer = generateRandomNumber(1, 9);
          num2 = generateRandomNumber(1, 9);
          num1 = answer * num2;
        } else if (grade === 4) {
          answer = generateRandomNumber(10, 99);
          num2 = generateRandomNumber(1, 9);
          num1 = answer * num2;
        } else {
          answer = generateRandomNumber(1, 5);
          num2 = generateRandomNumber(1, 5);
          num1 = answer * num2;
        }
        question = `${num1} ÷ ${num2} = ?`;
        break;
      default:
        throw new Error('Invalid operation');
    }
    if (answer !== 0) {
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        question,
        answer,
        operation: 'written',
        writtenCalculation: {
          num1,
          num2,
          operation: operation as 'addition' | 'subtraction' | 'multiplication' | 'division'
        }
      };
    }
  }
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
      if (operation === 'written') {
        // ひっさん問題の場合、ランダムに演算を選択
        const writtenOperations = ['addition', 'subtraction', 'multiplication', 'division'] as const;
        const selectedOperation = writtenOperations[Math.floor(Math.random() * writtenOperations.length)];
        problems.push(generateWrittenCalculationProblem(selectedOperation, grade, digits));
      } else {
        problems.push(generateProblem(operation, grade, digits));
      }
    }
  });

  // 問題をシャッフル
  return problems.sort(() => Math.random() - 0.5);
}

// フラッシュ暗算の問題を生成する関数
function generateFlashProblem(settings: DrillSettings): MathProblem {
  const count = settings.flashNumberCount || 5;
  const speed = settings.flashSpeed || 1000;
  const interval = settings.flashInterval || 200;
  const numbers: number[] = [];
  
  // 1桁の数字をランダムに生成
  for (let i = 0; i < count; i++) {
    numbers.push(Math.floor(Math.random() * 9) + 1); // 1から9までの数字
  }
  
  // 合計を計算
  const answer = numbers.reduce((sum, num) => sum + num, 0);
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    question: 'フラッシュ暗算',
    answer,
    operation: 'flash',
    flashNumbers: numbers,
    flashSpeed: speed,
    flashInterval: interval
  };
}