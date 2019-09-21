import { Key } from "./mutations";

export const arraySplice = <T>(
  target: T[],
  index: number,
  count: number = 1,
  ...replacements: T[]
) => [
  ...target.slice(0, index), // [0, 0] [text],
  ...replacements,
  ...target.slice(index + count)
];

export const getValue = (object, keyPath: Key[]) => {
  return keyPath.reduce((value, part) => {
    return value && value[part];
  }, object);
};

export const setValue = (
  object,
  value,
  keyPath: Key[],
  currentIndex: number = 0
) => {
  if (currentIndex === keyPath.length) {
    return value;
  }

  const key = keyPath[currentIndex];

  if (Array.isArray(object)) {
    return arraySplice(
      object,
      Number(key),
      1,
      setValue(object[key], value, keyPath, currentIndex + 1)
    );
  } else {
    return {
      ...object,
      [key]: setValue(object[key], value, keyPath, currentIndex + 1)
    };
  }
};
