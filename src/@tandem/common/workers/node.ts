import { isMaster, Worker, fork as clusterFork } from "cluster";
import { fork as forkChild, ChildProcess } from "child_process";
import { IDispatcher, RemoteBus, FilterBus, ProxyBus, filterFamilyMessage } from "@tandem/mesh";
import { serialize, deserialize } from "@tandem/common";

export { isMaster };

export const fork = (family: string, localBus: IDispatcher<any, any>, pathName: string, argv?: any[], env?: any) => {

  const remoteBus = new ProxyBus();

  const spawn = () => {
    const worker = forkChild(pathName || process.argv[1], argv || process.argv.slice(2), { env: env });
    remoteBus.target = createProcessBus(family, worker, localBus);

    worker.on("disconnect", () => {
      remoteBus.target = undefined;

      // add timeout in case the worker is crashing repeatedly
      setTimeout(spawn, 1000);
    });
  };

  spawn();

  return remoteBus;
}

export const createProcessBus = (family: string, proc: ChildProcess | NodeJS.Process, target: IDispatcher<any, any>) => {
  return new RemoteBus({
    family,
    testMessage: filterFamilyMessage,
    adapter: {
      send(message) {
        proc.send(message);
      },
      addListener(message) {
        (proc as any).on("message", message);
      }
    }
  }, target, { serialize, deserialize });
}

export const hook = (family: string, localBus: IDispatcher<any, any>) => {
  return createProcessBus(family, process, localBus);
}
