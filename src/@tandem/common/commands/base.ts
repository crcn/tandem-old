import { inject } from "@tandem/common/decorators";
import { Action } from "@tandem/common/actions";
import { IActor } from "@tandem/common/actors";
import {
  IInjectable,
  Injector,
  PrivateBusProvider,
  InjectorProvider,
} from "@tandem/common/ioc";

export interface ICommand extends IActor { }

export abstract class BaseCommand implements ICommand, IInjectable {

  @inject(PrivateBusProvider.ID)
  protected bus: IActor;

  @inject(InjectorProvider.ID)
  protected injector: Injector;

  abstract execute(action: Action);
}
