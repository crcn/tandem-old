import { BaseStudioServerCommand } from "./base";
import { IDispatcher, IMessage } from "@tandem/mesh";
import { fork } from "@tandem/common";

export class SpawnWorkerCommand extends  BaseStudioServerCommand {


  execute(action: IMessage) {
    this.bus.register(fork(this.config.family, this.bus));
  }
}