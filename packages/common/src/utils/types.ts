export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] | RecursivePartial<T[P]>
};
