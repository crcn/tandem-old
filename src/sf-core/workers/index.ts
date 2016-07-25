let loadedScripts;
let lastScriptSrc;

export const isMaster = typeof window !== "undefined";

if (isMaster) {
  loadedScripts = document.querySelectorAll('script');
  lastScriptSrc = loadedScripts[loadedScripts.length - 1].src;
}

export class Serializer<T> {
  public name:string;
  constructor(
    clazz:Function,
    readonly serialize:(value:T) => Object,
    readonly deserialize:(value:Object) => T
  ) {
    this.name = clazz.name;
  }
}

const workers = [];
const threadedFunctions = [];
const jobPromises = {};
let currentWorkerIndex = 0;
let cid = 0;

function getNextWorker():Worker {
  return workers.length ? workers[currentWorkerIndex = (currentWorkerIndex + 1) % workers.length] : undefined;
}
/**
 */

export function fork() {
  const worker = new Worker(lastScriptSrc);
  workers.push(worker);

  worker.addEventListener("message", function(message:MessageEvent) {
    const { cid, data, error } = message.data;
    const promise:any = jobPromises[cid];
    if (error) {
      promise.reject(data);
    } else {
      promise.resolve(data);
    }

    jobPromises[cid] = undefined;
  });
}

/**
 *
 */

if (isMaster) {

  const KILL_TIMEOUT = 1000 * 60 * 5; // 5 minute

  // worker cleanup
  setInterval(() => {
    for (var cid in jobPromises) {
      const promise = jobPromises[cid];

      // may have been deleted -- waiting for GC to kick in
      if (!promise) continue;

      if (promise.timestamp < Date.now() - KILL_TIMEOUT) {
        console.warn(`Killing zombie job: ${cid}`);

        // return Timeout error
        jobPromises[cid] = undefined;
        promise.reject(new Error(`Timeout`));
      }
    }
  }, 1000 * 10);
} else {
  self.addEventListener("message", async function(message:MessageEvent) {

    const { cid, index, args } = message.data;
    const fn = threadedFunctions[index];

    function resolve(data) {
      self.postMessage({ cid, data }, undefined);
    }

    function reject(data) {
      self.postMessage({ cid, data, error: true }, undefined)
    }

    try {
      resolve(fn(...args));
    } catch (e) { reject({ message: e.message }); }
  });
}

/**
 */

export function registerSerializer(...serializers:Array<Serializer<any>>) {
  // TODO
}

/**
 */


export function thread<T>(fn:Function, serialize:Function = undefined, deserialize:Function = undefined) {

  let ret;
  const index = threadedFunctions.length;

  if (isMaster) {
    ret = function(...args:Array<any>):Promise<any> {
      const worker = getNextWorker();

      // no workers yet? run it now
      if (!worker) return fn(...args);
      return new Promise(async function(resolve, reject) {
        jobPromises[++cid] = { resolve, reject, timestamp: Date.now() };
        worker.postMessage({ cid, index, args });
      });
    }
  } else {
    ret = fn;
  }

  threadedFunctions.push(ret);

  return ret;
}