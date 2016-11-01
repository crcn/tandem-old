import * as memoize from "memoizee";
import { getDependencyHash } from "./utils";

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
    return "dependencyGraph";
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
    const hash = getDependencyHash(ops);
    this.logger.verbose(`Loading dependency ${hash}`);
    return this.eagerFindByHash(hash) || await this.collection.loadOrInsertItem({ hash }, {
      filePath: ops.filePath,
      loaderOptions: ops.loaderOptions,
      hash
    });
  }, { promise: true, normalizer: args => getDependencyHash(args[0]) }) as (ops: IResolvedDependencyInfo) => Promise<Dependency>;

  /**
   */

  loadDependency = memoize(async (ops: IResolvedDependencyInfo): Promise<Dependency> => {
    const entry  = await this.getDependency(ops);
    const logTimer = this.logger.startTimer();
    await entry.load();
    logTimer.stop(`Loaded ${ops.filePath}`);
    return entry;
  }, { promise: true, normalizer: args => getDependencyHash(args[0]) }) as (ops: IResolvedDependencyInfo) => Promise<Dependency>;
}
