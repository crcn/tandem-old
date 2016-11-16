import { isMaster, Worker, fork as clusterFork } from "cluster";
import { IDispatcher, RemoteBus, FilterBus, ProxyBus } from "@tandem/mesh";
import { isPublicAction, isWorkerAction, serialize, deserialize } from "@tandem/common";

export { isMaster };

const createWorkerFilterBus = (target: IDispatcher<any, any>) => {
  return new FilterBus(
    message => isPublicAction(message) || isWorkerAction(message),
    target
  );
}

export const fork = (localBus: IDispatcher<any, any>) => {

  const remoteBus = new ProxyBus();

  const spawn = () => {
    const worker = clusterFork(process.env);
    remoteBus.target = createProcessBus(worker, localBus);

    worker.on("disconnect", () => {
      remoteBus.target = undefined;

      // add timeout in case the worker is crashing repeatedly
      setTimeout(spawn, 1000);
    });
  }

  spawn();

  return createWorkerFilterBus(remoteBus);
}

const createProcessBus = (proc: Worker | NodeJS.Process, target: IDispatcher<any, any>) => {
  return new RemoteBus({
    send(message) {
      proc.send(message);
    },
    addListener(message) {
      proc.on("message", message);
    }
  }, target, { serialize, deserialize });
}

let masterBus: IDispatcher<any, any>;
let workerBus: ProxyBus;

if (!isMaster) {
  workerBus = new ProxyBus();
  masterBus = createWorkerFilterBus(createProcessBus(process, workerBus));
}

let _hooked: boolean;
export const hook = (localBus: IDispatcher<any, any>) => {
  if (_hooked) throw new Error(`Worker already hooked into master process.`);
  _hooked = true;

  // add a slight timeout so that the master bus can be hooked into the global dispatcher
  // before draining messages
  setImmediate(() => workerBus.target = localBus);
  return masterBus;
}
