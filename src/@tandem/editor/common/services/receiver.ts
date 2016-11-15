import {
  inject,
  Action,
  Injector,
  InjectorProvider,
  CommandFactoryProvider,
  ApplicationServiceProvider,
} from "@tandem/common";

import { BaseApplicationService } from "@tandem/core";
import { SequenceBus, DuplexStream, CallbackDispatcher } from "@tandem/mesh";

// Command pattern receiver
export class ReceiverService extends BaseApplicationService {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  dispatch(action: Action) {

    const commands = CommandFactoryProvider.findAllByAction(action, this._injector).map((dep) => {
      return new CallbackDispatcher((message: Action) => dep.create().execute(message));
    });

    return new SequenceBus(commands).dispatch(action);
  }
}
