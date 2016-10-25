import {
  inject,
  Action,
  IActor,
  Dependencies,
  DependenciesDependency,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "@tandem/common";

import {SequenceBus } from "mesh";

// Command pattern receiver
export class ReceiverService implements IActor {

  @inject(DependenciesDependency.ID)
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