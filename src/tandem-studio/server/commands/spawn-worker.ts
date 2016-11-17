import { IDispatcher } from "@tandem/mesh";
import { IEditorCommonConfig } from "@tandem/editor/common";
import { ApplicationConfigurationProvider } from "@tandem/core";
import { inject, PrivateBusProvider, Action, ICommand, isMaster,fork, IBrokerBus } from "@tandem/common";

export class SpawnWorkerCommand implements ICommand {

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEditorCommonConfig;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  execute(action: Action) {
    this._bus.register(fork(this._config.family, this._bus));
  }
}