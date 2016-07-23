import { IActor } from '../actors/index';
import FragmentCollection from '../fragments/collection';

interface IApplication {
  readonly config:any;
  readonly bus:IActor;
  readonly actors:Array<IActor>;
  readonly fragments:FragmentCollection;
}

export default IApplication;