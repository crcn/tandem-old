import { Service } from 'sf-base/services';
import { IApplication } from 'sf-base/application';

import {
  IFactory,
  BaseFragment,
  SingletonFragment,
  FragmentDictionary,
  ClassFactoryFragment
 } from 'sf-base/fragments';

// TODO - add more static find methods to each fragment here

/**
 */

export const APPLICATION_SERVICES_NS = 'application/services';
export class ApplicationServiceFragment extends BaseFragment implements IFactory {
  private _factory: ClassFactoryFragment;

  constructor(id: string, clazz:{ new(app: IApplication): Service }) {
    super(`${APPLICATION_SERVICES_NS}/${id}`);
    this._factory = new ClassFactoryFragment(undefined, clazz);
  }

  create(app: IApplication): Service {
    return this._factory.create(app);
  }

  static findAll(fragments: FragmentDictionary):Array<ApplicationServiceFragment> {
    return fragments.queryAll<ApplicationServiceFragment>(`${APPLICATION_SERVICES_NS}/**`);
  }
}

/**
 */

export const APPLICATION_SINGLETON_NS = 'singletons/application';
export class ApplicationSingletonFragment extends SingletonFragment<IApplication> {
  constructor(instance: IApplication) {
    super(APPLICATION_SINGLETON_NS, instance);
  }

  static find(fragments: FragmentDictionary): ApplicationSingletonFragment {
    return fragments.query<ApplicationSingletonFragment>(APPLICATION_SINGLETON_NS);
  }
}
