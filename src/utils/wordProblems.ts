import type { DrillSettings, MathProblem } from '../types';

// 文章問題の種類
export type WordProblemType = 
  | 'shopping' // 買い物問題
  | 'time' // 時間の問題
  | 'weight' // 重さの問題
  | 'length' // 長さの問題
  | 'count' // 数の問題
  | 'division' // 割り算の文章問題
  | 'multiplication' // 掛け算の文章問題
  | 'fraction' // 分数の問題
  | 'geometry' // 図形の問題
  | 'mixed'; // 足し算と引き算の混合問題

// それぞれの問題種類に対応する画像
export const WORD_PROBLEM_IMAGES = {
  shopping: [
    '/images/word-problems/shopping.png',
  ],
  time: [
    '/images/word-problems/time.png',
  ],
  weight: [
    '/images/word-problems/weight.png',
  ],
  length: [
    '/images/word-problems/length.png',
  ],
  count: [
    '/images/word-problems/count.png',
  ],
  division: [
    '/images/word-problems/division.png',
  ],
  multiplication: [
    '/images/word-problems/multiplication.png',
  ],
  fraction: [
    '/images/word-problems/fraction.png',
  ],
  geometry: [
    '/images/word-problems/geometry.png',
  ],
  mixed: [
    '/images/word-problems/mixed.png',
  ],
};

// ランダムな整数を生成
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 学年に応じた数値範囲を取得
function getNumberRangeForGrade(grade: 1 | 2 | 3 | 4): {
  small: number;
  medium: number;
  large: number;
} {
  switch (grade) {
    case 1:
      return { small: 10, medium: 20, large: 50 };
    case 2:
      return { small: 20, medium: 50, large: 100 };
    case 3:
      return { small: 50, medium: 100, large: 500 };
    case 4:
      return { small: 100, medium: 500, large: 1000 };
  }
}

// 買い物問題を生成
function generateShoppingProblem(grade: 1 | 2 | 3 | 4) {
  const range = getNumberRangeForGrade(grade);
  const items = ['りんご', 'みかん', 'バナナ', 'いちご', 'ぶどう', 'メロン', 'パン', 'ジュース', 'チョコレート', 'アイス'];
  
  // ランダムに2つのアイテムを選択
  const item1Index = getRandomInt(0, items.length - 1);
  let item2Index = getRandomInt(0, items.length - 1);
  while (item2Index === item1Index) {
    item2Index = getRandomInt(0, items.length - 1);
  }
  
  const item1 = items[item1Index];
  const item2 = items[item2Index];
  
  // 価格を設定
  const price1 = getRandomInt(10, range.medium) * 10; // 10の倍数
  const price2 = getRandomInt(10, range.medium) * 10; // 10の倍数
  
  // 個数を設定
  const count1 = getRandomInt(1, 5);
  const count2 = getRandomInt(1, 5);
  
  // 答えを計算
  const answer = price1 * count1 + price2 * count2;
  const calculation = `${price1}円 × ${count1} + ${price2}円 × ${count2} = ${price1 * count1}円 + ${price2 * count2}円 = ${answer}円`;
  
  return {
    question: `${item1}が1つ${price1}円で、${item2}が1つ${price2}円です。${item1}を${count1}つと${item2}を${count2}つ買うと、全部でいくらになりますか？`,
    answer,
    operation: 'shopping',
    imageType: 'shopping',
    calculation
  };
}

