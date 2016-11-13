import {
  inject,
  Action,
  IActor,
  Injector,
  InjectorProvider,
  CommandFactoryProvider,
  ApplicationServiceProvider,
} from "@tandem/common";

import { BaseApplicationService } from "@tandem/core";

import {SequenceBus } from "mesh";

// Command pattern receiver
export class ReceiverService extends BaseApplicationService {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  execute(action: Action) {

    const commands = CommandFactoryProvider.findAllByAction(action, this._injector).map((dep) => {
      return dep.create()
    });

    return new SequenceBus(commands).execute(action);
  }
}
