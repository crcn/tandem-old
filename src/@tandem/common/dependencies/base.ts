import { flattenDeep } from "lodash";
import { ICloneable } from "@tandem/common/object";
import * as assert from "assert";

export interface IInjectable {
  $didInject?(): void;
}

/**
 * injects properties
 */

export class Injector {

  /**
   * Injects dependencies into the target injectable
   */

  static getPropertyValues(target: any, dependencies: Dependencies) {
    const __inject = Reflect.getMetadata("injectProperties", target);
    const properties = {};


    if (__inject) {
      for (let property in __inject) {
        const [ns, map] = __inject[property];
        let value;

        if (/\*\*$/.test(ns)) {
          value = dependencies.queryAll<Dependency<any>>(ns).map(map);
        } else {
          value = dependencies.query<Dependency<any>>(ns);
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

  static inject(target: any, dependencies: Dependencies) {
    const values = this.getPropertyValues(target, dependencies);
    for (const property in values) {
      target[property] = values[property];
    }

    if (target.$didInject) {
      target.$didInject();
    }

    return target;
  }

  /**
   */

  static create(clazz: { new(...rest): any }, parameters: any[], dependencies: Dependencies) {
    const values = this.getPropertyValues(clazz, dependencies);
    for (const property in values) {
      if (parameters[property] == null) {
        parameters[property] = values[property];
      }
    }

    return this.inject(new clazz(...parameters), dependencies);
  }
}

export interface IDependency extends ICloneable {

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

  clone(): IDependency;
}

export class Dependency<T> implements IDependency {
  public owner: Dependencies;
  constructor(readonly id: string, public value: T, readonly overridable: boolean = false) { }

  /**
   * Clones the dependency - works with base classes.
   */

  clone(): Dependency<T> {
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
 * Factory Dependency for creating new instances of things
 */

export class FactoryDependency extends Dependency<IFactory> implements IFactory {
  create(...rest: any[]): any {
    return Injector.inject(this.value.create(...rest), this.owner);
  }
}

/**
 * factory Dependency for classes
 */


export class ClassFactoryDependency extends Dependency<{ new(...rest): any}> implements IFactory {
  constructor(id: string, readonly clazz: { new(...rest): any }) {
    super(id, clazz);
    assert(clazz, `Class must be defined for ${id}.`);
  }
  create(...rest: any[]) {
    return Injector.create(this.clazz, rest, this.owner);
  }
}

export type registerableDependencyType = Array<IDependency|Dependencies|any[]>;

/**
 * Contains a collection of Dependencies
 */

export class Dependencies implements ICloneable {

  private _dependenciesByNs: any = {};

  constructor(...items: registerableDependencyType) {
    this.register(...items);
  }

  /**
   */

  get length() {
    return this.queryAll("/**").length;
  }

  /**
   * Queries for one Dependency with the given namespace
   * @param {string} ns namespace to query.
   */

  query<T extends IDependency>(ns: string) {
    return this.queryAll<T>(ns)[0];
  }

  /**
   * queries for all Dependencies with the given namespace
   */

  queryAll<T extends IDependency>(ns: string) {
    return <T[]>(this._dependenciesByNs[ns] || []);
  }

  /**
   */

  link(dependency: IDependency) {
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

  register(...dependencies: registerableDependencyType): Dependencies {

    const flattenedDependencies: Array<IDependency> = flattenDeep(dependencies);

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

      let existing: Array<IDependency>;

      // check if the Dependency already exists to ensure that there are no collisions
      if (existing = this._dependenciesByNs[dependency.id]) {
        if (!existing[0].overridable) {
          throw new Error(`Dependency with namespace "${dependency.id}" already exists.`);
        }
      }

      // ref back so that the dependency can fetch additional information
      // for dependency injection. this line is
      this.link(dependency);

      // the last part of the namespace is the unique id. Example namespaces:
      // entities/text, entitiesControllers/div, components/item
      this._dependenciesByNs[dependency.id] = [dependency];

      // store the Dependency in a spot where it can be queried with globs (**).
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
}