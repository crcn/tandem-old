const DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 5;

export function weakMemo<TFunc extends (...args: any[]) => any>(func: TFunc, mapMemo: (value?: any) => any = (value => value)): TFunc {
  const memoKey = Symbol();

  // if func takes a single argument, then use the faster method
  // of memoization by storing the result on the argument itself. 
  if (func.length === 1) {
    return function(arg: any) {

      // check if self _is_ arg in case arg was copied via Object.assign(newArg, arg), or {...arg} -- both of these operations copy symbol keys over.
      if (arg[memoKey] && arg[memoKey].self === arg) {
        return arg[memoKey].value;
      }

      const value = func.call(this, arg);
      arg[memoKey] = { self: arg, value };
      return value;
    } as any as TFunc;
  }

  let argCount = 1;
  const hashKey = Symbol();

  let defaultAnchor = {};
  let previousPurgeTime = 0;  

  // If more arguments are provided, then use the slower method of
  // memoizing the result by building a hash of the arguments and storing that value in an "anchor" argument (where the memoization symbol is stored).
  return function() {

    // Memory purge for cases where memoization result must be stored globally -- this happens when only primitive data types are passed in the memoized function
    if (previousPurgeTime && Date.now() - DUMP_DEFAULT_ANCHOR_INTERVAL > previousPurgeTime) {
      previousPurgeTime = Date.now();
      defaultAnchor = {};
    }
    let hash = "";

    // anchor is global by default, but is overridden by an object passed in the argument.
    let anchor: any = defaultAnchor;

    // start building up a unique hash based on the arguments provided
    for (let i = 0, n = arguments.length; i < n; i++) {
      const arg = arguments[i];

      let hashPart;

      // arg is an object, so use memoKey + reference count to create a unique hash part.
      if (arg && typeof arg === "object") {
        anchor = arg;

        // Ensure that if the memoized symbol key is found that it actually belongs to the argument and wasn't copied over, otherwise create a new hash. 
        hashPart = arg[hashKey] && arg[hashKey].self === arg ? arg[hashKey].value : (arg[hashKey] = { self: arg, value: ":" + (argCount++) }).value;

      // arg is a primitive, so we can just add it as the hash value
      } else {
        hashPart = ":" + arg;
      }

      hash += hashPart;
    }

    if (!anchor[memoKey] || anchor[memoKey].self !== anchor) {
      anchor[memoKey] = { self: anchor };
    }

    return mapMemo(anchor[memoKey].hasOwnProperty(hash) ? anchor[memoKey][hash] : anchor[memoKey][hash] = func.apply(this, arguments));

  } as any as TFunc;
};