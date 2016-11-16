import { IDispatcher } from "@tandem/mesh";
import { inject, PrivateBusProvider, Action, ICommand, isMaster,fork, IBrokerBus } from "@tandem/common";

export class SpawnWorkerCommand implements ICommand {
  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  execute(action: Action) {
    this._bus.register(fork(this._bus));
  }
}