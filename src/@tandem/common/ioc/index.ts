import { IActor } from "../actors";
import { ITyped } from "@tandem/common/object";
import { INamed } from "@tandem/common/object";
import { Action } from "../actions";
import { IBrokerBus } from "../busses";
import { IApplication } from "@tandem/common/application";

import { File } from "@tandem/common/models";
import {
  IFactory,
  Provider,
  IProvider,
  Dependencies,
  ClassFactoryProvider,
 } from "./base";

// TODO - add more static find methods to each Provider here

export * from "./base";

/**
 */

export const APPLICATION_SERVICES_NS = "application/services";
export class ApplicationServiceProvider extends ClassFactoryProvider implements IFactory {

  constructor(id: string, clazz: { new(): IActor }) {
    super(`${APPLICATION_SERVICES_NS}/${id}`, clazz);
  }

  create(): IActor {
    return super.create();
  }

  static findAll(Dependencies: Dependencies): Array<ApplicationServiceProvider> {
    return Dependencies.queryAll<ApplicationServiceProvider>(`${APPLICATION_SERVICES_NS}/**`);
  }
}

/**
 */

export const APPLICATION_SINGLETON_NS = "singletons/application";
export class ApplicationSingletonProvider extends Provider<IApplication> {

  constructor(value: IApplication) {
    super(APPLICATION_SINGLETON_NS, value);
  }

  static find(Dependencies: Dependencies): ApplicationSingletonProvider {
    return Dependencies.query<ApplicationSingletonProvider>(APPLICATION_SINGLETON_NS);
  }
}

export function createSingletonBusProviderClass(name: string): { getInstance(dependencies:Dependencies): IBrokerBus, ID: string, new(bus: IBrokerBus): Provider<IBrokerBus> } {

  const id = ["bus", name].join("/");

  return class BusProvider extends Provider<IBrokerBus> {

    static readonly ID = id;

    constructor(bus: IBrokerBus) {
      super(id, bus);
    }

    static getInstance(dependencies: Dependencies): IBrokerBus {
      return dependencies.query<any>(id).value;
    }
  };
}

/**
 * Public bus that is accessible to outside resources
 */

export const PublicBusProvider    = createSingletonBusProviderClass("public");

/**
 * Protected bus that can be shared with very specific outside resources
 *
 * Bubbes messages to the public bus.
 */

export const ProtectedBusProvider = createSingletonBusProviderClass("protected");

/**
 * Private bus that can only be used within the application. This typically contains messages
 * that are junk for other outside resources.
 *
 * Bubbles messages to the protected bus.
 */

export const PrivateBusProvider   = createSingletonBusProviderClass("private");


/**
 */

export class DependenciesProvider extends Provider<Dependencies> {
  static ID = "dependencies";
  constructor() {
    super(DependenciesProvider.ID, null);
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

export class CommandFactoryProvider extends ClassFactoryProvider {
  static readonly NS_PREFIX = "commands";
  readonly actionFilter: Function;
  constructor(actionFilter: string|Function, readonly clazz: { new(...rest: any[]): IActor }) {
    super([CommandFactoryProvider.NS_PREFIX, clazz.name].join("/"), clazz);
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
    return dependencies.queryAll<CommandFactoryProvider>([CommandFactoryProvider.NS_PREFIX, "**"].join("/"));
  }

  static findAllByAction(action: Action, dependencies: Dependencies) {
    return this.findAll(dependencies).filter((dep) => dep.actionFilter(action));
  }

  clone() {
    return new CommandFactoryProvider(this.actionFilter, this.clazz);
  }
}

/**
 */

export class MimeTypeProvider extends Provider<string> {
  static readonly NS_PREFIX = "mimeType";
  constructor(readonly fileExtension: string, readonly mimeType: string) {
    super([MimeTypeProvider.NS_PREFIX, fileExtension].join("/"), mimeType);
  }
  clone() {
    return new MimeTypeProvider(this.fileExtension, this.mimeType);
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<MimeTypeProvider>([MimeTypeProvider.NS_PREFIX, "**"].join("/"));
  }
  static lookup(filePath: string, dependencies: Dependencies): string {
    const extension = filePath.split(".").pop();
    const dep = dependencies.query<MimeTypeProvider>([MimeTypeProvider.NS_PREFIX, extension].join("/"));
    return dep ? dep.value : undefined;
  }
}

export class MimeTypeAliasProvider extends Provider<string> {
  static readonly NS = "mimeTypeAliases";
  constructor(readonly mimeType: string, readonly aliasMimeType: string) {
    super(MimeTypeAliasProvider.getNamespace(mimeType), aliasMimeType);
  }
  clone() {
    return new MimeTypeAliasProvider(this.mimeType, this.aliasMimeType);
  }
  static getNamespace(mimeType: string) {
    return [MimeTypeAliasProvider.NS, mimeType].join("/");
  }
  static lookup(filePathOrMimeType: string, dependencies: Dependencies): string {
    const mimeType = MimeTypeProvider.lookup(filePathOrMimeType, dependencies);
    const dep = (mimeType && dependencies.query<MimeTypeAliasProvider>(this.getNamespace(mimeType))) || dependencies.query<MimeTypeAliasProvider>(this.getNamespace(filePathOrMimeType));
    return (dep && dep.value) || mimeType || filePathOrMimeType;
  }
}

export function createSingletonProviderClass<T>(id: string): { getInstance(dependencies: Dependencies): T, ID: string, new(clazz: { new(...rest): T }): IProvider } {
  return class SingletonProvider implements IProvider {
    static readonly ID: string = id;
    private _value: T;
    private _clazz: { new(...rest): T };
    readonly overridable = false;
    readonly id = id;
    public owner: Dependencies;

    constructor(clazz: { new(...rest): T }) { this._clazz = clazz; }

    get value(): T {
      return this._value || (this._value = this.owner.create(this._clazz, []));
    }
    clone() {
      return new SingletonProvider(this._clazz);
    }
    static getInstance(dependencies: Dependencies): T {
      const dep = dependencies.query<SingletonProvider>(id);
      return dep ? dep.value : undefined;
    }
  }
}
