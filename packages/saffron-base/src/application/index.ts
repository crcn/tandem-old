import { IActor, IInvoker } from '../actors';
import { FragmentDictionary } from '../fragments';

interface IApplication extends IInvoker {

  // the application configuration on startup
  readonly config:any;

  // the mediator for all global actors in the application
  // TODO - this needs

  // Note that the term "bus" here is generic so that decorators
  // such as loggable (and possibly others) can still be attached to an application
  // instance
  readonly actors: Array<IActor>;

  // parts of the application
  readonly fragments:FragmentDictionary;
}

export { IApplication };