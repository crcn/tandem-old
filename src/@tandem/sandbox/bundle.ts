import * as sm from "source-map";
import * as path from "path";

import { values } from "lodash";
import { WrapBus } from "mesh";
import { FileEditor } from "./editor";
import { IFileSystem } from "./file-system";
import { RawSourceMap } from "source-map";
import { BundleAction } from "./actions";
import { FileCache, FileCacheItem } from "./file-cache";
import { IFileResolver, IFileResolverOptions } from "./resolver";

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

interface IBundleFile {
  readonly filePath: string;
  readonly content: string;
}
export interface IBundleLoader {
  load(bundle: Bundle, content: IBundleContent): Promise<IBundleLoaderResult>;
}

export type bundleLoaderType = { new(): IBundleLoader };

export interface IBundleContent {
  readonly type: string; // mime type
  readonly content: any;
  readonly ast?: any;
  map?: RawSourceMap;
}

export interface IBundleLoaderResult extends IBundleContent {
  dependencyPaths?: string[];
}

export interface IBundleData {
  filePath: string;
  content?: string;
  type?: string;
  updatedAt?: number;
  absoluteDependencyPaths?: Object;
}

/**
 */

export async function loadBundleContent(bundle: Bundle, content: IBundleLoaderResult, dependencies: Dependencies): Promise<IBundleLoaderResult> {
  const dependencyPaths: string[] = [];

  let current: IBundleLoaderResult = Object.assign({}, content);

  let dependency: BundlerLoaderFactoryDependency;

  // Some loaders may return the same mime type (such as html-loader, and css-loader which simply return an AST node).
  // This ensures that they don't get re-used.
  const used = {};

  while((dependency = BundlerLoaderFactoryDependency.find(MimeTypeAliasDependency.lookup(current.type, dependencies), dependencies)) && !used[dependency.id]) {
    used[dependency.id] = true;
    current = await dependency.create(dependencies).load(bundle, current);
    if (current.dependencyPaths) {
      dependencyPaths.push(...current.dependencyPaths);
    }
  }

  return {
    map: current.map,
    ast: current.ast,
    type: current.type,
    content: current.content,
    dependencyPaths: dependencyPaths
  };
}

export interface ISerializeddBundle {
  filePath: string
}

/**
 * Bundle serializer particular to other parts of the codebase that hold the singleton
 * reference to the target bundle object, and ensures that when deserialized, will also reference to a singleton bundle object.
 */

class BundleSerializer implements ISerializer<Bundle, string> {
  serialize(bundle: Bundle) {
    return bundle.filePath;
  }
  deserialize(filePath, dependencies: Dependencies) {
    const bundler = BundlerDependency.getInstance(dependencies);

    // find an existing bundle object here, or add a new singleton bundle
    return bundler.eagerFindByFilePath(filePath) || bundler.collection.create({ filePath });
  }
}

@serializable(new BundleSerializer())
@loggable()
export class Bundle extends BaseActiveRecord<IBundleData> implements IInjectable {

  protected readonly logger: Logger;

  readonly idProperty = "filePath";

  private _filePath: string;
  private _ready: boolean;
  private _absoluteDependencyPaths: Object;
  private _type: string;
  private _content: string;
  private _ast: any;

  private _fileCache: FileCache;
  private _watchingFileCacheItem: boolean;
  private _fileSystem: IFileSystem;
  private _fileResolver: IFileResolver;
  private _editor: FileEditor;
  private _bundler: Bundler;
  private _map: RawSourceMap;
  private _fileCacheItem: FileCacheItem;
  private _fileCacheItemWatchers: DisposableCollection;
  private _updatedAt: number;
  private _dependencyObserver: IActor;
  private _emittingReady: boolean;
  private _readyLock: boolean;

