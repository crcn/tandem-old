import {
  inject,
  Injector,
  LogAction,
  InjectorProvider,
  CommandFactoryProvider,
  ApplicationServiceProvider,
} from "@tandem/common";

import { BaseApplicationService } from "@tandem/core";
import { SequenceBus, DuplexStream, CallbackDispatcher, IMessage } from "@tandem/mesh";

// Command pattern receiver
export class ReceiverService extends BaseApplicationService {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  dispatch(action: IMessage) {
    const commands = CommandFactoryProvider.findAllByAction(action, this._injector).map((dep) => {
      return new CallbackDispatcher((message: IMessage) => {
        return dep.create().execute(message);
      });
    });

    return new SequenceBus(commands).dispatch(action);
  }

  testMessage(message) {

    // TODO - probably shouldn't do this -- slight optimization since
    // there are currently no commands that handle logs
    return message.type !== LogAction.LOG;
  }
}
