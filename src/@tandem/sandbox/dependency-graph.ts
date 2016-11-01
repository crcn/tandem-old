
/**
 * Not exactly the math equivalent. Though DependencyGraph is the
 * best descriptor I can think of for this functionality since it's not
 * exactly classified as a bundling system.
 */

import * as sm from "source-map";
import * as md5 from "md5";
import * as path from "path";
import * as memoize from "memoizee";

import { values } from "lodash";
import { WrapBus } from "mesh";
import { FileEditor } from "./editor";
import { IFileSystem } from "./file-system";
import { RawSourceMap } from "source-map";
import { DependencyAction } from "./actions";
import { DefaultBundleStragegy } from "./strategies";
import { FileCache, FileCacheItem } from "./file-cache";
import { IFileResolver, IFileResolverOptions } from "./resolver";

import {
  inject,
  IActor,
  Action,
  Logger,
  loggable,
  isMaster,
  LogLevel,
  Provider,
  Injector,
  BubbleBus,
  Observable,
  ISerializer,
  IInjectable,
  IObservable,
  serializable,
  watchProperty,
  ISourceLocation,
  BaseActiveRecord,
  MimeTypeProvider,
  InjectorProvider,
  ActiveRecordAction,
  PrivateBusProvider,
  DisposableCollection,
  PropertyChangeAction,
  PLAIN_TEXT_MIME_TYPE,
  MimeTypeAliasProvider,
  ActiveRecordCollection,
} from "@tandem/common";

import {
  FileCacheProvider,
  FileSystemProvider,
  FileResolverProvider,
  DependencyGraphProvider,
  ContentEditorFactoryProvider,
  DependencyLoaderFactoryProvider,
} from "./providers";

export interface IResolvedDependencyInfo {

  /**
   * Resolved file path
   */

  filePath: string;

  /**
   * The loader for the file path
   */

  loaderOptions?: any;
}

export interface IDependencyGraphStrategyOptions {
  name?: string;
  config?: any;
}

export interface IDependencyGraphStrategy {

  /**
   * Returns a loader with the given options. Example
   *
   * strategy.getLoader(['text']); // new TextBundleLoader()
   */

  getLoader(loaderOptions: any): IDependencyLoader;

  /**
   * Returns where the target file path is and how it should be loaded. Examples
   *
   * strategy.resolve('text!./filePath.txt', 'src/content') // { filePath: src/content/filePath.txt, loaderOptions: ['text'] }
   */

  resolve(filePath: string, cwd: string): Promise<IResolvedDependencyInfo>;
}

export type dependencyLoaderType = { new(strategy: IDependencyGraphStrategy): IDependencyLoader };

export interface IDependencyContent {
  readonly type: string; // mime type
  readonly content: any;
  readonly ast?: any;
  map?: RawSourceMap;
}

export interface IDependencyLoaderResult extends IDependencyContent {
  dependencyPaths?: string[];
}

export interface IDependencyLoader {
  load(filePath: string, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}

export abstract class BaseBundleLoader implements IDependencyLoader {
  constructor(readonly strategy: IDependencyGraphStrategy) { }
  abstract load(filePath: string, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}

export interface IDependencyData {
  hash: string;
  filePath: string;
  loaderOptions: any;
  content?: string;
  type?: string;
  updatedAt?: number;
  resolvedProviderInfo?: any;
}

@loggable()
export class Dependency extends BaseActiveRecord<IDependencyData> implements IInjectable {

  protected readonly logger: Logger;

  readonly idProperty = "hash";

  private _filePath: string;
  private _ready: boolean;
  private _resolvedDependencyInfo: { [Identifier: string]: IResolvedDependencyInfo };
  private _type: string;
  private _content: string;
  private _ast: any;
  private _loaderOptions: any;
  private _hash: string;

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;
  private _watchingFileCacheItem: boolean;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  private _map: RawSourceMap;
  private _fileCacheItem: FileCacheItem;
  private _fileCacheItemWatchers: DisposableCollection;
  private _updatedAt: number;
  private _dependencyObserver: IActor;
  private _emittingReady: boolean;
  private _readyLock: boolean;
  private _loading: boolean;

  @inject(InjectorProvider.ID)
  private _injector: Injector;


  constructor(source: IDependencyData, collectionName: string, private _graph: DependencyGraph) {
    super(source, collectionName);

    this._dependencyObserver = new WrapBus(this.onDependencyAction.bind(this));
  }

  $didInject() {
    this.logger.generatePrefix = () => `${this.hash}:${this.filePath} `;
  }

