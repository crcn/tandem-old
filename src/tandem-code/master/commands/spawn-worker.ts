import { BaseStudioMasterCommand } from "./base";
import { IDispatcher, IMessage, ProxyBus, RemoteBus } from "@tandem/mesh";
import { createProcessBus, fork as forkElectron } from "@tandem/common/workers/node";
import { spawn, fork } from "child_process";
import PACKAGE =  require("tandem-code/package")

declare const __root: any;

export class SpawnWorkerCommand extends  BaseStudioMasterCommand {
  execute(message: IMessage) {

    const root = (typeof __root === "undefined" ? __dirname + "/../../" : __root);

    const proxy = new ProxyBus();

    const forkNode = () => {

      this.logger.info("Waiting for child worker...");

      // need to completely separate from master process so that native node modules on the 
      // user machine work properly.
      // const proc = fork(process.env.npm_node_execpath, [root + PACKAGE.main], {
      //   env: process.env,
      //   stdio: ["inherit", "inherit", "inherit", "ipc"]
      // });

      const proc = fork(root + "/" + PACKAGE.main, [], {
        env: Object.assign({}, process.env, {
          ELECTRON_RUN_AS_NODE: true,
          WORKER: true,
          CWD: this.config.cwd
        }),
        cwd: this.config.cwd
      });

      proxy.target = createProcessBus(this.config.family, proc, this.bus);

      proc.on("close", () => {
        setTimeout(forkNode, 500);
      });
    };

    // TODO - check if node actually exists on system before doing this
    forkNode();

    // this.bus.register(forkElectron(this.config.family, this.bus, process.env));

    // note that this will pause event bus until the child boots up
    this.bus.register(proxy);
  }
}

