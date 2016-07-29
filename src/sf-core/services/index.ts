import { Service } from "./base";
import { IApplication } from "sf-core/application";
import { APPLICATION_SINGLETON_NS, BUS_NS, IInjectable } from "sf-core/dependencies";
import { IActor, IInvoker } from "sf-core/actors/index";
import { inject } from "sf-core/decorators";

export { Service };

export class BaseApplicationService<T extends IApplication> extends Service implements IInvoker, IInjectable {
  @inject(APPLICATION_SINGLETON_NS)
  readonly app: T;

  @inject(BUS_NS)
  readonly bus: IActor;

  didInject() { }
};