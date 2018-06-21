const DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 10;
let previousPurgeTime = 0;
let DEFAULT_ANCHOR = {};


export function memoize<TFunc extends (...args: any[]) => any>(func: TFunc): TFunc {

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
