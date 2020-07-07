export const DIM = 5;
export const INF = 10000000;
export const BB_TB_MAP = [
//  P         P         L         L         P         P         L       L
//  Low,      Upper     Low,      Upper     Low,      Upper     Low,    Upper

    [0,       49,       0,        50,       0,        1.2,      0,      1.3],
    [50,      66.7,     50,       69,       1.2,      2.5,      1.3,    2.5],
    [66.7,    78.1,     69,       79.5,     2.5,      3.5,      2.5,    3.9],
    [78.1,    80.5,     79.5,     81.8,     3.5,      4,        3.9  ,   45],
    [80.5,    INF,      81.8,     INF,      4,       INF,       5,     INF],

    [0,       50,       0,        52,       0,        3.8,      0,      3.9],
    [50,      67.8,     52,       70,       3.8,      6,        3.9,    7.6],
    [67.8,    79.2,     70,       80.5,     6,        11.5,     7.6,    12],
    [79.2,    80.5,     80.5,     81.9,     11.5,     13,       12  ,   15],
    [80.5,    INF,      81.9,     INF,      13,       INF,      15,     INF],

    [0,       53,       0,        55,       0,        4,        0,      4.85],
    [53,      70,       55,       80,       4,        8,        4.85,   8],
    [70,      92.9,     80,       93.9,     8,        14.8,     8,      15.3],
    [92.9,    96.8,     93.9,     96,       14.8,     16,       15.3,   16.7],
    [96.8,    INF,      96,       INF,      16,       INF,      16.7,   INF],

    [0,       55,       0,        56.8,     0,        5,        0,      5.5],
                                                      // X
    [55,      85,       56.8,     88.7,     5,        9.8,      5.5,    11.12],
    [85,      101.7,    88.7,     103.5,    9.8,      18.1,     11.2,   18.3],
    [101.7,   105,      103.5,    105,      18.1,     19,       18.3,   19.8],
    [105,     INF,      105,      INF,      19,       INF,      19.8,   INF],

    [0,       56,       0,        58,       0,        6,        0,      6.3],
    [56,      93,       58,       93.8,     6,        12.2,     6.3,    12.6],
    [93,      111.3,    93.8,     111.7,    12.2,     21.5,     12.6,   21.2],
    [111.3,   112.3,    111.7,    112,      21.5,     22,       21.2,   22.3],
    [112.3,   INF,      112,      INF,      23,       INF,      23.3,   INF],

    [0,       59,       0,        60,       0,        7,        0,      7.2],
    [59,      98.5,     60,       99.8,     7,        12.8,     7.2,    13.9],
    [98.5,    118.9,    99.8,     119.2,    12.8,     24.9,     13.9,   24.2],
    [118.9,   121,      119.2,    120,      24.9,     26.8,     24.2,   26.9],
    [121,     INF,      120,      INF,      26.8,     INF,      26.9,     INF]
];

// [ UMUR, BB, TB, SEX ]
export type Row = [number, number, number, number];
export type FuzzWeight = [number, number, number];

export const weightsCrit: FuzzWeight[] = [
  [0, 0, 0.25],
  [0, 0.25, 0.5],
  [0.25, 0.5, 0.75],
  [0.5, 0.75, 1.0],
  [0.75, 1, 1.0]
];
export const weightsOut: FuzzWeight[] = [
  [0, 0, 0.25],
  [0, 0.25, 0.5],
  [0.25, 0.5, 0.75],
  [0.5, 0.75, 1.0],
  [0.75, 1.0, 1.0]
];

export const weightLabels = [
  'Sangat Rendah',
  'Rendah',
  'Normal',
  'Tinggi',
  'Sangat Tinggi'
];

// Kurva umur
function umur_fuzz(x: number): number {
  if (2 <= x && x <= 4) return 1;
  if (1 <= x && x <= 2) return x - 1;
  if (4 <= x && x <= 5) return (5.0 - x);
}

function sum(a: number, b: number) {
  return a + b;
}

function defuzz(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) * 1.0 / xs.length;
}

export function lookupCategory(type: 'bb'|'tb', age: number, sex: number, x: number) : number {
  const start_row_idx = (age - 1) * 5;
  // If it's bb, offset the column by 4.
  let col_idx_low = type == 'bb' ? (sex * 2) + 4 : (sex * 2);
  let col_idx_up = col_idx_low + 1;

  for (let i = 0; i < 5; i++) {
    const low = BB_TB_MAP[start_row_idx + i][col_idx_low];
    const up = BB_TB_MAP[start_row_idx + i][col_idx_up];
    if (low <= x && x <=up) {
      return i;
    }
  }
}

export function lookup(type: 'bb'|'tb', age: number, sex: number, x: number): number {
  const start_row_idx = age * 5;
  let flip_sex = 1 - sex;
  // If it's bb, offset the column by 4.
  let col_idx_low = type == 'bb' ? (flip_sex * 2) + 4 : (flip_sex * 2);
  let col_idx_up = col_idx_low + 1;

  for (let i = 0; i < 5; i++) {
    const low = BB_TB_MAP[start_row_idx + i][col_idx_low];
    const up = BB_TB_MAP[start_row_idx + i][col_idx_up];
    if (low <= x && x <=up) {
      console.log(`hit testing: ${low} <= ${x} && ${x} <=${up}`);
      return defuzz(weightsCrit[i]);
    }
  }

  throw new Error(`Can't find fuzzy value for ${type}(${x})`);
}

export function fuzz(rows: Row[], priors: number[]) {
  const defuzzWs = priors
    .map(idx => weightsOut[idx])
    .map(ws => ws.reduce(sum, 0))
    .map(totalW => totalW / 3.0);

  const totalWs = defuzzWs.reduce(sum, 0.0);
  const normWs = defuzzWs.map(fw => fw / totalWs);

  const fuzzRows = rows.map(row => {
    const umur = umur_fuzz(row[0]);
    const bb = lookup('bb', row[0], row[3], row[1]);
    const tb = lookup('tb', row[0], row[3], row[2]);
    const sex = row[3];
    return [ umur, bb, tb, sex ];
  });

  let minInFuzz: number[] = [INF, INF, INF, INF];
  fuzzRows.forEach((row, ridx) => {
    row.forEach((x, idx) => {
      if (x < minInFuzz[idx]) {
        minInFuzz[idx] = x;
      }
    });
  });

  const normFuzz = fuzzRows.map(row => {
    return row.map((x, idx) => {
      if (x == 0) return 0;
      return minInFuzz[idx] / x;
    });
  });

  const vs = normFuzz.map(row => 
    row
      .map((x, idx) => x * normWs[idx])
      .reduce(sum)
  );

  const result = vs.map((v, idx) => {
    return {
      v: v,
      fuzz: fuzzRows[idx],
      norm: normFuzz[idx]
    }
  });

  return result;
}

export function WHODescription () {

}

