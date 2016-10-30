import { flattenDeep } from "lodash";
import { ICloneable } from "@tandem/common/object";
import * as assert from "assert";

export interface IInjectable {
  $didInject?(): void;
}

export interface IProvider extends ICloneable {

  /**
   */

  readonly overridable: boolean;

  /**
   * The unique id of the the dependency
   */

  readonly id: string;

  /**
   * The actual dependency object itself
   */

  readonly value: any;

  /**
   * The collection that this dependency belongs to
   */

  owner: Dependencies;

  /**
   * Clones the dependency. Required in case the dependency
   * is added to any other collection
   */

  clone(): IProvider;
}

export class Provider<T> implements IProvider {
  public owner: Dependencies;
  constructor(readonly id: string, public value: T, readonly overridable: boolean = true) { }

  /**
   * Clones the dependency - works with base classes.
   */

  clone(): Provider<T> {
    const constructor = this.constructor;
    const clone = new (<any>constructor)(this.id, this.value);

    // ns might not match up -- since it's common for constructors
    // to prefix the ns before calling super. This fixes that specific
    // case
    clone.id    = this.id;
    clone.value = this.value;
    clone.overridable = this.overridable;
    return clone;
  }
}

/**
 */

export interface IFactory {
  create(...rest): any;
}

/**
 * Factory Provider for creating new instances of things
 */

export class FactoryProvider extends Provider<IFactory> implements IFactory {
  create(...rest: any[]): any {
    return this.owner.inject(this.value.create(...rest));
  }
}

/**
 * factory Provider for classes
 */


export class ClassFactoryProvider extends Provider<{ new(...rest): any}> implements IFactory {
  constructor(id: string, readonly clazz: { new(...rest): any }) {
    super(id, clazz);
    assert(clazz, `Class must be defined for ${id}.`);
  }
  create(...rest: any[]) {
    return this.owner.create(this.clazz, rest);
  }
}

export type registerableProviderType = Array<IProvider|Dependencies|any[]>;

/**
 * Contains a collection of Dependencies
 */

export class Dependencies implements ICloneable {

  private _dependenciesByNs: any = {};

  constructor(...items: registerableProviderType) {
    this.register(...items);
  }

  /**
   */

  get length() {
    return this.queryAll("/**").length;
  }

  /**
   * Queries for one Provider with the given namespace
   * @param {string} ns namespace to query.
   */

  query<T extends IProvider>(ns: string) {
    return this.queryAll<T>(ns)[0];
  }

  /**
   * queries for all Dependencies with the given namespace
   */

  queryAll<T extends IProvider>(ns: string) {
    return <T[]>(this._dependenciesByNs[ns] || []);
  }

  /**
   */

  link(dependency: IProvider) {
    dependency.owner = this;
    return dependency;
  }

  /**
   */

  clone() {
    return new Dependencies(...this.queryAll<any>("/**"));
  }

  /**
   */

  inject<T>(instance: T & IInjectable) {
    const values = this.getPropertyValues(instance);
    for (const property in values) {
      instance[property] = values[property];
    }

    if (instance.$didInject) {
      instance.$didInject();
    }

    return instance;
  }

  /**
   */

  create(clazz: { new(...rest: any[]): any }, parameters: any[]) {

    const values = this.getPropertyValues(clazz);
    for (const property in values) {
      if (parameters[property] == null) {
        parameters[property] = values[property];
      }
    }

    return this.inject(new clazz(...parameters));
  }

  /**
   */

  register(...dependencies: registerableProviderType): Dependencies {

    const flattenedDependencies: Array<IProvider> = flattenDeep(dependencies);

    for (let dependency of flattenedDependencies) {

      // Dependencies collection? Merge it into this one.
      if (dependency instanceof Dependencies) {
        this.register(...(<Dependencies>dependency).queryAll("/**"));
        continue;
      }

      // need to clone the dependency in casse it's part of any other
      // dependency collection, or even a singleton -- this is particularly required for features
      // such as dependency injection.
      dependency = dependency.clone();

      let existing: Array<IProvider>;

      // check if the Provider already exists to ensure that there are no collisions
      if (existing = this._dependenciesByNs[dependency.id]) {
        if (!existing[0].overridable) {
          throw new Error(`Provider with namespace "${dependency.id}" already exists.`);
        }
      }

      // ref back so that the dependency can fetch additional information
      // for dependency injection. this line is
      this.link(dependency);

      // the last part of the namespace is the unique id. Example namespaces:
      // entities/text, entitiesControllers/div, components/item
      this._dependenciesByNs[dependency.id] = [dependency];

      // store the Provider in a spot where it can be queried with globs (**).
      // This is much faster than parsing this stuff on the fly when calling query()
      const nsParts = dependency.id.split("/");
      for (let i = 0, n = nsParts.length; i < n; i++) {
        const ns = nsParts.slice(0, i).join("/") + "/**";

        if (!this._dependenciesByNs[ns]) {
          this._dependenciesByNs[ns] = [];
        }

        this._dependenciesByNs[ns].push(dependency);
      }
    }

    return this;
  }

  private getPropertyValues(target: any) {
    const __inject = Reflect.getMetadata("injectProperties", target);

    if (target.$$injected) {
      // console.error(`Ignoring additional dependency injection on ${target.constructor.name}.`);
      return;
    }

    // may bust of the object is sealed

    if (!Object.isSealed(target)) target.$$injected = true;

    const properties = {};

    if (__inject) {
      for (let property in __inject) {
        const [ns, map] = __inject[property];
        let value;

        if (/\*\*$/.test(ns)) {
          value = this.queryAll<Provider<any>>(ns).map(map);
        } else {
          value = this.query<Provider<any>>(ns);
          value = value ? map(value) : undefined;
        }

        if (value != null) {
          properties[property] = value;
        }

        if (!process.env.TESTING && (value == null || value.length === 0)) {
          console.warn(`Cannot inject ${ns} into ${target.name || target.constructor.name}.${property} property.`);
        }
      }
    }

    return properties;
  }
}