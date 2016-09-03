import { IBrokerBus } from "sf-common/busses";
import { Dependencies } from '../dependencies';
import { IActor, IInvoker } from '../actors';

interface IApplication extends IInvoker {

  // the application configuration on startup
  readonly config: any;

  // actors of the application bus
  readonly bus: IBrokerBus;

  // parts of the application
  readonly dependencies: Dependencies;
}

export { IApplication };