  /**
   * The file cache reference that contains
   *
   * @readonly
   * @type {FileCacheItem}
   */

  async getSourceFileCacheItem(): Promise<FileCacheItem> {
    if (this._fileCacheItem) return this._fileCacheItem;
    return this._fileCacheItem = await this._fileCache.item(this.filePath);
  }

  get graph(): DependencyGraph {
    return this._graph;
  }

  get loading(): boolean {
    return this._loading;
  }

  /**
   * Timestamp of when the bundle was last persisted to the data store.
   *
   * @readonly
   * @type {number}
   */

  get updatedAt(): number {
    return this._updatedAt;
  }

  /**
   */

  get hash(): string {
    return this._hash;
  }

  /**
   * TRUE when the bundle, and all of its injector are loaded.
   *
   * @readonly
   * @type {boolean}
   */

  get ready(): boolean {
    return this._ready;
  }

  /**
   * Abstract Syntax Tree node of the loaded content. Used particularly
   * in the Sandbox.
   *
   * @readonly
   */

  get ast() {
    return this._ast;
  }

  /**
   * The source map of the transformed content.
   *
   * @readonly
   */

  get map(): RawSourceMap {
    return this._map;
  }

  /**
   * The source file path
   *
   * @readonly
   */

  get filePath() {
    return this._filePath;
  }

  /**
   */

  get resolvedProviderInfo() {
    return this._resolvedDependencyInfo;
  }

  /**
   */

  get loaderOptions() {
    return this._loaderOptions;
  }

  /**
   * The relative to absolute dependency paths defined in this bundle
   *
   * @readonly
   */

  get absoluteProviderPaths() {
    return values(this._resolvedDependencyInfo).map((inf: IResolvedDependencyInfo) => inf.filePath);
  }

  /**
   * The loaded bundle type
   *
   * @readonly
   */

  get type() {
    return this._type;
  }

  /**
   * The dependency bundle references
   *
   * @readonly
   * @type {Dependency[]}
   */

  get dependencies(): Dependency[] {
    return values(this._resolvedDependencyInfo).map((inf) => {
      return this._graph.eagerFindByHash(getBundleItemHash(inf));
    });
  }

  /**
   * The loaded bundle content
   *
   * @readonly
   * @type {string}
   */

  get content(): string {
    return this._content;
  }

  willSave() {
    this._updatedAt = Date.now();
  }

  whenReady(): Promise<Dependency> {
    if (this.ready) return Promise.resolve(this);
    return new Promise((resolve, reject) => {
      const observer = new WrapBus((action: Action) => {
        if (action.type === DependencyAction.DEPENDENCY_READY && this.ready) {
          this.unobserve(observer);
          resolve(this);
        }
      });
      this.observe(observer);
    });
  }

  getDependencyHash(relativePath: string) {
    const info: IResolvedDependencyInfo = this._resolvedDependencyInfo[relativePath];
    if (info == null) {
      this.logger.error(`Absolute path on bundle entry does not exist for ${relativePath}.`);
      return;
    }
    return getBundleItemHash(info);
  }

  eagerGetDependency(relativePath: string) {
    return this._graph.eagerFindByHash(this.getDependencyHash(relativePath));
  }

  /**
   * Deprecated. Use hash instead.
   */

  getAbsoluteDependencyPath(relativePath: string) {
    const info: IResolvedDependencyInfo = this._resolvedDependencyInfo[relativePath];
    if (info == null) {
      this.logger.error(`Absolute path on bundle entry does not exist for ${relativePath}.`);
      return;
    }
    return info.filePath;
  }

  serialize() {
    return {
      hash: this._hash,
      type: this._type,
      content: this._content,
      filePath: this.filePath,
      updatedAt: this._updatedAt,
      loaderOptions: this._loaderOptions,
      resolvedProviderInfo: this._resolvedDependencyInfo,
    };
  }

  setPropertiesFromSource({ filePath, loaderOptions, type, updatedAt, content, resolvedProviderInfo, hash }: IDependencyData) {
    this._type          = type;
    this._filePath      = filePath;
    this._loaderOptions = loaderOptions || {};
    this._updatedAt     = updatedAt;
    this._hash          = hash;
    this._content       = content;
    this._resolvedDependencyInfo = resolvedProviderInfo || {};
  }

