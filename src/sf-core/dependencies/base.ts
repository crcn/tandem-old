import { flattenDeep } from "lodash";

export interface IInjectable {
  didInject(): void;
}

/**
 * injects properties
 */

export class Injector {

  /**
   * Injects dependencies into the target injectable
   */

  static inject(target: any, dependencies: Dependencies) {
    const __inject = target["__inject"];
    if (__inject) {
      for (let property in __inject) {
        const [ns, map] = __inject[property];
        let value;

        if (/\*\*$/.test(ns)) {
          value = dependencies.queryAll<Dependency<any>>(ns);
          target[property] = value.map(map);
        } else {
          value = dependencies.query<Dependency<any>>(ns);
          target[property] = map(value);
        }

        if (!process.env.TESTING && (value == null || value.length === 0)) {
          console.warn(`Cannot inject ${ns} into ${target.constructor.name}.${property} property.`);
        }
      }
      target.didInject();
    }

    return target;
  }
}


export interface IDependency {

  /**
   * The unique namespace of the dependency
   */

  readonly ns: string;

  /**
   * The actual dependency object itself
   */

  readonly value: any;

  /**
   * The collection that this dependency belongs to
   */

  dependencies: Dependencies;

  /**
   * Clones the dependency. Required in case the dependency
   * is added to any other collection
   */

  clone(): IDependency;
}

export class Dependency<T> implements IDependency {
  public dependencies: Dependencies;
  constructor(readonly ns: string, readonly value: T) { }

  /**
   * Clones the dependency - works with base classes.
   */

  clone(): Dependency<T> {
    const constructor = this.constructor;
    const clone = new (<any>constructor)(this.ns, this.value);

    // ns might not match up -- since it's common for constructors
    // to prefix the ns before calling super. This fixes that specific
    // case
    clone.ns    = this.ns;
    clone.value = this.value;
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
  create(...rest: Array<any>): any {
    return Injector.inject(this.value.create(...rest), this.dependencies);
  }
}

/**
 * factory Dependency for classes
 */

export class ClassFactoryDependency extends FactoryDependency {
  constructor(ns: string, clazz: { new(...rest): any }) {
    super(ns, { create: (...rest) => new clazz(...rest) });
  }
}

/**
 * Contains a collection of Dependencies
 */

export class Dependencies {

  private _dependenciesByNs: any = {};

  constructor(...items: Array<IDependency>) {
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

  createChild() {
    return new Dependencies(...this.queryAll<any>("/**"));
  }

  /**
   */

  register(...Dependencies: Array<IDependency|Array<any>>) {

    const flattenedDependencies: Array<IDependency> = flattenDeep(Dependencies);

    for (let dependency of flattenedDependencies) {

      // need to clone the dependency in casse it's part of any other
      // dependency collection, or even a singleton -- this is particularly required for features
      // such as dependency injection.
      dependency = dependency.clone();

      // check if the Dependency already exists to ensure that there are no collisions
      if (this._dependenciesByNs[dependency.ns]) {
        throw new Error(`Dependency with namespace "${dependency.ns}" already exists.`);
      }

      // ref back so that the dependency can fetch additional information
      // for dependency injection. this line is
      dependency.dependencies = this;

      // the last part of the namespace is the unique id. Example namespaces:
      // entities/text, entitiesControllers/div, components/item
      this._dependenciesByNs[dependency.ns] = [dependency];

      // store the Dependency in a spot where it can be queried with globs (**).
      // This is much faster than parsing this stuff on the fly when calling query()
      const nsParts = dependency.ns.split("/");
      for (let i = 0, n = nsParts.length; i < n; i++) {
        const ns = nsParts.slice(0, i).join("/") + "/**";

        if (!this._dependenciesByNs[ns]) {
          this._dependenciesByNs[ns] = [];
        }

        this._dependenciesByNs[ns].push(dependency);
      }
    }
  }
}

