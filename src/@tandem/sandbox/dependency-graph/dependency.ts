import * as path from "path";
import * as memoize from "memoizee";

import { pull } from "lodash";
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
  loaderOptions?: any;
  content?: string;
  map?: RawSourceMap;
  type?: string;
  updatedAt?: number;
  sourceUpdatedAt?: number;
  importedDependencyInfo?: IResolvedDependencyInfo[];
  includedDependencyInfo?: IResolvedDependencyInfo[];
}

// TODO - cover case where depenedency doesn't exist

@loggable()
export class Dependency extends BaseActiveRecord<IDependencyData> implements IInjectable {

  protected readonly logger: Logger;

  readonly idProperty = "hash";

  private _filePath: string;
  private _ready: boolean;
  private _shouldLoadAgain: boolean;
  private _importedDependencyInfo: IResolvedDependencyInfo[];
  private _includedDependencyInfo: IResolvedDependencyInfo[];
  private _type: string;
  private _content: string;
  private _loaderOptions: any;
  private _hash: string;
  private _changeWatchers: DisposableCollection;

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  private _map: RawSourceMap;
  private _fileCacheItem: FileCacheItem;
  private _fileCacheItemObserver: IActor;
  private _updatedAt: number;
  private _importedDependencyObserver: IActor;
  private _notifyLoadedLock: boolean;
  private _loading: boolean;
  private _loaded: boolean;
  private _loadedDependencies: boolean;
  private _sourceUpdatedAt: number;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  constructor(source: IDependencyData, collectionName: string, private _graph: DependencyGraph) {
    super(source, collectionName);

    this._importedDependencyObserver = new WrapBus(this.onImportedDependencyAction.bind(this));
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

  get importedDependencyInfo() {
    return this._importedDependencyInfo;
  }

  /**
   */

  get includedDependencyInfo() {
    return this._includedDependencyInfo;
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
    return this._importedDependencyInfo.map(info => info.filePath);
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

  get importedDependencies(): Dependency[] {
    return this._importedDependencyInfo.map((inf) => {
      return this._graph.eagerFindByHash(inf.hash);
    }).filter(dep => !!dep);
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

  getDependencyHash(relativeOrAbsolutePath: string): string {
    const info = this._importedDependencyInfo.find(info => info.relativePath === relativeOrAbsolutePath || info.filePath === relativeOrAbsolutePath);
    return info && info.hash;
  }

  eagerGetDependency(relativeOrAbsolutePath: string) {
    return this._graph.eagerFindByHash(this.getDependencyHash(relativeOrAbsolutePath));
  }

  serialize() {
    return {
      map: this._map,
      hash: this._hash,
      type: this._type,
      content: this._content,
      filePath: this.filePath,
      updatedAt: this._updatedAt,
      loaderOptions: this._loaderOptions,
      sourceUpdatedAt: this._sourceUpdatedAt,
      includedDependencyInfo: this._includedDependencyInfo,
      importedDependencyInfo: this._importedDependencyInfo,
    };
  }

  setPropertiesFromSource({ filePath, loaderOptions, type, updatedAt, map, content, importedDependencyInfo, includedDependencyInfo, hash, sourceUpdatedAt }: IDependencyData) {
    this._type          = type;
    this._filePath      = filePath;
    this._loaderOptions = loaderOptions || {};
    this._updatedAt     = updatedAt;
    this._sourceUpdatedAt = sourceUpdatedAt;
    this._hash          = hash;
    this._map           = map;
    this._content       = content;
    this._importedDependencyInfo = importedDependencyInfo || [];
    this._includedDependencyInfo = includedDependencyInfo || [];
  }

  load = memoize(async (): Promise<Dependency> => {

    this._loaded = false;
    this._loading = true;
    this.logger.verbose("Loading...");
    const logTimer = this.logger.startTimer(null, null, LogLevel.VERBOSE);
    const fileCache = await this.getSourceFileCacheItem();
    const sourceFileUpdatedAt = await this.getLatestSourceFileUpdateTimestamp();

    if (this._sourceUpdatedAt !== sourceFileUpdatedAt) {

      // sync update times. TODO - need to include included files as well. This is at the beginning
      // in case the file cache item changes while the dependency is loading (shouldn't happen so often).
      this._sourceUpdatedAt = sourceFileUpdatedAt;

      await this.loadHard();
      await this.save();
    } else {
      this.logger.verbose("No change. Reusing cached content.");
    }

    await this.loadDependencies();

    this._loading = false;
    logTimer.stop("loaded");

    if (this._sourceUpdatedAt !== await this.getLatestSourceFileUpdateTimestamp()) {
      this.logger.verbose("File cache changed during load, reloading.")
      return this.reload();
    }

    this._loaded  = true;
    this.notifyLoaded();

    // watch for changes now prevent cyclical dependencies from cyclically
    // listening and emitting the same "done" actions
    await this.watchForChanges();

    return this;
  }, { length: 0, promise: true }) as () => Promise<Dependency>;


  private async getLatestSourceFileUpdateTimestamp() {
    return Math.max(this._sourceUpdatedAt || 0, ...(
      (await this.getSourceFiles()).map(sourceFile => sourceFile.updatedAt || 0)
    ));
  }

  private async getSourceFiles() {
    return [
      await this.getSourceFileCacheItem(),
      ...(await Promise.all(this._includedDependencyInfo.map(info => this._fileCache.item(info.filePath))))
    ];
  }

  /**
   */

  private async loadHard() {

    this.logger.verbose("Transforming source content using graph strategy");


    const loader = this._graph.$strategy.getLoader(this._loaderOptions);
    const transformResult: IDependencyLoaderResult = await loader.load(this, await this.getInitialSourceContent());

    this._content = transformResult.content;
    this._map     = transformResult.map;
    this._type    = transformResult.type;

    this._importedDependencyInfo = [];
    this._includedDependencyInfo = [];

    const importedDependencyPaths = transformResult.importedDependencyPaths || [];

    // cases where there's overlapping between imported & included dependencies (probably)
    // a bug with the module loader, or discrepancy between how the strategy and target bundler should behave.
    const includedDependencyPaths = pull(transformResult.includedDependencyPaths || [], ...importedDependencyPaths);

    await Promise.all([
      this.resolveDependencies(includedDependencyPaths, this._includedDependencyInfo),
      this.resolveDependencies(importedDependencyPaths, this._importedDependencyInfo)
    ]);
  }

  /**
   */

  private async loadDependencies() {
    await Promise.all(this.importedDependencyInfo.map(async (info: IResolvedDependencyInfo) => {
      if (!info.filePath) return Promise.resolve();

      const dependency = await this._graph.getDependency(info);
      const waitLogger = this.logger.startTimer(`Waiting for dependency ${info.hash}:${info.filePath} to load...`, 1000 * 10, LogLevel.VERBOSE);

      // if the dependency is loading, then they're likely a cyclical dependency
      if (!dependency.loading) await dependency.load();

      waitLogger.stop(`Loaded dependency ${info.hash}:${info.filePath}`);
    }));
  }

  /**
   * TODO: may be better to make this part of the loader
   */

  async getInitialSourceContent(): Promise<IDependencyLoaderResult> {
    return {
      type: this.filePath && MimeTypeProvider.lookup(this.filePath, this._injector) || PLAIN_TEXT_MIME_TYPE,
      content: this.filePath && await (await this.getSourceFileCacheItem()).read()
    };
  }

  shouldDeserialize(b: IDependencyData) {
    return b.updatedAt > this.updatedAt;
  }

  private async watchForChanges() {

    if (this._changeWatchers) {
      this._changeWatchers.dispose();
    }

    const changeWatchers = this._changeWatchers = new DisposableCollection();

    // watch imported dependencies for any change -- imported dependencies
    // of which that may have nested dependencies. This chunk here helps notify any listeners
    // of dependency graph changes
    for (const dependency of this.importedDependencies) {
      dependency.observe(this._importedDependencyObserver);
      changeWatchers.push({
        dispose: () => dependency.unobserve(this._importedDependencyObserver)
      });
    }

    // included dependencies aren't self contained, so they don't get a Dependency object. For
    // that we'll need to watch their file cache active record and watch it for any changes. Since
    // they're typically included in the
    for (const sourceFile of await this.getSourceFiles()) {
      sourceFile.observe(this._fileCacheItemObserver);
      changeWatchers.push({
        dispose: () => sourceFile.unobserve(this._fileCacheItemObserver)
      });
    }
  }

  private onImportedDependencyAction(action: Action) {
    if (action.type === DependencyAction.DEPENDENCY_LOADED) {
      this.notifyLoaded();
    }
  }

  private notifyLoaded() {

    // cyclical dependencies, and dependencies that are shared may get
    // bubbled more than once, so lock the notifyLoaded method temporarily to ensure
    // that the same action doesn't get emitted again.
    if (this._notifyLoadedLock || !this._loaded) {
      return;
    }
    this._notifyLoadedLock = true;
    setTimeout(() => this._notifyLoadedLock = false, 0);

    // ensure that we get passed the ready lock
    this.notify(new DependencyAction(DependencyAction.DEPENDENCY_LOADED));
  }

  private resolveDependencies(dependencyPaths: string[], info: IResolvedDependencyInfo[]) {
    return Promise.all(dependencyPaths.map(async (relativePath) => {
      this.logger.verbose("resolving dependency %s", relativePath);
      const dependencyInfo = await this._graph.$strategy.resolve(relativePath, path.dirname(this.filePath));
      dependencyInfo.relativePath = relativePath;
      info.push(dependencyInfo);
    }));
  }

  private async reload() {
    this.logger.verbose("Reloading");
    this.load["clear"]();
    return await this.load();
  }

  private onFileCacheAction(action: Action) {

    // reload the dependency if file cache item changes -- could be the data url, source file, etc.
    if (action.type === PropertyChangeAction.PROPERTY_CHANGE && !this.loading) {
      this.logger.info("Source file changed");
      this.reload();
    }
  }
}
