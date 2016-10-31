import * as sm from "source-map";
import * as path from "path";
import * as md5 from "md5";

import { values } from "lodash";
import { WrapBus } from "mesh";
import { FileEditor } from "./editor";
import { IFileSystem } from "./file-system";
import { RawSourceMap } from "source-map";
import { BundleAction } from "./actions";
import { FileCache, FileCacheItem } from "./file-cache";
import { IFileResolver, IFileResolverOptions } from "./resolver";
import { DefaultBundleStragegy } from "./strategies";

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
  ISerializer,
  IObservable,
  serializable,
  Injector,
  watchProperty,
  ISourceLocation,
  SingletonThenable,
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
  name: string;
  config: any;
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
  hasEmbeddedProviders?: boolean;
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
  private _resolvedProviderInfo: { [Identifier: string]: IBundleResolveResult };
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


  constructor(source: IBundleData, collectionName: string, private _bundler: Bundler, private _injector: Injector) {
    super(source, collectionName, PrivateBusProvider.getInstance(_injector));

    this._dependencyObserver = new WrapBus(this.onProviderAction.bind(this));
  }

  $didInject() {
    this.logger.generatePrefix = () => `${this.filePath} `;
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
    return this._resolvedProviderInfo;
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
    return values(this._resolvedProviderInfo).map((inf: IBundleResolveResult) => inf.filePath);
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

  get dependencyBundles(): BundleDependency[] {
    return values(this._resolvedProviderInfo).map((inf) => {
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
    return this._bundler.eagerFindByHash(this.getAbsoluteProviderPath(relativePath));
  }

  getProviderHash(relativePath: string) {
    const info: IBundleResolveResult = this._resolvedProviderInfo[relativePath];
    if (info == null) {
      this.logger.error(`Absolute path on bundle entry does not exist for ${relativePath}.`);
      return;
    }
    return getBundleItemHash(info);
  }

  /**
   * Deprecated. Use hash instead.
   */

  getAbsoluteProviderPath(relativePath: string) {
    const info: IBundleResolveResult = this._resolvedProviderInfo[relativePath];
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
      resolvedProviderInfo: this._resolvedProviderInfo,
    };
  }

  setPropertiesFromSource({ filePath, loaderOptions, type, updatedAt, content, resolvedProviderInfo, hash }: IBundleData) {
    this._type      = type;
    this._filePath  = filePath;
    this._loaderOptions = loaderOptions;
    this._updatedAt = updatedAt;
    this._hash = hash;
    this._content   = content;
    this._resolvedProviderInfo = resolvedProviderInfo || {};
  }

  async load() {
    if (this._loading) return this;
    this._loading = true;

    this.logger.verbose("loading...");
    const logTimer = this.logger.startTimer("waiting for load...");

    const loader = this._bundler.$strategy.getLoader(this._loaderOptions || {});

    const transformResult: IBundleLoaderResult = await loader.load(this.filePath, await this.getInitialSourceContent());

    if (this._content === transformResult.content) {
      this.logger.info("content has not changed.");
      this.notifyBundleReady();
      this._loading = false;
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

    for (const dependencyBundle of this.dependencyBundles) {
      dependencyBundle.unobserve(this._dependencyObserver);
    }

    this._resolvedProviderInfo = {};
    // TODO - need to differentiate imported from included dependency.
    const dependencyPaths = transformResult.dependencyPaths || [];
    await Promise.all(dependencyPaths.map(async (relativePath, i) => {
      const dependencyInfo = await this.resolveProviderInfo(relativePath);
      if (!dependencyInfo) {
        return this.logger.warn("could not resolve ", relativePath);
      }
      this._resolvedProviderInfo[relativePath] = dependencyInfo;
      this.logger.verbose("loading dependency %s -> %s", relativePath, dependencyInfo.filePath);
      const dependencyBundle = await this._bundler.bundle(dependencyInfo);
      this.logger.verbose("loaded dependency %s", relativePath);
      dependencyBundle.observe(this._dependencyObserver);
    }));


    logTimer.stop();

    await this.save();

    this._ready = true;
    this._loading = false;
    this.logger.info("done");
    this.notifyBundleReady();

    return this;
  }

  async getInitialSourceContent(): Promise<IBundleLoaderResult> {
    return {
      filePath: this.filePath,
      type: MimeTypeProvider.lookup(this.filePath, this._injector),
      content: await (await this.getSourceFileCacheItem()).read()
    }
  }

  shouldDeserialize(b: IBundleData) {
    return b.updatedAt > this.updatedAt;
  }

  private onProviderAction(action: Action) {

    // for now, reload the entire bundle if a dependency changes. This is to ensure
    // that any changes that are embedded in this bundle get updates when they change -- this
    // is particular to css files.
    if (action.type === BundleAction.BUNDLE_READY) {
      this.load();
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

  private onFileCacheItemChange() {
    this.load();
  }
}

/**
 * Singleton bundler for mapping and transforming application source code
 * into one bundle file.
 */

@loggable()
export class Bundler extends Observable {

  protected readonly logger: Logger;

  readonly collection: ActiveRecordCollection<BundleDependency, IBundleData>;
  private _bundleRequests: any;
  public $strategy: IBundleStragegy;

  constructor(strategy: IBundleStragegy, @inject(InjectorProvider.ID) private _injector: Injector) {
    super();
    this._bundleRequests = {};

    // temporary - this should be passed into the constructor
    this.$strategy = strategy || this._injector.inject(new DefaultBundleStragegy());
    this.collection = ActiveRecordCollection.create(this.collectionName, _injector, (source: IBundleData) => {
      return this._injector.inject(new BundleDependency(source, this.collectionName, this, _injector));
    });
    this.collection.sync();
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
   * Loads an item from memory if it exists, or from the remote data store.
   */

  async findByFilePath(filePath): Promise<BundleDependency> {
    return this.eagerFindByFilePath(filePath) || await this.collection.loadItem({ filePath });
  }

  /**
   * Creates a new bundle with the given file path.
   *
   * @param {string} entryFilePath
   * @returns {Promise<BundleDependency>}
   */

  async bundle(ops: IBundleResolveResult): Promise<BundleDependency> {
    const hash = getBundleItemHash(ops);
    return this._bundleRequests[hash] || (this._bundleRequests[hash] = new SingletonThenable(async () => {
      const bundle = await this.eagerFindByHash(hash);

      if (bundle) return bundle.whenReady();

      this.logger.verbose("bundling %s:%s", hash, ops.filePath);

      // at this point, the bundle does not exist in memory, or even
      // in a remote DS, so create & load it.
      return (await this.collection.create({ filePath: ops.filePath, loaderOptions: ops.loaderOptions, hash }).insert()).load();
    }));
  }
}

function getBundleItemHash({ filePath, loaderOptions }: IBundleResolveResult) {
  return md5(filePath + ":" + JSON.stringify(loaderOptions || {}));
}

export * from "./strategies";