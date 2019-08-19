import { memoize } from "./memoization";

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] | RecursivePartial<T[P]>
};

export type KeyValue<V> = {
  [identifier: string]: V;
};

export type KeyValuePair<V> = {
  key: string;
  value: V;
};

export const keyValuePairToHash = memoize(
  (kvp: KeyValuePair<string>[]): KeyValue<string> => {
    const hash = {};
    for (const { key, value } of kvp) {
      hash[key] = value;
    }
    return hash;
  }
);

export const hashToKeyValuePair = memoize(
  (hash: KeyValue<string>): KeyValuePair<string>[] => {
    const pair = [];
    for (const key in hash) {
      pair.push({ key, value: hash[key] });
    }
    return pair;
  }
);

export const kvpGetValue = memoize(
  (key: string, kvp: KeyValuePair<string>[]) => {
    return keyValuePairToHash(kvp)[key];
  }
);
