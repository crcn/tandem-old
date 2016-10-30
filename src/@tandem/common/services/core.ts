import { inject } from "@tandem/common/decorators";
import { Service } from "./base";
import { BrokerBus } from "@tandem/common/busses";
import { IApplication } from "@tandem/common/application";
import { IActor, IInvoker } from "@tandem/common/actors";
import { APPLICATION_SINGLETON_NS, PrivateBusProvider, IInjectable } from "@tandem/common/ioc";

export { Service };

export class BaseApplicationService<T extends IApplication> extends Service implements IInvoker, IInjectable {

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: T;

  @inject(PrivateBusProvider.ID)
  readonly bus: BrokerBus;
};