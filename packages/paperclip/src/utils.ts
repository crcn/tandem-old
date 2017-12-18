export const weakMemo = <T extends Function>(fn:T) => {
  const key = Symbol();
  return ((first, ...rest) => {
    if (first[key]) return first[key];
    return first[key] = fn(first, ...rest);
  }) as any as T;
};

export const eachValue = (items: any, each: (value: any, index: string|number) => any) => {
  if (Array.isArray(items)) {
    items.forEach(each);
  } else {
    for (const key in items) {
      each(items[key], key);
    }
  }
};
