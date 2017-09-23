const DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 10;

let DEFAULT_ANCHOR = {};

export function weakMemo<TFunc extends (...args: any[]) => any>(func: TFunc, mapMemo: (value?: any) => any = (value => value)): TFunc {
  let count = 1;
  const memoKey = Symbol();
  const hashKey = Symbol();
  return function() {
    let hash = "";
    let anchor: any = DEFAULT_ANCHOR;

    for (let i = 0, n = arguments.length; i < n; i++) {
      const arg = arguments[i];

      let hashPart;

      if (arg && typeof arg === "object") {
        anchor = arg;
        hashPart = arg[hashKey] && arg[hashKey].self === arg ? arg[hashKey].value : (arg[hashKey] = { self: arg, value: ":" + (count++) }).value;
      } else {
        hashPart = ":" + arg;
      }

      hash += hashPart;
    }

    if (!anchor[memoKey] || anchor[memoKey].self !== anchor) anchor[memoKey] = { self: anchor };
    return mapMemo(anchor[memoKey].hasOwnProperty(hash) ? anchor[memoKey][hash] : anchor[memoKey][hash] = func.apply(this, arguments));

  } as any as TFunc;
};

setInterval(() => {
  DEFAULT_ANCHOR = {};
}, DUMP_DEFAULT_ANCHOR_INTERVAL);

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
    return ret = fn(...currentArgs.map((a, i) => (...args) => currentArgs[i](...args)));
  }

  return ((...args) => {
    currentArgs = args;
    return start();
  }) as any as TFunc;
};
