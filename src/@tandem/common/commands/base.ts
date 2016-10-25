import { inject } from "@tandem/common/decorators";
import { Action } from "@tandem/common/actions";
import { IActor } from "@tandem/common/actors";
import { IApplication } from "@tandem/common/application";
import { IInjectable, MainBusDependency, APPLICATION_SINGLETON_NS, DependenciesDependency, Dependencies } from "@tandem/common/dependencies";

export interface ICommand extends IActor { }

export abstract class BaseCommand implements ICommand, IInjectable {

  @inject(MainBusDependency.NS)
  protected bus: IActor;

  @inject(DependenciesDependency.ID)
  protected dependencies: Dependencies;

  abstract execute(action: Action);
}

export abstract class BaseApplicationCommand<T extends IApplication> extends BaseCommand {
  @inject(APPLICATION_SINGLETON_NS)
  readonly app: T;
}