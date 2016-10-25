import { inject } from "@tandem/common/decorators";
import { Action } from "@tandem/common/actions";
import { IActor } from "@tandem/common/actors";
import { IApplication } from "@tandem/common/application";
import {
  IInjectable,
  Dependencies,
  PrivateBusDependency,
  APPLICATION_SINGLETON_NS,
  DependenciesDependency,
} from "@tandem/common/dependencies";

export interface ICommand extends IActor { }

export abstract class BaseCommand implements ICommand, IInjectable {

  @inject(PrivateBusDependency.ID)
  protected bus: IActor;

  @inject(DependenciesDependency.ID)
  protected dependencies: Dependencies;

  abstract execute(action: Action);
}
