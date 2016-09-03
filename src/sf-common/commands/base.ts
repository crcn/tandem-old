import { inject } from "sf-common/decorators";
import { Action } from "sf-common/actions";
import { IActor } from "sf-common/actors";
import { IApplication } from "sf-common/application";
import { IInjectable, MAIN_BUS_NS, APPLICATION_SINGLETON_NS, DEPENDENCIES_NS, Dependencies } from "sf-common/dependencies";

export interface ICommand extends IActor { }

export abstract class BaseCommand implements ICommand, IInjectable {

  @inject(MAIN_BUS_NS)
  protected bus: IActor;

  @inject(DEPENDENCIES_NS)
  protected dependencies: Dependencies;

  abstract execute(action: Action);
}

export abstract class BaseApplicationCommand<T extends IApplication> extends BaseCommand {
  @inject(APPLICATION_SINGLETON_NS)
  readonly app: T;
}