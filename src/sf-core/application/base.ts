import { IActor, IInvoker } from '../actors';
import { Dependencies } from '../dependencies';

interface IApplication extends IInvoker {

  // the application configuration on startup
  readonly config:any;

  // actors of the application bus
  readonly actors: Array<IActor>;

  // parts of the application
  readonly dependencies:Dependencies;
}

export { IApplication };