// 時間問題を生成
function generateTimeProblem(grade: 1 | 2 | 3 | 4) {
  const activities = ['授業', '遊び', '映画', '読書', 'ゲーム', 'スポーツ', '勉強'];
  const activity = activities[getRandomInt(0, activities.length - 1)];
  
  let startHour, endHour, startMinute = 0, endMinute = 0;
  let calculation = '';
  
  if (grade <= 2) {
    // 1-2年生は時間のみ (分なし)
    startHour = getRandomInt(1, 12);
    endHour = startHour + getRandomInt(1, 5);
    if (endHour > 12) endHour = endHour - 12;
    
    const answerHours = endHour > startHour ? endHour - startHour : endHour + 12 - startHour;
    calculation = endHour > startHour 
      ? `${endHour}時 - ${startHour}時 = ${answerHours}時間` 
      : `${endHour}時 + 12時間 - ${startHour}時 = ${endHour + 12}時 - ${startHour}時 = ${answerHours}時間`;
    
    return {
      question: `${activity}は${startHour}時に始まって、${endHour}時に終わります。${activity}は何時間続きますか？`,
      answer: answerHours,
      operation: 'time',
      imageType: 'time',
      calculation
    };
  } else {
    // 3-4年生は時間と分
    startHour = getRandomInt(1, 12);
    startMinute = getRandomInt(0, 1) * 30; // 0分か30分
    
    // 終了時間を設定
    const totalStartMinutes = startHour * 60 + startMinute;
    const durationMinutes = getRandomInt(30, 180); // 30分〜3時間
    let totalEndMinutes = totalStartMinutes + durationMinutes;
    
    // 12時間制に変換
    while (totalEndMinutes >= 12 * 60) {
      totalEndMinutes -= 12 * 60;
    }
    
    endHour = Math.floor(totalEndMinutes / 60);
    endMinute = totalEndMinutes % 60;
    
    // 0時は12時と表示
    if (endHour === 0) endHour = 12;
    
    // 計算式
    calculation = `${startHour}時間 × 60分 + ${startMinute}分 = ${totalStartMinutes}分（開始時刻）\n${endHour}時間 × 60分 + ${endMinute}分 = ${totalEndMinutes}分（終了時刻）\n${totalEndMinutes}分 - ${totalStartMinutes}分 = ${durationMinutes}分`;
    
    // 質問文の作成
    let questionText = `${activity}は${startHour}時`;
    if (startMinute > 0) questionText += `${startMinute}分`;
    questionText += `に始まって、${endHour}時`;
    if (endMinute > 0) questionText += `${endMinute}分`;
    questionText += `に終わります。${activity}は何分間続きますか？`;
    
    return {
      question: questionText,
      answer: durationMinutes,
      operation: 'time',
      imageType: 'time',
      calculation
    };
  }
}

// 重さの問題を生成
function generateWeightProblem(grade: 1 | 2 | 3 | 4) {
  const range = getNumberRangeForGrade(grade);
  const items = ['お米', '小麦粉', 'じゃがいも', 'にんじん', 'りんご', 'みかん', '本', 'おもちゃ'];
  
  // ランダムに2つのアイテムを選択
  const item1Index = getRandomInt(0, items.length - 1);
  let item2Index = getRandomInt(0, items.length - 1);
  while (item2Index === item1Index) {
    item2Index = getRandomInt(0, items.length - 1);
  }
  
  const item1 = items[item1Index];
  const item2 = items[item2Index];
  
  // 重さを設定
  const weight1 = grade <= 2 ? getRandomInt(1, range.small) : getRandomInt(1, range.medium);
  const weight2 = grade <= 2 ? getRandomInt(1, range.small) : getRandomInt(1, range.medium);
  
  // 答えを計算
  const answer = weight1 + weight2;
  const calculation = `${weight1}kg + ${weight2}kg = ${answer}kg`;
  
  return {
    question: `${item1}の袋が${weight1}kgで、${item2}の袋が${weight2}kgです。${item1}の袋と${item2}の袋を合わせると、全部で何kgになりますか？`,
    answer,
    operation: 'weight',
    imageType: 'weight',
    calculation
  };
}

// 長さの問題を生成
function generateLengthProblem(grade: 1 | 2 | 3 | 4) {
  const range = getNumberRangeForGrade(grade);
  const items = ['ひも', 'テープ', 'リボン', '道', '線', '鉛筆', 'ものさし'];
  
  const item = items[getRandomInt(0, items.length - 1)];
  
  // 長さを設定
  const length1 = grade <= 2 ? getRandomInt(10, range.medium) : getRandomInt(10, range.large);
  const length2 = grade <= 2 ? getRandomInt(10, range.medium) : getRandomInt(10, range.large);
  
  // 単位
  const unit = grade <= 2 ? 'cm' : ['cm', 'm'][getRandomInt(0, 1)];
  
  // 答えを計算
  const answer = length1 + length2;
  const calculation = `${length1}${unit} + ${length2}${unit} = ${answer}${unit}`;
  
  return {
    question: `${item}の長さが${length1}${unit}で、もう1本の${item}の長さが${length2}${unit}です。2本の${item}をつなげると、全部で何${unit}になりますか？`,
    answer,
    operation: 'length',
    imageType: 'length',
    calculation
  };
}

