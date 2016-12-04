import { BaseStudioMasterCommand } from "./base";
import { IDispatcher, IMessage, ProxyBus, RemoteBus } from "@tandem/mesh";
import { createProcessBus, fork as forkElectron } from "@tandem/common/workers/node";
import { spawn } from "child_process";

export class SpawnWorkerCommand extends  BaseStudioMasterCommand {
  execute(action: IMessage) {

    const proxy = new ProxyBus();

    const forkNode = () => {

      // need to completely separate from master process so that native node modules on the 
      // user machine work properly.
      const proc = spawn(process.env.npm_node_execpath, [__dirname + "/../../index.js"], {
        env: process.env,
        stdio: ["inherit", "inherit", "inherit", "ipc"]
      });

      proxy.target = createProcessBus(this.config.family, proc, this.bus);

      proc.on("close", () => {
        setTimeout(forkNode, 500);
      });
    };

    // TODO - check if node actually exists on system before doing this
    forkNode();
    this.bus.register(proxy);
  }
}

