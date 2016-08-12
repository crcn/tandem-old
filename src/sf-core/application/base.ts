import { IActor, IInvoker } from '../actors';
import { Dependencies } from '../dependencies';
import { IBrokerBus } from "sf-core/busses";

interface IApplication extends IInvoker {

  // the application configuration on startup
  readonly config: any;

  // actors of the application bus
  readonly bus: IBrokerBus;

  // parts of the application
  readonly dependencies: Dependencies;
}

export { IApplication };