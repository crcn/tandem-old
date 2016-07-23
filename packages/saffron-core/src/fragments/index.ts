import { Service } from 'saffron-base/src/services';
import { IApplication } from 'saffron-base/src/application';
import { FragmentDictionary, BaseFragment } from 'saffron-base/src/fragments';

/**
 */

interface IFactory {
  create(...rest):any;
}

export {IFactory};


/**
 */

export class FactoryFragment extends BaseFragment implements IFactory {
  constructor(ns:string, public factory:IFactory) {
    super(ns);
  }

  create(...rest:Array<any>):any {
    return this.factory.create(...rest);
  }
}

/**
 */

export class ClassFactoryFragment extends FactoryFragment {
  constructor(ns:string, clazz:{ new(...rest):any }) {
    super(ns, { create: (...rest) => new clazz(...rest) });
  }
}

/**
 */

export class ApplicationServiceFragment extends BaseFragment implements IFactory {
  private _factory:ClassFactoryFragment;
  constructor(ns:string, clazz:{ new(app:IApplication):Service }) {
    super(ns);
    this._factory = new ClassFactoryFragment(undefined, clazz);
  }
  create(app:IApplication):Service {
    return this._factory.create(app);
  }
}

/**
 */

export class SingletonFragment<T> extends BaseFragment {
  constructor(ns:string, readonly instance:T) {
    super(ns);
  }
}

/**
 */

export const APPLICATION_SINGLETON_NS = 'singletons/application';
export class ApplicationSingletonFragment extends SingletonFragment<IApplication> {
  constructor(instance:IApplication) {
    super(APPLICATION_SINGLETON_NS, instance);
  }

  static find(fragments:FragmentDictionary):ApplicationSingletonFragment {
    return fragments.query<ApplicationSingletonFragment>(APPLICATION_SINGLETON_NS);
  }
}