// 数の問題を生成
function generateCountProblem(grade: 1 | 2 | 3 | 4) {
  const range = getNumberRangeForGrade(grade);
  const max = grade <= 2 ? range.small : range.medium;
  
  const groups = [
    { total: 'クラス', part: '男の子', remaining: '女の子' },
    { total: 'かご', part: '赤いりんご', remaining: '青いりんご' },
    { total: '文房具', part: '鉛筆', remaining: '消しゴム' },
    { total: '遊び道具', part: 'ボール', remaining: 'おもちゃ' },
    { total: 'お菓子', part: 'チョコレート', remaining: 'キャンディ' }
  ];
  
  const group = groups[getRandomInt(0, groups.length - 1)];
  
  // 数を設定
  const total = getRandomInt(Math.floor(max / 2), max);
  const part = getRandomInt(1, total - 1);
  
  // 答えを計算
  const answer = total - part;
  const calculation = `${total} - ${part} = ${answer}`;
  
  return {
    question: `${group.total}には${total}個（人）あります。そのうち${part}個（人）が${group.part}です。${group.remaining}は何個（人）いますか？`,
    answer,
    operation: 'count',
    imageType: 'count',
    calculation
  };
}

// 割り算の問題を生成
function generateDivisionProblem(grade: 1 | 2 | 3 | 4) {
  const range = getNumberRangeForGrade(grade);
  
  const scenarios = [
    { item: 'クッキー', recipient: '友達' },
    { item: 'みかん', recipient: '家族' },
    { item: 'チョコレート', recipient: '友達' },
    { item: 'シール', recipient: '友達' },
    { item: 'おかし', recipient: '子ども' }
  ];
  
  const scenario = scenarios[getRandomInt(0, scenarios.length - 1)];
  
  // 数を設定
  let divisor, total;
  
  if (grade <= 2) {
    // 1-2年生は簡単な割り算
    divisor = getRandomInt(2, 5);
    total = divisor * getRandomInt(1, 10);
  } else {
    // 3-4年生はより複雑な割り算
    divisor = getRandomInt(2, 10);
    total = divisor * getRandomInt(1, range.small);
  }
  
  // 答えを計算
  const answer = total / divisor;
  const calculation = `${total} ÷ ${divisor} = ${answer}`;
  
  return {
    question: `${total}個の${scenario.item}を${divisor}人の${scenario.recipient}で分けると、1人あたり何個になりますか？`,
    answer,
    operation: 'division',
    imageType: 'division',
    calculation
  };
}

// 掛け算の問題を生成
function generateMultiplicationProblem(grade: 1 | 2 | 3 | 4) {
  const containers = [
    { container: '箱', item: '卵' },
    { container: '袋', item: 'みかん' },
    { container: 'パック', item: 'いちご' },
    { container: '箱', item: 'クレヨン' },
    { container: '束', item: '鉛筆' }
  ];
  
  const container = containers[getRandomInt(0, containers.length - 1)];
  
  // 数を設定
  let itemCount, containerCount;
  
  if (grade <= 2) {
    // 1-2年生は簡単な掛け算
    itemCount = getRandomInt(2, 10);
    containerCount = getRandomInt(2, 5);
  } else {
    // 3-4年生はより複雑な掛け算
    itemCount = getRandomInt(5, 20);
    containerCount = getRandomInt(3, 10);
  }
  
  // 答えを計算
  const answer = itemCount * containerCount;
  const calculation = `${itemCount} × ${containerCount} = ${answer}`;
  
  return {
    question: `1${container.container}に${itemCount}個の${container.item}が入っています。${containerCount}${container.container}では全部で何個の${container.item}になりますか？`,
    answer,
    operation: 'multiplication',
    imageType: 'multiplication',
    calculation
  };
}

// 分数の問題を生成 (3-4年生向け)
function generateFractionProblem(grade: 1 | 2 | 3 | 4) {
  const items = ['ピザ', 'ケーキ', 'チョコレート', 'みかん', 'りんご'];
  const item = items[getRandomInt(0, items.length - 1)];
  
  // 分母と食べた部分を設定
  const denominator = grade <= 2 ? getRandomInt(2, 4) : getRandomInt(2, 8);
  const eaten = getRandomInt(1, denominator - 1);
  
  // 答えを計算（分数で表す）
  const numerator = denominator - eaten;
  const calculation = `1 - ${eaten}/${denominator} = ${numerator}/${denominator}`;
  
  return {
    question: `${item}を${denominator}つに分けました。そのうち${eaten}つを食べました。残りの${item}は全体の何分のいくつですか？`,
    answer: numerator, // フロントエンドで分母と組み合わせる
    answerDenominator: denominator,
    operation: 'fraction',
    imageType: 'fraction',
    calculation
  };
}

