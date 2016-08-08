import { BaseApplicationService } from "sf-core/services";
import { Action } from "sf-core/actions";
import { ParallelBus, NoopBus, EmptyResponse } from "mesh";
import { IApplication } from "sf-core/application";
import { inject } from "sf-core/decorators";
import {  ApplicationServiceDependency, COMMAND_FACTORY_NS, CommandFactoryDependency } from "sf-core/dependencies";

export class CommandsService extends BaseApplicationService<IApplication> {

  @inject([COMMAND_FACTORY_NS, "**"].join("/"), (dep) => dep)
  private _commandFactories: Array<CommandFactoryDependency>;

  execute(action: Action) {

    const commands = [];

    for (const factory of this._commandFactories) {
      if (factory.actionFilter(action)) {
        commands.push(factory.create());
      }
    }

    if (commands.length === 0) {
      return new EmptyResponse();
    }

    return new ParallelBus(commands).execute(action);
  }
}

export const dependency = new ApplicationServiceDependency("commands", CommandsService);