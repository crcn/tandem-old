import {
  inject,
  Action,
  IActor,
  Dependencies,
  DEPENDENCIES_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "@tandem/common";

import {SequenceBus } from "mesh";

// Command pattern receiver
export class ReceiverService implements IActor {

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  constructor() {

  }

  execute(action: Action) {

    const commands = CommandFactoryDependency.findAllByAction(action, this._dependencies).map((dep) => {
      return dep.create()
    });

    return new SequenceBus(commands).execute(action);
  }
}

export const receiverServiceDependency = new ApplicationServiceDependency("receiver", ReceiverService);