  constructor(source: IBundleData, collectionName: string, private _dependencies: Dependencies) {
    super(source, collectionName, PrivateBusDependency.getInstance(_dependencies));
    this._fileCache = FileCacheDependency.getInstance(_dependencies);
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
    this._fileResolver = FileResolverDependency.getInstance(_dependencies);
    this._bundler = BundlerDependency.getInstance(_dependencies);
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
   * The relative to absolute dependency paths defined in this bundle
   *
   * @readonly
   */

  get absoluteDependencyPaths() {
    return this._absoluteDependencyPaths;
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
    return values(this._absoluteDependencyPaths).map((filePath) => this._bundler.eagerFindByFilePath(filePath));
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
    return this._bundler.eagerFindByFilePath(this.getAbsoluteDependencyPath(relativePath));
  }

  getAbsoluteDependencyPath(relativePath: string) {
    const absolutePath = this._absoluteDependencyPaths[relativePath];
    if (absolutePath == null) {
      this.logger.error(`Absolute path on bundle entry does not exist for ${relativePath}.`);
    }
    return absolutePath;
  }

  serialize() {
    return {
      type: this._type,
      content: this._content,
      filePath: this.filePath,
      updatedAt: this._updatedAt,
      absoluteDependencyPaths: this.absoluteDependencyPaths,
    };
  }

  setPropertiesFromSource({ filePath, type, updatedAt, content, absoluteDependencyPaths }: IBundleData) {
    this._type      = type;
    this._filePath  = filePath;
    this._updatedAt = updatedAt;
    this._content   = content;
    this._absoluteDependencyPaths = absoluteDependencyPaths || {};
  }

  async load() {
    this.logger.verbose("loading");

    const transformResult: IBundleLoaderResult = await this.loadTransformedContent();
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

    this._absoluteDependencyPaths = {};
    const dependencyPaths = transformResult.dependencyPaths;

    await Promise.all(dependencyPaths.map(async (dependencyPath, i) => {
      const resolvedPath = await this.resolveDependencyPath(dependencyPath);
      if (!resolvedPath) return;
      this._absoluteDependencyPaths[dependencyPath] = resolvedPath;
      this.logger.verbose("loading dependency %s", resolvedPath);
      const dependencyBundle = await this._bundler.bundle(resolvedPath);
      this.logger.verbose("loaded dependency %s", resolvedPath);
      dependencyBundle.observe(this._dependencyObserver);
    }));

    this.logger.verbose("saving");

    await this.save();

    this._ready = true;
    this.logger.info(`done`);
    this.notifyBundleReady();

    return this;
  }

  private async loadTransformedContent() {
    const dependencyPaths: string[] = [];
    let current: IBundleLoaderResult = await this.getInitialSourceContent();
    return loadBundleContent(this, current, this._dependencies);
  }

  async getInitialSourceContent(): Promise<IBundleLoaderResult> {
    return {
      type: MimeTypeDependency.lookup(this.filePath, this._dependencies),
      content: await (await this.getSourceFileCacheItem()).read()
    }
  }

  async getExpression(location: ISourceLocation) {
    const result = await this.loadTransformedContent();
    const map = result.map as sm.RawSourceMap;
    const consumer = new sm.SourceMapConsumer(map);
  }

  shouldDeserialize(b: IBundleData) {
    return b.updatedAt > this.updatedAt;
  }

  private onDependencyAction(action: Action) {
    if (action.type === BundleAction.BUNDLE_READY) {
      this.notifyBundleReady();
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

  private async resolveDependencyPath(dependencyPath: string) {
    const cwd = path.dirname(this.filePath);
    const resolvedPaths = [];

    // skip hash and URLs (for now)
    if (/^(#|http)/.test(dependencyPath)) {
      return undefined;
    }

    // check for protocol -- // at the minium
    if (/^(\w+:)?\/\//.test(dependencyPath)) {
      return dependencyPath;
    } else {
      try {
        return await this._fileResolver.resolve(dependencyPath, cwd);
      } catch(e) {
        this.logger.error(`Cannot find dependency file ${dependencyPath}.`);
      }
    }
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
  private _editor: FileEditor;
  private _bundleRequests: any;

  constructor(@inject(DependenciesDependency.ID) private _dependencies: Dependencies) {
    super();
    this._bundleRequests = {};
    this.collection = ActiveRecordCollection.create(this.collectionName, _dependencies, (source: IBundleData) => {
      return Injector.create(Bundle, [source, this.collectionName, _dependencies], _dependencies);
    });
    this.collection.sync();
  }

  get collectionName() {
    return "bundleItems";
  }

  /**
   * Looks for a loaded item. Though, it may not exist in memory, but it *may* exist in some other
   * process.
   */

  eagerFindByFilePath(filePath): Bundle {
    return this.collection.find((entity) => entity.filePath === filePath);
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

  async bundle(filePath: string): Promise<Bundle> {
    return this._bundleRequests[filePath] || (this._bundleRequests[filePath] = new SingletonThenable(async () => {
      const bundle = await this.findByFilePath(filePath);

      if (bundle) return bundle.whenReady();

      this.logger.verbose("bundling %s", filePath);

      // at this point, the bundle does not exist in memory, or even
      // in a remote DS, so create & load it.
      return (await this.collection.create({ filePath }).insert()).load();
    }));
  }
}