export const weakMemo = <T extends Function>(fn:T) => {
  const key = Symbol();
  return ((first, ...rest) => {
    if (first[key]) return first[key];
    return first[key] = fn(first, ...rest);
  }) as any as T;
};