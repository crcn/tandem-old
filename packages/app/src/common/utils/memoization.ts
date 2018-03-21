export const memoize = <TFunc extends Function>(func: TFunc) => {
  return ((...args) => {
    
    /// TODO
    return func(...args);
  }) as any as TFunc;
};