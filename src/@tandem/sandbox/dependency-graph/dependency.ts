import * as path from "path";
import * as memoize from "memoizee";

import { values } from "lodash";
import { IFileSystem } from "../file-system";
import { RawSourceMap } from "source-map";
import { DependencyGraph } from "./graph";
import { DependencyAction } from "./actions";
import { FileCache, FileCacheItem } from "../file-cache";


import {
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
} from "./strategies"

import {
  FileCacheProvider,
  FileSystemProvider,
} from "../providers";

import { WrapBus } from "mesh";

import {
  Action,
  inject,
  Logger,
  IActor,
  loggable,
  Injector,
  LogLevel,
  IInjectable,
  watchProperty,
  MimeTypeProvider,
  BaseActiveRecord,
  InjectorProvider,
  PropertyChangeAction,
  PLAIN_TEXT_MIME_TYPE,
  DisposableCollection,
} from "@tandem/common";

import { getDependencyHash } from "./utils";

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
  private _shouldLoadAgain: boolean;
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
  private _fileCacheItemObserver: IActor;
  private _updatedAt: number;
  private _dependencyObserver: IActor;
  private _readyLock: boolean;
  private _loading: boolean;
  private _loaded: boolean;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  constructor(source: IDependencyData, collectionName: string, private _graph: DependencyGraph) {
    super(source, collectionName);

    this._dependencyObserver = new WrapBus(this.onDependencyAction.bind(this));
    this._fileCacheItemObserver = new WrapBus(this.onFileCacheAction.bind(this));
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

  get loaded() {
    return this._loaded;
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
      return this._graph.eagerFindByHash(getDependencyHash(inf));
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

  getDependencyHash(relativePath: string) {
    const info: IResolvedDependencyInfo = this._resolvedDependencyInfo[relativePath];
    if (info == null) {
      this.logger.error(`Absolute path on bundle entry does not exist for ${relativePath}.`);
      return;
    }
    return getDependencyHash(info);
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

    this._loaded = false;
    this._loading = true;
    this.logger.verbose("Loading...");
    const logTimer = this.logger.startTimer();
    const fileCache = await this.getSourceFileCacheItem();
    const fileCacheUpdatedAt = fileCache.updatedAt;

    const loader = this._graph.$strategy.getLoader(this._loaderOptions);

    const transformResult: IDependencyLoaderResult = await loader.load(this.filePath, await this.getInitialSourceContent());

    if (!transformResult.content || this._content === transformResult.content) {
      this.logger.info("Content has not changed");
      this._loading = false;
      this.notifyLoaded();
      return this;
    }

    this._content = transformResult.content;
    this._ast     = transformResult.ast;
    this._map     = transformResult.map;
    this._type    = transformResult.type;

    if (!this._watchingFileCacheItem) {
      this._watchingFileCacheItem = true;
      const fileCache = await this.getSourceFileCacheItem();
      fileCache.observe(this._fileCacheItemObserver);
    }

    for (const dependency of this.dependencies) {
      dependency.unobserve(this._dependencyObserver);
    }

    this._resolvedDependencyInfo = {};

    // TODO - need to differentiate imported from included dependency.
    const importedDependencyPaths = transformResult.importedDependencyPaths || [];
    await Promise.all(importedDependencyPaths.map(async (relativePath, i) => {
      const dependencyInfo = await this.resolveProviderInfo(relativePath);
      if (!dependencyInfo) {
        return this.logger.warn("could not resolve ", relativePath);
      }
      this._resolvedDependencyInfo[relativePath] = dependencyInfo;
      this._resolvedDependencyInfo[dependencyInfo.filePath] = dependencyInfo;
      this.logger.verbose("loading dependency %s -> %s", relativePath, dependencyInfo.filePath);

      const waitLogger = this.logger.startTimer(`Waiting for dependency ${getDependencyHash(dependencyInfo)}:${dependencyInfo.filePath} to load...`, 1000 * 10, LogLevel.VERBOSE);
      const dependency = await this._graph.getDependency(dependencyInfo);

      // ensure that the dependency is not loading to prevent promise lock
      // on cyclical dependencies.
      if (!dependency.loading) {
        await dependency.load();
      }

      waitLogger.stop(`Loaded dependency ${dependency.hash}:${dependency.filePath}`);
    }));

    await this.save();

    this.notifyLoaded();

    for (const dependency of this.dependencies) {
      dependency.observe(this._dependencyObserver);
    }

    this._loading = false;
    logTimer.stop("loaded");

    if (fileCacheUpdatedAt !== fileCache.updatedAt) {
      this.logger.verbose("File cache changed during load, reloading.")
      return this.reload();
    }

    this._loaded  = true;

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
    if (action.type === DependencyAction.DEPENDENCY_LOADED) {
      if (this.loading) {
        this.logger.warn("Unable to reload bundle while it's still loading.")
      } else {
        this.reload();
      }
    }
  }

  private notifyLoaded() {

    // fix case where a nested dependency DEPENDENCY_LOADED action is
    // emitted by dependent bundles (this happens a lot)
    if (this._readyLock || !this._ready) {
      return;
    }
    this._readyLock = true;
    setTimeout(() => this._readyLock = false, 0);

    // ensure that we get passed the ready lock
    this.logger.verbose("dispatch DEPENDENCY_LOADED");
    this.notify(new DependencyAction(DependencyAction.DEPENDENCY_LOADED));
  }

  private async resolveProviderInfo(dependencyPath: string) {
    return this._graph.$strategy.resolve(dependencyPath, path.dirname(this.filePath));
  }

  private async reload() {
    this.load["clear"]();
    return await this.load();
  }

  private onFileCacheAction(action: Action) {

    // reload the dependency if file cache item changes -- could be the data url, source file, etc.
    if (action.type === PropertyChangeAction.PROPERTY_CHANGE && !this.loading) {
      this.reload();
    }
  }
}
