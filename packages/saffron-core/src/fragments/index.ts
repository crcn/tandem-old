import { Service } from 'saffron-base/src/services';
import { IApplication } from 'saffron-base/src/application';
import {
  BaseFragment,
  SingletonFragment,
  FragmentDictionary,
  ClassFactoryFragment
 } from 'saffron-base/src/fragments';

// TODO - add more static find methods to each fragment here

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

export const APPLICATION_SINGLETON_NS = 'singletons/application';
export class ApplicationSingletonFragment extends SingletonFragment<IApplication> {
  constructor(instance:IApplication) {
    super(APPLICATION_SINGLETON_NS, instance);
  }

  static find(fragments:FragmentDictionary):ApplicationSingletonFragment {
    return fragments.query<ApplicationSingletonFragment>(APPLICATION_SINGLETON_NS);
  }
}