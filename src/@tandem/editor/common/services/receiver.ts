import {
  inject,
  Kernel,
  LogEvent,
  KernelProvider,
  BaseApplicationService,
  CommandFactoryProvider,
  ApplicationServiceProvider,
} from "@tandem/common";

import { SequenceBus, DuplexStream, CallbackDispatcher, IMessage } from "@tandem/mesh";

// Command pattern receiver
export class ReceiverService extends BaseApplicationService {

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  dispatch(message: IMessage) {
    const commands = CommandFactoryProvider.findAllByMessage(message, this._kernel).map((dep) => {
      return new CallbackDispatcher((message: IMessage) => {
        return dep.create().execute(message);
      });
    });

    return new SequenceBus(commands).dispatch(message);
  }

  testMessage(message) {

    // TODO - probably shouldn't do this -- slight optimization since
    // there are currently no commands that handle logs
    return message.type !== LogEvent.LOG;
  }
}
