import { inject } from "sf-core/decorators";
import { Service } from "./base";
import { BrokerBus } from "sf-core/busses";
import { IApplication } from "sf-core/application";
import { IActor, IInvoker } from "sf-core/actors";
import { APPLICATION_SINGLETON_NS, MAIN_BUS_NS, IInjectable } from "sf-core/dependencies";

export { Service };

export class BaseApplicationService<T extends IApplication> extends Service implements IInvoker, IInjectable {

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: T;

  @inject(MAIN_BUS_NS)
  readonly bus: BrokerBus;
};