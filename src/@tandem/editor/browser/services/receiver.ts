import {
  inject,
  Action,
  IActor,
  Injector,
  InjectorProvider,
  CommandFactoryProvider,
  ApplicationServiceProvider,
} from "@tandem/common";

import {SequenceBus } from "mesh";

// Command pattern receiver
export class ReceiverService implements IActor {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  constructor() {

  }

  execute(action: Action) {

    const commands = CommandFactoryProvider.findAllByAction(action, this._injector).map((dep) => {
      return dep.create()
    });

    return new SequenceBus(commands).execute(action);
  }
}

export const receiverServiceProvider = new ApplicationServiceProvider("receiver", ReceiverService);