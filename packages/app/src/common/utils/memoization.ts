export const memoize = <TFunc extends (...any) => any>(func: TFunc) => {
  return ((...args) => {
    
    /// TODO
    return func(...args);
  }) as any as TFunc;
};