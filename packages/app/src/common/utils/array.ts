export const arraySplice = <T>(target: T[], index: number, count: number = 1, ...replacements: T[]) => [
  ...target.slice(0, index),
  ...replacements,
  ...target.slice(index, count)
];