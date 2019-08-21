import { memoize } from "./memoization";
import { arraySplice } from "./array";

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] | RecursivePartial<T[P]>
};

export type KeyValue<V> = {
  [identifier: string]: V;
};

export type KeyValuePair<V> = {
  key?: string;
  value?: V;
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

export const kvpSetValue = (
  key: string,
  value: string,
  kvp: KeyValuePair<string>[]
) => {
  const i = kvp.findIndex(kv => kv.key === key);
  return i === -1
    ? [...kvp, { key, value }]
    : arraySplice(kvp, i, 1, { key, value });
};

export const kvpMerge = (...kvps: KeyValuePair<string>[][]) => {
  const used = {};
  const merged: KeyValuePair<string>[] = [];
  for (let i = kvps.length; i--; ) {
    for (const { key, value } of kvps[i]) {
      if (used[key]) continue;
      used[key] = 1;
      merged.push({ key, value });
    }
  }
  return merged;
};

export const kvpOmitUndefined = (kvp: KeyValuePair<string>[]) => {
  return kvp.filter(({ key, value }) => key != null && value != null);
};