  load = memoize(async (): Promise<Dependency> => {

    this._loading = true;
    this.logger.verbose("Loading...");
    const logTimer = this.logger.startTimer();

    const loader = this._graph.$strategy.getLoader(this._loaderOptions);
    const transformResult: IDependencyLoaderResult = await loader.load(this.filePath, await this.getInitialSourceContent());

    if (!transformResult.content || this._content === transformResult.content) {
      this.logger.info("Content has not changed");
      this._loading = false;
      this.notifyBundleReady();
      return this;
    }

    this._content = transformResult.content;
    this._ast     = transformResult.ast;
    this._map     = transformResult.map;
    this._type    = transformResult.type;

    if (!this._watchingFileCacheItem) {
      this._watchingFileCacheItem = true;
      const fileCache = await this.getSourceFileCacheItem();
      this._fileCacheItemWatchers = new DisposableCollection(
        watchProperty(fileCache, "localFileModifiedAt", this.onFileCacheItemChange.bind(this)),
        watchProperty(fileCache, "url", this.onFileCacheItemChange.bind(this))
      );
    }

    for (const dependency of this.dependencies) {
      dependency.unobserve(this._dependencyObserver);
    }

    this._resolvedDependencyInfo = {};
    // TODO - need to differentiate imported from included dependency.
    const dependencyPaths = transformResult.dependencyPaths || [];
    await Promise.all(dependencyPaths.map(async (relativePath, i) => {
      const dependencyInfo = await this.resolveProviderInfo(relativePath);
      if (!dependencyInfo) {
        return this.logger.warn("could not resolve ", relativePath);
      }
      this._resolvedDependencyInfo[relativePath] = dependencyInfo;
      this._resolvedDependencyInfo[dependencyInfo.filePath] = dependencyInfo;
      this.logger.verbose("loading dependency %s -> %s", relativePath, dependencyInfo.filePath);

      const waitLogger = this.logger.startTimer(`Waiting for dependency ${getBundleItemHash(dependencyInfo)}:${dependencyInfo.filePath} to load...`, 1000 * 10, LogLevel.VERBOSE);
      const dependency = await this._graph.getDependency(dependencyInfo);

      // ensure that the dependency is not loading to prevent promise lock
      // on cyclical dependencies.
      if (!dependency.loading) {
        await dependency.load();
      }

      waitLogger.stop(`Loaded dependency ${dependency.hash}:${dependency.filePath}`);
    }));

    await this.save();

    this.notifyBundleReady();

    for (const dependency of this.dependencies) {
      dependency.observe(this._dependencyObserver);
    }

    this._ready = true;
    this._loading = false;
    logTimer.stop("loaded");

    return this;
  }, { length: 0, promise: true }) as () => Promise<Dependency>;

  /**
   * TODO: may be better to make this part of the loader
   */

  async getInitialSourceContent(): Promise<IDependencyLoaderResult> {
    return {
      filePath: this.filePath,
      type: MimeTypeProvider.lookup(this.filePath, this._injector) || PLAIN_TEXT_MIME_TYPE,
      content: await (await this.getSourceFileCacheItem()).read()
    };
  }

  shouldDeserialize(b: IDependencyData) {
    return b.updatedAt > this.updatedAt;
  }

  private onDependencyAction(action: Action) {

    // for now, reload the entire bundle if a dependency changes. This is to ensure
    // that any changes that are embedded in this bundle get updates when they change -- this
    // is particular to css files.
    if (action.type === DependencyAction.DEPENDENCY_READY) {
      if (this.loading) {
        this.logger.warn("Unable to reload bundle while it's still loading.")
      } else {
        this.reload2();
      }
    }
  }

  private notifyBundleReady() {

    // fix case where a nested dependency DEPENDENCY_READY action is
    // emitted by dependent bundles (this happens a lot)
    if (this._readyLock || !this._ready) {
      return;
    }
    this._readyLock = true;
    setTimeout(() => this._readyLock = false, 0);

    // ensure that we get passed the ready lock
    this.logger.verbose("dispatch DEPENDENCY_READY");
    this.notify(new DependencyAction(DependencyAction.DEPENDENCY_READY));
  }

  private async resolveProviderInfo(dependencyPath: string) {
    return this._graph.$strategy.resolve(dependencyPath, path.dirname(this.filePath));
  }

  private reload2() {
    this.load["clear"]();
    this.load();
  }

  private onFileCacheItemChange() {
    this.reload2();
  }
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
    this.$strategy = this._strategy || this.$injector.inject(new DefaultBundleStragegy());
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

function getBundleItemHash({ filePath, loaderOptions }: IResolvedDependencyInfo): string {
  return md5(filePath + ":" + JSON.stringify(loaderOptions || {}));
}

export * from "./strategies";