// 図形の問題を生成
function generateGeometryProblem(grade: 1 | 2 | 3 | 4) {
  const shapes = [
    { name: '正方形', sides: 4, formula: (length: number) => length * 4 },
    { name: '長方形', sides: 4, formula: (length: number, width: number = 0) => 2 * (length + width) }
  ];
  
  const shape = shapes[getRandomInt(0, shapes.length - 1)];
  
  // 寸法を設定
  const length = getRandomInt(1, 20);
  const width = getRandomInt(1, 20);
  
  let question: string;
  let answer: number;
  let calculation: string;
  
  if (shape.name === '正方形') {
    question = `${shape.name}の1辺の長さが${length}cmです。${shape.name}の周りの長さは何cmですか？`;
    answer = shape.formula(length);
    calculation = `${length}cm × 4 = ${answer}cm`;
  } else {
    question = `${shape.name}の長さが${length}cm、幅が${width}cmです。${shape.name}の周りの長さは何cmですか？`;
    answer = shape.formula(length, width);
    calculation = `(${length}cm + ${width}cm) × 2 = ${length + width}cm × 2 = ${answer}cm`;
  }
  
  return {
    question,
    answer,
    operation: 'geometry',
    imageType: 'geometry',
    calculation
  };
}

// 足し算と引き算の混合問題を生成
function generateMixedProblem(grade: 1 | 2 | 3 | 4) {
  const range = getNumberRangeForGrade(grade);
  const max = grade <= 2 ? range.small : range.medium;
  
  const scenarios = [
    { total: '公園に鳩', action1: '飛び立ち', action2: '飛んできました' },
    { total: 'かごにりんご', action1: '食べて', action2: '新しく入れました' },
    { total: 'クラスに子ども', action1: '早退して', action2: '遅れてきました' },
    { total: '本棚に本', action1: '借りて', action2: '返しました' }
  ];
  
  const scenario = scenarios[getRandomInt(0, scenarios.length - 1)];
  
  // 数を設定
  const initial = getRandomInt(Math.floor(max / 2), max);
  const subtract = getRandomInt(1, Math.floor(initial / 2));
  const add = getRandomInt(1, Math.floor(max / 2));
  
  // 答えを計算
  const answer = initial - subtract + add;
  const calculation = `${initial} - ${subtract} + ${add} = ${initial - subtract} + ${add} = ${answer}`;
  
  return {
    question: `${scenario.total}が${initial}ありました。そのうち${subtract}が${scenario.action1}、その後${add}が${scenario.action2}。今、全部で何になりますか？`,
    answer,
    operation: 'mixed',
    imageType: 'mixed',
    calculation
  };
}

// 学年に応じた問題種類を取得
function getProblemTypesForGrade(grade: 1 | 2 | 3 | 4): WordProblemType[] {
  switch (grade) {
    case 1:
      return ['shopping', 'count', 'length', 'weight'];
    case 2:
      return ['shopping', 'count', 'length', 'weight', 'time', 'multiplication', 'division'];
    case 3:
    case 4:
      return [
        'shopping', 'count', 'length', 'weight', 'time',
        'multiplication', 'division', 'fraction', 'geometry', 'mixed'
      ];
  }
}

// 文章問題を生成する関数
export function generateWordProblem(settings: DrillSettings) {
  const { grade } = settings;
  
  // 学年に応じた問題タイプを取得
  const availableTypes = getProblemTypesForGrade(grade);
  
  // ランダムな問題タイプを選択
  const problemType = availableTypes[getRandomInt(0, availableTypes.length - 1)];
  
  // 選択された問題タイプに基づいて問題を生成
  switch (problemType) {
    case 'shopping':
      return generateShoppingProblem(grade);
    case 'time':
      return generateTimeProblem(grade);
    case 'weight':
      return generateWeightProblem(grade);
    case 'length':
      return generateLengthProblem(grade);
    case 'count':
      return generateCountProblem(grade);
    case 'division':
      return generateDivisionProblem(grade);
    case 'multiplication':
      return generateMultiplicationProblem(grade);
    case 'fraction':
      return generateFractionProblem(grade);
    case 'geometry':
      return generateGeometryProblem(grade);
    case 'mixed':
      return generateMixedProblem(grade);
    default:
      return generateShoppingProblem(grade);
  }
}

// 指定した数の文章問題を生成
export function generateWordProblems(settings: DrillSettings): MathProblem[] {
  const problems: MathProblem[] = [];
  const { problemCount } = settings;
  
  for (let i = 0; i < problemCount; i++) {
    const problem = generateWordProblem(settings);
    
    problems.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      question: problem.question,
      answer: problem.answer,
      operation: problem.operation,
      imageType: problem.imageType || problem.operation,
      ...(problem.answerDenominator && { answerDenominator: problem.answerDenominator }),
      ...(problem.calculation && { calculation: problem.calculation })
    });
  }
  
  return problems;
} 