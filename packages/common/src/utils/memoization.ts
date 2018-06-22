import * as lru from "lru-cache";

const DEFAULT_LRU_MAX = 1000;

export const memoize = <TFunc extends (...args: any[]) => any>(
  fn: TFunc,
  lruMax: number = DEFAULT_LRU_MAX,
  argumentCount: number = fn.length
  ) => {
  if (argumentCount == Infinity || isNaN(argumentCount)) {
    throw new Error(`Argument count cannot be Infinity, 0, or NaN.`);
  }

  if (!argumentCount) {
    console.log(fn);
    console.error(`Argument count should not be 0. Defaulting to 1.`);
    argumentCount = 1;
  }

  return compilFastMemoFn(argumentCount, lruMax > 0)(
    fn,
    lru({ max: lruMax })
  ) as TFunc;
};

let _memoFns = {};

const compilFastMemoFn = (argumentCount: number, acceptPrimitives: boolean) => {
  const hash = '' + argumentCount + acceptPrimitives;
  if (_memoFns[hash]) {
    return _memoFns[hash];
  }

  const args = Array.from({length: argumentCount}).map((v, i) => `arg${i}`);

  let buffer = `
  return function(fn, keyMemo) {
    var memo = new WeakMap();
    return function(${args.join(', ')}) {
      var currMemo = memo, prevMemo, key;
  `;

  for (let i = 0, n = args.length - 1; i < n; i++) {
    const arg = args[i];
    buffer += `
      prevMemo = currMemo;
      key      = ${arg};
      ${
        acceptPrimitives
          ? `if ((typeof key !== "object" || !key) && !(key = keyMemo.get(${arg}))) {
        keyMemo.set(${arg}, key = {});
      }`
          : ''
      }
      if (!(currMemo = currMemo.get(key))) {
        prevMemo.set(key, currMemo = new WeakMap());
      }
    `;
  }

  const lastArg = args[args.length - 1];

  buffer += `
      key = ${lastArg};
      ${
        acceptPrimitives
          ? `
      if ((typeof key !== "object" || !key) && !(key = keyMemo.get(${lastArg}))) {
        keyMemo.set(${lastArg}, key = {});
      }`
          : ''
      }

      if (!currMemo.has(key)) {
        currMemo.set(key, fn(${args.join(', ')}));
      }

      return currMemo.get(key);
    };
  };
  `;

  return (_memoFns[hash] = new Function(buffer)());
}


export function memoize2<TFunc extends (...args: any[]) => any>(func: TFunc): TFunc {

  // vars here because they're faster than let or const
  var memos = new WeakMap();
  var primitiveKeys = new Map();
  return function(...args: any[]) {
    var cmemo = memos;
    var pmemo;
    for (let i = 0, n = args.length; i < n; i++) {
      var arg = args[i];
      var key = arg;
      if (typeof arg !== "object" || !arg) {
        if (!(key = primitiveKeys.get(arg))) {
          primitiveKeys.set(arg, key = {});
        }
      }
      pmemo = cmemo;
      if (!(cmemo = cmemo.get(key))) {
        pmemo.set(key, cmemo = new WeakMap());
      }
    }

    var record;
    if (!(record = (cmemo as any).$$record)) {
      (cmemo as any).$$record = record = { value: func.apply(this, arguments) };
    }
    return record.value;

  } as any as TFunc;
};

/**
 * Calls target function once & proxies passed functions
 * @param fn
 */

export const underchange = <TFunc extends Function>(fn: TFunc) => {
  let currentArgs = [];
  let ret: any;
  let started: boolean;

  const start = () => {
    if (started) {
      return ret;
    }
    started = true;
    return (ret = fn(
      ...currentArgs.map((a, i) => (...args) => currentArgs[i](...args))
    ));
  };

  return (((...args) => {
    currentArgs = args;
    return start();
  }) as any) as TFunc;
};
