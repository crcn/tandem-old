import { Service } from "sf-core/services";
import { IApplication } from "sf-core/application";
import { IEntity } from "../entities";
import { IDiffableNode } from "../markup";
import { Bus } from "mesh";

import {
  IFactory,
  IFragment,
  BaseFragment,
  FragmentDictionary,
  ClassFactoryFragment
 } from "sf-core/fragments";

// TODO - add more static find methods to each fragment here

export * from "./base";

/**
 */

export const APPLICATION_SERVICES_NS = "application/services";
export class ApplicationServiceFragment extends BaseFragment implements IFactory {
  private _factory: ClassFactoryFragment;

  constructor(id: string, clazz: { new(app: IApplication): Service }) {
    super(`${APPLICATION_SERVICES_NS}/${id}`);
    this._factory = new ClassFactoryFragment(undefined, clazz);
  }

  create(app: IApplication): Service {
    return this._factory.create(app);
  }

  static findAll(fragments: FragmentDictionary): Array<ApplicationServiceFragment> {
    return fragments.queryAll<ApplicationServiceFragment>(`${APPLICATION_SERVICES_NS}/**`);
  }
}

/**
 */

export const APPLICATION_SINGLETON_NS = "singletons/application";
export class ApplicationSingletonFragment extends BaseFragment {

  constructor(readonly instance: IApplication) {
    super(APPLICATION_SINGLETON_NS);
  }

  static find(fragments: FragmentDictionary): ApplicationSingletonFragment {
    return fragments.query<ApplicationSingletonFragment>(APPLICATION_SINGLETON_NS);
  }
}

/**
 */

export const ENTITIES_NS = "entities";

// TODO - possibly require renderer here as well
export class EntityFactoryFragment extends BaseFragment {

  constructor(id: string, private _clazz: { new(source: IDiffableNode): IEntity }) {
    super([ENTITIES_NS, id].join("/"));
  }

  create(source: IDiffableNode) {
    return new this._clazz(source);
  }

  static find(id: string, fragments: FragmentDictionary) {
    return fragments.query<EntityFactoryFragment>([ENTITIES_NS, id].join("/"));
  }

  static createEntity(source: IDiffableNode, fragments: FragmentDictionary) {
    return this.find(source.nodeName, fragments).create(source);
  }
}

/**
 */

export const FACADES_NS = "facades";
export class FacadeFragment<T> extends BaseFragment {
  constructor(id: string, readonly instance: T) {
    super([FACADES_NS, id].join("/"));
  }

  static find<T>(fragments: FragmentDictionary, clazz: { new(fragments: FragmentDictionary): T }): FacadeFragment<T> {
    let fragment = fragments.query<FacadeFragment<T>>([FACADES_NS, clazz.name].join("/"));
    if (fragment == null) {
      fragments.register(fragment = new FacadeFragment<T>(clazz.name, new clazz(fragments)));
    }
    return fragment;
  }

  static getInstance<T>(fragments: FragmentDictionary, clazz: { new(fragments: FragmentDictionary): T }): T {
    return this.find(fragments, clazz).instance;
  }
}

/**
 */

export const BUS_NS = "bus";
export class BusFragment extends BaseFragment {
  constructor(readonly instance: Bus) {
    super(BUS_NS);
  }
  static getInstance(fragments: FragmentDictionary): Bus {
    return fragments.query<BusFragment>(BUS_NS).instance;
  }
}
