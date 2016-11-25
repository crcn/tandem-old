import { inject } from "@tandem/common/decorators";
import { IBus, IMessage } from "@tandem/mesh";
import {
  Injector,
  IInjectable,
  InjectorProvider,
  PrivateBusProvider,
} from "@tandem/common/ioc";

export interface ICommand {
  execute(message?: IMessage): any;
}

export abstract class BaseCommand implements ICommand, IInjectable {

  @inject(PrivateBusProvider.ID)
  protected bus: IBus<any>;

  @inject(InjectorProvider.ID)
  protected injector: Injector;

  abstract execute(message: IMessage);
}
