import * as sm from "source-map";
import * as path from "path";
import * as md5 from "md5";
import * as memoize from "memoizee";

import { values } from "lodash";
import { WrapBus } from "mesh";
import { FileEditor } from "./editor";
import { IFileSystem } from "./file-system";
import { RawSourceMap } from "source-map";
import { BundleAction } from "./actions";
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
  BubbleBus,
  Provider,
  Observable,
  IInjectable,
  LogLevel,
  ISerializer,
  IObservable,
  serializable,
  PLAIN_TEXT_MIME_TYPE,
  Injector,
  watchProperty,
  ISourceLocation,
  BaseActiveRecord,
  MimeTypeProvider,
  ActiveRecordAction,
  DisposableCollection,
  PropertyChangeAction,
  PrivateBusProvider,
  InjectorProvider,
  ActiveRecordCollection,
  MimeTypeAliasProvider,
} from "@tandem/common";

import {
  BundlerProvider,
  FileCacheProvider,
  FileSystemProvider,
  FileResolverProvider,
  BundlerLoaderFactoryProvider,
  ContentEditorFactoryProvider,
} from "./providers";

export interface IBundleResolveResult {

  /**
   * Resolved file path
   */

  filePath: string;

  /**
   * The loader for the file path
   */

  loaderOptions?: any;
}

export interface IBundleStrategyOptions {
  name?: string;
  config?: any;
}

export interface IBundleStragegy {

  /**
   * Returns a loader with the given options. Example
   *
   * strategy.getLoader(['text']); // new TextBundleLoader()
   */

  getLoader(loaderOptions: any): IBundleLoader;

  /**
   * Returns where the target file path is and how it should be loaded. Examples
   *
   * strategy.resolve('text!./filePath.txt', 'src/content') // { filePath: src/content/filePath.txt, loaderOptions: ['text'] }
   */

  resolve(filePath: string, cwd: string): Promise<IBundleResolveResult>;
}

export type bundleLoaderType = { new(strategy: IBundleStragegy): IBundleLoader };

export interface IBundleContent {
  readonly type: string; // mime type
  readonly content: any;
  readonly ast?: any;
  map?: RawSourceMap;
}

export interface IBundleLoaderResult extends IBundleContent {
  dependencyPaths?: string[];
}

export interface IBundleLoader {
  load(filePath: string, content: IBundleContent): Promise<IBundleLoaderResult>;
}

export abstract class BaseBundleLoader implements IBundleLoader {
  constructor(readonly strategy: IBundleStragegy) { }
  abstract load(filePath: string, content: IBundleContent): Promise<IBundleLoaderResult>;
}

export interface IBundleData {
  hash: string;
  filePath: string;
  loaderOptions: any;
  content?: string;
  type?: string;
  updatedAt?: number;
  resolvedProviderInfo?: any;
}

@loggable()
export class BundleDependency extends BaseActiveRecord<IBundleData> implements IInjectable {

  protected readonly logger: Logger;

  readonly idProperty = "hash";

  private _filePath: string;
  private _ready: boolean;
  private _resolvedDependencyInfo: { [Identifier: string]: IBundleResolveResult };
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


