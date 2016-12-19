import { BasePlaygroundServerCommand } from "./base";
import getPort = require("get-port");
import { fork } from "cluster";

// TODO - this command needs to communicate with AWS about 
// creating a new worker
export class GetWorkerHostCommand extends BasePlaygroundServerCommand {
  execute() {
    return this.spawnLocalWorker();
  }

  async spawnLocalWorker() {
    const childPort = await getPort();
    const child = fork(Object.assign({}, process.env, {
      PORT: childPort,
      WORKER: true
    }));

    return `http://localhost:${childPort}`;
  }
}