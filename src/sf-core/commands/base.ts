
import { inject } from "sf-core/decorators";
import { IInjectable, MAIN_BUS_NS, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";

export interface ICommand extends IActor { }

export abstract class BaseCommand implements ICommand, IInjectable {

  @inject(MAIN_BUS_NS)
  protected bus: IActor;

  @inject(DEPENDENCIES_NS)
  protected dependencies: Dependencies;

  abstract execute(action: Action);
  didInject() { }
}