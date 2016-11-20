import { inject } from "@tandem/common/decorators";
import { Action } from "@tandem/common/messages";
import { IBus } from "@tandem/mesh";
import {
  Injector,
  IInjectable,
  InjectorProvider,
  PrivateBusProvider,
} from "@tandem/common/ioc";

export interface ICommand {
  execute(action?: Action): any;
}

export abstract class BaseCommand implements ICommand, IInjectable {

  @inject(PrivateBusProvider.ID)
  protected bus: IBus<any>;

  @inject(InjectorProvider.ID)
  protected injector: Injector;

  abstract execute(action: Action);
}
