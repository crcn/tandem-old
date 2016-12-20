import PACKAGE =  require("tandem-code/package")
import { spawn, fork, ChildProcess } from "child_process";
import { SpawnWorkerRequest } from "../messages";
import { BaseEditorMasterCommand } from "./base";
import { createProcessBus, fork as forkElectron } from "@tandem/common/workers/node";
import { IDispatcher, IMessage, RemoteBus, ChannelBus, DuplexStream } from "@tandem/mesh";

export class SpawnWorkerCommand extends BaseEditorMasterCommand {
  execute({ env }: SpawnWorkerRequest) {
    return new DuplexStream((input, output) => {

      this.logger.info("Spawning child worker...");

      const proc = fork(this.config.worker.mainPath, [], {

        // TODO - move this in config
        env: Object.assign({}, process.env, env, this.config.worker.env)
      });


      // this.bus.register(forkElectron(this.config.family, this.bus, process.env));

      // note that this will pause event bus until the child boots up
      const cb = new ChannelBus(input, output, createProcessBus(this.config.family, proc, this.bus), () => {
        proc.kill();
      });
    });
  }
}

