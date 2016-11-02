import {
  Injector,
  Provider,
  ClassFactoryProvider,
} from "@tandem/common";

import {
  DependencyGraph,
  IDependencyGraphStrategyOptions
} from "./graph";

import {
  IDependencyLoader,
  dependencyLoaderType,
  IDependencyGraphStrategy,
} from "./strategies";

export class DependencyLoaderFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "bundleLoader";
  constructor(readonly mimeType: string, value: dependencyLoaderType) {
    super(DependencyLoaderFactoryProvider.getNamespace(mimeType), value);
  }
  static getNamespace(mimeType: string) {
    return [DependencyLoaderFactoryProvider.NS, mimeType].join("/");
  }
  create(strategy: IDependencyGraphStrategy): IDependencyLoader {
    return super.create(strategy);
  }
  static find(mimeType: string, injector: Injector): DependencyLoaderFactoryProvider {
    return injector.query<DependencyLoaderFactoryProvider>(this.getNamespace(mimeType));
  }
  clone() {
    return new DependencyLoaderFactoryProvider(this.mimeType, this.value);
  }
}

export class DependencyGraphStrategyProvider extends ClassFactoryProvider {
  static ID = "dependencyGraphStrategies";
  constructor(readonly name: string, clazz: { new(config:any): IDependencyGraphStrategy }) {
    super(DependencyGraphStrategyProvider.getNamespace(name), clazz);
  }
  static getNamespace(name: string) {
    return [DependencyGraphStrategyProvider.ID, name].join("/");
  }

  static create(strategyName: string, config: any, injector: Injector): IDependencyGraphStrategy {
    const dependency = injector.query<DependencyGraphStrategyProvider>(this.getNamespace(strategyName));
    return dependency && dependency.create(config);
  }
}

export class DependencyGraphProvider extends Provider<any> {
  static ID = "dependencyGraphs";
  private _instances: { [Identifier:string]: DependencyGraph };
  constructor(readonly clazz: { new(strategy: IDependencyGraphStrategy): DependencyGraph }) {
    super(DependencyGraphProvider.ID, clazz);
    this._instances = {};
  }
  clone() {
    return new DependencyGraphProvider(this.clazz);
  }
  getInstance(options: IDependencyGraphStrategyOptions): DependencyGraph {
    const strategyName = options && options.name || "default";
    if (this._instances[strategyName]) return this._instances[strategyName];
    return this._instances[strategyName] = this.owner.inject(new this.clazz(options && DependencyGraphStrategyProvider.create(options.name, options.config, this.owner)));
  }
  static getInstance(options: IDependencyGraphStrategyOptions, injector: Injector): DependencyGraph {
    return injector.query<DependencyGraphProvider>(this.ID).getInstance(options);
  }
}
