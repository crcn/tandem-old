import { IActor } from "../actors";
import { ITyped } from "@tandem/common/object";
import { INamed } from "@tandem/common/object";
import { IBrokerBus } from "../busses";
import { IApplication } from "@tandem/common/application";
import { IASTNode } from "@tandem/common/lang";
import { Action } from "../actions";

import { File } from "@tandem/common/models";
import {
  IFactory,
  Injector,
  Dependency,
  IDependency,
  Dependencies,
  ClassFactoryDependency,
 } from "./base";

// TODO - add more static find methods to each Dependency here

export * from "./base";

/**
 */

export const APPLICATION_SERVICES_NS = "application/services";
export class ApplicationServiceDependency extends ClassFactoryDependency implements IFactory {

  constructor(id: string, clazz: { new(): IActor }) {
    super(`${APPLICATION_SERVICES_NS}/${id}`, clazz);
  }

  create(): IActor {
    return super.create();
  }

  static findAll(Dependencies: Dependencies): Array<ApplicationServiceDependency> {
    return Dependencies.queryAll<ApplicationServiceDependency>(`${APPLICATION_SERVICES_NS}/**`);
  }
}

/**
 */

export const APPLICATION_SINGLETON_NS = "singletons/application";
export class ApplicationSingletonDependency extends Dependency<IApplication> {

  constructor(value: IApplication) {
    super(APPLICATION_SINGLETON_NS, value);
  }

  static find(Dependencies: Dependencies): ApplicationSingletonDependency {
    return Dependencies.query<ApplicationSingletonDependency>(APPLICATION_SINGLETON_NS);
  }
}

/**
 */

// TODO - GlobalActorDependency instead of broker bus here
export class MainBusDependency extends Dependency<IBrokerBus> {
  static NS = "mainBus";
  constructor(value: IBrokerBus) {
    super(MainBusDependency.NS, value);
  }
  static getInstance(dependencies: Dependencies): IBrokerBus {
    return dependencies.query<MainBusDependency>(MainBusDependency.NS).value;
  }
}

/**
 */

export class DependenciesDependency extends Dependency<Dependencies> {
  static NS = "dependencies";
  constructor() {
    super(DependenciesDependency.NS, null);
  }

  get owner(): Dependencies {
    return this.value;
  }

  set owner(value: Dependencies) {
    this.value = value;
  }
}

/**
 */

export class CommandFactoryDependency extends ClassFactoryDependency {
  static readonly NS_PREFIX = "commands";
  readonly actionFilter: Function;
  constructor(actionFilter: string|Function, readonly clazz: { new(...rest: any[]): IActor }) {
    super([CommandFactoryDependency.NS_PREFIX, clazz.name].join("/"), clazz);
    if (typeof actionFilter === "string") {
      this.actionFilter = (action: Action) => action.type === actionFilter;
    } else {
      this.actionFilter = actionFilter;
    }
  }
  create(): IActor {
    return super.create();
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<CommandFactoryDependency>([CommandFactoryDependency.NS_PREFIX, "**"].join("/"));
  }

  static findAllByAction(action: Action, dependencies: Dependencies) {
    return this.findAll(dependencies).filter((dep) => dep.actionFilter(action));
  }

  clone() {
    return new CommandFactoryDependency(this.actionFilter, this.clazz);
  }
}

/**
 */

export class MimeTypeDependency extends Dependency<string> {
  static readonly NS_PREFIX = "mimeType";
  constructor(readonly fileExtension: string, readonly mimeType: string) {
    super([MimeTypeDependency.NS_PREFIX, fileExtension].join("/"), mimeType);
  }
  clone() {
    return new MimeTypeDependency(this.fileExtension, this.mimeType);
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<MimeTypeDependency>([MimeTypeDependency.NS_PREFIX, "**"].join("/"));
  }
  static lookup(filePath: string, dependencies: Dependencies): string {
    const extension = filePath.split(".").pop();
    const dep = dependencies.query<MimeTypeDependency>([MimeTypeDependency.NS_PREFIX, extension].join("/"));
    return dep ? dep.value : undefined;
  }
}

export function createSingletonDependencyClass<T>(id: string, clazz: { new(...rest): T }) {
  return class SingletonDependency implements IDependency {
    static readonly NS: string = id;
    private _value: T;
    readonly overridable = false;
    readonly id = id;
    public owner: Dependencies;

    constructor(){ }
    get value(): T {
      return this._value || (this._value = Injector.create(clazz, [], this.owner));
    }
    clone() {
      return new SingletonDependency();
    }
    static getInstance(dependencies: Dependencies): T {
      const dep = dependencies.query<SingletonDependency>(id);
      return dep ? dep.value : undefined;
    }
  }
}
