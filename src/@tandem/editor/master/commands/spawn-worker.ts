import { SpawnWorkerRequest } from "../messages";
import { ApplicationReadyMessage } from "@tandem/common";
import { BaseEditorMasterCommand } from "./base";
import { spawn, fork, ChildProcess } from "child_process";
import { createProcessBus, fork as forkElectron } from "@tandem/common/workers/node";
import { 
  ProxyBus,
  IMessage, 
  RemoteBus, 
  ChannelBus, 
  IDispatcher, 
  DuplexStream,
  CallbackDispatcher,
} from "@tandem/mesh";

export class SpawnWorkerCommand extends BaseEditorMasterCommand {
  execute({ env }: SpawnWorkerRequest) {
    return new DuplexStream((input, output) => {

      this.logger.info("Spawning child worker");

      const proc = fork(this.config.worker.mainPath, [], {

        // TODO - move this in config
        env: Object.assign({}, process.env, env, this.config.worker.env)
      });

      const proxy = new ProxyBus();

      const globalBus = this.bus;
      const procBus = createProcessBus(this.config.family, proc, new CallbackDispatcher((message: IMessage) => {

        // hold off all messages until application ready is emitted
        if (message.type ===  ApplicationReadyMessage.READY) {
          proxy.target = procBus;
        }

        return globalBus.dispatch(message);
      }));

      this.bus.register(procBus);

      const dispose = () => {
        this.bus.unregister(procBus);
        proc.kill();
      }

      const cb = new ChannelBus(this.config.family, input, output, proxy, dispose);
    });
  }
}

