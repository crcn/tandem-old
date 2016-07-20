import assertPropertyExists from '../utils/assert/property-exists';
import { Service } from '../services/index';
import IApplication from '../application/interface';

declare class BaseApplication {

};

/**
 */

export class Fragment {
  constructor(public ns:string, public priority:number = 0) {
    this.ns = ns;
  }
}

/**
 */

interface IFactory {
  create(...rest):any;
}

export {IFactory}; 


/**
 */

export class FactoryFragment extends Fragment implements IFactory {
  constructor(public ns:string, public factory:IFactory, priority:number = 0) {
    super(ns, priority);
  }

  create(...rest:Array<any>):any {
    return this.factory.create(...rest);
  }
}

/**
 */

export class ClassFactoryFragment extends FactoryFragment {
  constructor(ns:string, clazz:{ new(...rest):any }, priority:number = 0) {
    super(ns, { create: (...rest) => new clazz(...rest) }, priority);
  }
}

/**
 */

export class ApplicationServiceFragment extends Fragment implements IFactory {
  private _factory:ClassFactoryFragment;
  constructor(ns:string, clazz:{ new(app:IApplication):Service }, priority:number = 0) {
    super(ns);
    this._factory = new ClassFactoryFragment(undefined, clazz, priority);
  }
  create(app:IApplication):Service {
    return this._factory.create(app);
  }
}