  constructor(source: IBundleData, collectionName: string, private _bundler: Bundler, public $injector: Injector) {
    super(source, collectionName, PrivateBusProvider.getInstance($injector));

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

  get bundler(): Bundler {
    return this._bundler;
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
    return values(this._resolvedDependencyInfo).map((inf: IBundleResolveResult) => inf.filePath);
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
   * @type {BundleDependency[]}
   */

  get dependencies(): BundleDependency[] {
    return values(this._resolvedDependencyInfo).map((inf) => {
      return this._bundler.eagerFindByHash(getBundleItemHash(inf));
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

  whenReady(): Promise<BundleDependency> {
    if (this.ready) return Promise.resolve(this);
    return new Promise((resolve, reject) => {
      const observer = new WrapBus((action: Action) => {
        if (action.type === BundleAction.BUNDLE_READY && this.ready) {
          this.unobserve(observer);
          resolve(this);
        }
      });
      this.observe(observer);
    });
  }

  /**
   * Synchronously fetches a dependency of this item, even though the active record
   * may not currently exist in memory. This is okay in certain cases - particularly where
   * this method is called within a sandbox where everything must be loaded in.
   */

  eagerGetProviderByRelativePath(relativePath: string) {
    return this._bundler.eagerFindByHash(this.getAbsoluteDependencyPath(relativePath));
  }

  getDependencyHash(relativePath: string) {
    const info: IBundleResolveResult = this._resolvedDependencyInfo[relativePath];
    if (info == null) {
      this.logger.error(`Absolute path on bundle entry does not exist for ${relativePath}.`);
      return;
    }
    return getBundleItemHash(info);
  }

  /**
   * Deprecated. Use hash instead.
   */

  getAbsoluteDependencyPath(relativePath: string) {
    const info: IBundleResolveResult = this._resolvedDependencyInfo[relativePath];
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

  setPropertiesFromSource({ filePath, loaderOptions, type, updatedAt, content, resolvedProviderInfo, hash }: IBundleData) {
    this._type          = type;
    this._filePath      = filePath;
    this._loaderOptions = loaderOptions || {};
    this._updatedAt     = updatedAt;
    this._hash          = hash;
    this._content       = content;
    this._resolvedDependencyInfo = resolvedProviderInfo || {};
  }

  load = memoize(async (): Promise<BundleDependency> => {

    this._loading = true;
    this.logger.verbose("Loading...");
    const logTimer = this.logger.startTimer();

    const loader = this._bundler.$strategy.getLoader(this._loaderOptions);
    const transformResult: IBundleLoaderResult = await loader.load(this.filePath, await this.getInitialSourceContent());

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
      const dependency = await this._bundler.getDependency(dependencyInfo);

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
  }, { length: 0, promise: true }) as () => Promise<BundleDependency>;

  /**
   * TODO: may be better to make this part of the loader
   */

  async getInitialSourceContent(): Promise<IBundleLoaderResult> {
    return {
      filePath: this.filePath,
      type: MimeTypeProvider.lookup(this.filePath, this.$injector) || PLAIN_TEXT_MIME_TYPE,
      content: await (await this.getSourceFileCacheItem()).read()
    };
  }

  shouldDeserialize(b: IBundleData) {
    return b.updatedAt > this.updatedAt;
  }

  private onDependencyAction(action: Action) {

    // for now, reload the entire bundle if a dependency changes. This is to ensure
    // that any changes that are embedded in this bundle get updates when they change -- this
    // is particular to css files.
    if (action.type === BundleAction.BUNDLE_READY) {
      if (this.loading) {
        this.logger.warn("Unable to reload bundle while it's still loading.")
      } else {
        this.reload2();
      }
    }
  }

  private notifyBundleReady() {

    // fix case where a nested dependency BUNDLE_READY action is
    // emitted by dependent bundles (this happens a lot)
    if (this._readyLock || !this._ready) {
      return;
    }
    this._readyLock = true;
    setTimeout(() => this._readyLock = false, 0);

    // ensure that we get passed the ready lock
    this.logger.verbose("dispatch BUNDLE_READY");
    this.notify(new BundleAction(BundleAction.BUNDLE_READY));
  }

  private async resolveProviderInfo(dependencyPath: string) {
    return this._bundler.$strategy.resolve(dependencyPath, path.dirname(this.filePath));
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
 * Singleton bundler for mapping and transforming application source code
 * into one bundle file.
 */

@loggable()
export class Bundler extends Observable {

  protected readonly logger: Logger;

  private _collection: ActiveRecordCollection<BundleDependency, IBundleData>;
  public $strategy: IBundleStragegy;

  @inject(InjectorProvider.ID)
  public $injector: Injector;

  constructor(private _strategy: IBundleStragegy) {
    super();
  }

  $didInject() {

    // temporary - this should be passed into the constructor
    this.$strategy = this._strategy || this.$injector.inject(new DefaultBundleStragegy());
    this._collection = ActiveRecordCollection.create(this.collectionName, this.$injector, (source: IBundleData) => {
      return this.$injector.inject(new BundleDependency(source, this.collectionName, this, this.$injector));
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

  eagerFindByFilePath(filePath): BundleDependency {
    return this.collection.find((entity) => entity.filePath === filePath);
  }

  /**
   * Looks for a loaded item. Though, it may not exist in memory, but it *may* exist in some other
   * process.
   */

  eagerFindByHash(hash): BundleDependency {
    return this.collection.find((entity) => entity.hash === hash);
  }

  /**
   * @deprecated - use findByHash
   * Loads an item from memory if it exists, or from the remote data store.
   */

  async findByFilePath(filePath): Promise<BundleDependency> {
    return this.eagerFindByFilePath(filePath) || await this.collection.loadItem({ filePath });
  }

  /**
   */

  getDependency = memoize(async (ops: IBundleResolveResult): Promise<BundleDependency> => {
    const hash = getBundleItemHash(ops);
    this.logger.verbose("Loading dependency %s", hash);
    return this.eagerFindByHash(hash) || await this.collection.loadOrCreateItem({ hash }, {
      filePath: ops.filePath,
      loaderOptions: ops.loaderOptions,
      hash
    });
  }, { promise: true, normalizer: args => getBundleItemHash(args[0]) }) as (ops: IBundleResolveResult) => Promise<BundleDependency>;

  /**
   */

  loadDependency = memoize(async (ops: IBundleResolveResult): Promise<BundleDependency> => {
    const entry  = await this.getDependency(ops);
    return await entry.load();
  }, { promise: true, normalizer: args => getBundleItemHash(args[0]) }) as (ops: IBundleResolveResult) => Promise<BundleDependency>;
}

function getBundleItemHash({ filePath, loaderOptions }: IBundleResolveResult): string {
  return md5(filePath + ":" + JSON.stringify(loaderOptions || {}));
}

export * from "./strategies";