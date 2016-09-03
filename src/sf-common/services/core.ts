import { inject } from "sf-common/decorators";
import { Service } from "./base";
import { BrokerBus } from "sf-common/busses";
import { IApplication } from "sf-common/application";
import { IActor, IInvoker } from "sf-common/actors";
import { APPLICATION_SINGLETON_NS, MAIN_BUS_NS, IInjectable } from "sf-common/dependencies";

export { Service };

export class BaseApplicationService<T extends IApplication> extends Service implements IInvoker, IInjectable {

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: T;

  @inject(MAIN_BUS_NS)
  readonly bus: BrokerBus;
};