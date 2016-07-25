import { IActor, IInvoker } from '../actors';
import { FragmentDictionary } from '../fragments';

interface IApplication extends IInvoker {

  // the application configuration on startup
  readonly config:any;

  // actors of the application bus
  readonly actors: Array<IActor>;

  // parts of the application
  readonly fragments:FragmentDictionary;
}

export { IApplication };