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
  Injector,
  loggable,
  isMaster,
  BubbleBus,
  Dependency,
  Observable,
  IInjectable,
  ISerializer,
  IObservable,
  serializable,
  Dependencies,
  watchProperty,
  ISourceLocation,
  SingletonThenable,
  BaseActiveRecord,
  MimeTypeDependency,
  ActiveRecordAction,
  DisposableCollection,
  PropertyChangeAction,
  PrivateBusDependency,
  DependenciesDependency,
  ActiveRecordCollection,
  MimeTypeAliasDependency,
} from "@tandem/common";

import {
  BundlerDependency,
  FileCacheDependency,
  FileSystemDependency,
  FileResolverDependency,
  BundlerLoaderFactoryDependency,
  ContentEditorFactoryDependency,
} from "./dependencies";

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
  hasEmbeddedDependencies?: boolean;
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
  resolvedDependencyInfo?: any;
}

@loggable()
export class Bundle extends BaseActiveRecord<IBundleData> implements IInjectable {

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

  @inject(FileCacheDependency.ID)
  private _fileCache: FileCache;
  private _watchingFileCacheItem: boolean;

  @inject(FileSystemDependency.ID)
  private _fileSystem: IFileSystem;

  private _map: RawSourceMap;
  private _fileCacheItem: FileCacheItem;
  private _fileCacheItemWatchers: DisposableCollection;
  private _updatedAt: number;
  private _dependencyObserver: IActor;
  private _emittingReady: boolean;
  private _readyLock: boolean;
  private _loading: boolean;


  constructor(source: IBundleData, collectionName: string, private _bundler: Bundler, private _dependencies: Dependencies) {
    super(source, collectionName, PrivateBusDependency.getInstance(_dependencies));

    this._dependencyObserver = new WrapBus(this.onDependencyAction.bind(this));
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
   * TRUE when the bundle, and all of its dependencies are loaded.
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

  get resolvedDependencyInfo() {
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

  get absoluteDependencyPaths() {
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
   * @type {Bundle[]}
   */

  get dependencyBundles(): Bundle[] {
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

  whenReady(): Promise<Bundle> {
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

  eagerGetDependencyByRelativePath(relativePath: string) {
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
      resolvedDependencyInfo: this._resolvedDependencyInfo,
    };
  }

  setPropertiesFromSource({ filePath, loaderOptions, type, updatedAt, content, resolvedDependencyInfo, hash }: IBundleData) {
    this._type      = type;
    this._filePath  = filePath;
    this._loaderOptions = loaderOptions;
    this._updatedAt = updatedAt;
    this._hash = hash;
    this._content   = content;
    this._resolvedDependencyInfo = resolvedDependencyInfo || {};
  }

  async load() {
    if (this._loading) return this;
    this._loading = true;

    this.logger.verbose("loading");

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

    this._resolvedDependencyInfo = {};
    // TODO - need to differentiate imported from included dependency.
    const dependencyPaths = transformResult.dependencyPaths || [];
    await Promise.all(dependencyPaths.map(async (relativePath, i) => {
      const dependencyInfo = await this.resolveDependencyInfo(relativePath);
      if (!dependencyInfo) {
        return this.logger.warn("could not resolve ", relativePath);
      }
      this._resolvedDependencyInfo[relativePath] = dependencyInfo;
      this.logger.verbose("loading dependency %s -> %s", relativePath, dependencyInfo.filePath);
      const dependencyBundle = await this._bundler.bundle(dependencyInfo);
      this.logger.verbose("loaded dependency %s", relativePath);
      dependencyBundle.observe(this._dependencyObserver);
    }));


    this.logger.verbose("saving");

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
      type: MimeTypeDependency.lookup(this.filePath, this._dependencies),
      content: await (await this.getSourceFileCacheItem()).read()
    }
  }

  shouldDeserialize(b: IBundleData) {
    return b.updatedAt > this.updatedAt;
  }

  private onDependencyAction(action: Action) {

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

  private async resolveDependencyInfo(dependencyPath: string) {
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

  readonly collection: ActiveRecordCollection<Bundle, IBundleData>;
  private _bundleRequests: any;
  public $strategy: IBundleStragegy;

  constructor(strategy: IBundleStragegy, @inject(DependenciesDependency.ID) private _dependencies: Dependencies) {
    super();
    this._bundleRequests = {};

    // temporary - this should be passed into the constructor
    this.$strategy = strategy || Injector.inject(new DefaultBundleStragegy(), this._dependencies);
    this.collection = ActiveRecordCollection.create(this.collectionName, _dependencies, (source: IBundleData) => {
      return Injector.inject(new Bundle(source, this.collectionName, this, _dependencies), this._dependencies);
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

  eagerFindByFilePath(filePath): Bundle {
    return this.collection.find((entity) => entity.filePath === filePath);
  }

  /**
   * Looks for a loaded item. Though, it may not exist in memory, but it *may* exist in some other
   * process.
   */

  eagerFindByHash(hash): Bundle {
    return this.collection.find((entity) => entity.hash === hash);
  }

  /**
   * Loads an item from memory if it exists, or from the remote data store.
   */

  async findByFilePath(filePath): Promise<Bundle> {
    return this.eagerFindByFilePath(filePath) || await this.collection.loadItem({ filePath });
  }

  /**
   * Creates a new bundle with the given file path.
   *
   * @param {string} entryFilePath
   * @returns {Promise<Bundle>}
   */

  async bundle(ops: IBundleResolveResult): Promise<Bundle> {
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