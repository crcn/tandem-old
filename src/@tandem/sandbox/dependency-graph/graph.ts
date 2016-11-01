import * as memoize from "memoizee";
import { getBundleItemHash } from "./utils";

import { 
  IDependencyLoader,
  IResolvedDependencyInfo,
  IDependencyGraphStrategy,
  DefaultDependencyGraphStrategy,
} from "./strategies";

import { 
  Dependency,
  IDependencyData,
} from "./dependency";

import {
  Logger,
  inject,
  loggable,
  Injector,
  Observable,
  InjectorProvider,
  ActiveRecordCollection,
} from "@tandem/common";

export interface IDependencyGraphStrategyOptions {
  name?: string;
  config?: any;
}

/**
 * Singleton graph dependency for mapping and transforming application source code
 * into one bundle file.
 */

@loggable()
export class DependencyGraph extends Observable {

  protected readonly logger: Logger;

  private _collection: ActiveRecordCollection<Dependency, IDependencyData>;
  public $strategy: IDependencyGraphStrategy;

  @inject(InjectorProvider.ID)
  public $injector: Injector;

  constructor(private _strategy: IDependencyGraphStrategy) {
    super();
  }

  $didInject() {

    // temporary - this should be passed into the constructor
    this.$strategy = this._strategy || this.$injector.inject(new DefaultDependencyGraphStrategy());
    this._collection = ActiveRecordCollection.create(this.collectionName, this.$injector, (source: IDependencyData) => {
      return this.$injector.inject(new Dependency(source, this.collectionName, this));
    });

    this.logger.generatePrefix = () => `(~${this.$strategy.constructor.name}~) `;
    this.logger.verbose("Created");

    this.collection.sync();
  }

  get collection() {
    return this._collection;
  }

  getLoader(loaderOptions: any) {
    return this.$strategy.getLoader(loaderOptions);
  }

  get collectionName() {
    return "bundleItems";
  }

  /**
   * @deprecated
   * file path may be associated with multiple bundles
   */

  eagerFindByFilePath(filePath): Dependency {
    return this.collection.find((entity) => entity.filePath === filePath);
  }

  /**
   * Looks for a loaded item. Though, it may not exist in memory, but it *may* exist in some other
   * process.
   */

  eagerFindByHash(hash): Dependency {
    return this.collection.find((entity) => entity.hash === hash);
  }

  /**
   * @deprecated - use findByHash
   * Loads an item from memory if it exists, or from the remote data store.
   */

  async findByFilePath(filePath): Promise<Dependency> {
    return this.eagerFindByFilePath(filePath) || await this.collection.loadItem({ filePath });
  }

  /**
   */

  getDependency = memoize(async (ops: IResolvedDependencyInfo): Promise<Dependency> => {
    const hash = getBundleItemHash(ops);
    this.logger.verbose("Loading dependency %s", hash);
    return this.eagerFindByHash(hash) || await this.collection.loadOrCreateItem({ hash }, {
      filePath: ops.filePath,
      loaderOptions: ops.loaderOptions,
      hash
    });
  }, { promise: true, normalizer: args => getBundleItemHash(args[0]) }) as (ops: IResolvedDependencyInfo) => Promise<Dependency>;

  /**
   */

  loadDependency = memoize(async (ops: IResolvedDependencyInfo): Promise<Dependency> => {
    const entry  = await this.getDependency(ops);
    return await entry.load();
  }, { promise: true, normalizer: args => getBundleItemHash(args[0]) }) as (ops: IResolvedDependencyInfo) => Promise<Dependency>;
}
