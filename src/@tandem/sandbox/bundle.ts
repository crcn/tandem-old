import * as path from "path";
import { IFileSystem } from "./file-system";
import { RawSourceMap } from "source-map";
import { BundleAction } from "./actions";
import { FileCache, FileCacheItem } from "./file-cache";
import { IFileResolver, IFileResolverOptions } from "./resolver";
// import * as sm from "source-map";
import {
  isMaster,
  inject,
  IActor,
  Action,
  Injector,
  Dependency,
  Observable,
  BubbleBus,
  ISerializer,
  IObservable,
  serializable,
  Dependencies,
  BaseActiveRecord,
  MainBusDependency,
  MimeTypeDependency,
  ActiveRecordAction,
  PropertyChangeAction,
  DependenciesDependency,
  ActiveRecordCollection,
} from "@tandem/common";
import { WrapBus } from "mesh";


import {
  BundlerDependency,
  FileCacheDependency,
  FileSystemDependency,
  FileResolverDependency,
  BundlerLoaderFactoryDependency,
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
  _id?: string;
  filePath: string;
  content?: string;
  type?: string;
  updatedAt?: number;
  absoluteDependencyPaths?: string[];
  relativeDependencyPaths?: Object;
}

/**
 */

export async function loadBundle(bundle: Bundle, content: IBundleLoaderResult, dependencies: Dependencies): Promise<IBundleLoaderResult> {
  const dependencyPaths: string[] = [];

  let current: IBundleLoaderResult = Object.assign({}, content);

  let dependency: BundlerLoaderFactoryDependency;
  const used = {};

  while((dependency = BundlerLoaderFactoryDependency.find(current.type, dependencies)) && !used[dependency.id]) {
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

class BundleSerializer implements ISerializer<Bundle, string> {
  serialize(bundle: Bundle) {
    return bundle.filePath;
  }
  deserialize(filePath, dependencies: Dependencies) {
    const bundler = BundlerDependency.getInstance(dependencies);
    return bundler.findByFilePath(filePath) || bundler.collection.create({ filePath });
  }
}

@serializable(new BundleSerializer())
export class Bundle extends BaseActiveRecord<IBundleData> {

  // TODO - this should be an integer instead of an id path. Maybe even a hash
  // of the original content to prevent module duplicates.
  readonly idProperty = "filePath";

  private _id: string;
  private _filePath: string;
  private _ready: boolean;
  private _absoluteDependencyPaths: string[];
  private _relativeDependencyPaths: Object;
  private _type: string;
  private _content: string;
  private _ast: any;
  private _fileCache: FileCache;
  private _fileSystem: IFileSystem;
  private _fileResolver: IFileResolver;
  private _bundler: Bundler;
  private _sourceContent: string;
  private _fileCacheItem: FileCacheItem;
  private _fileCacheItemObserver: IActor;
  private _updatedAt: number;
  private _dependencyObserver: IActor;
  private _emittingReady: boolean;
  private _readyLock: boolean;

  constructor(source: IBundleData, collectionName: string, private _dependencies: Dependencies) {
    super(source, collectionName, MainBusDependency.getInstance(_dependencies));
    this._fileCache = FileCacheDependency.getInstance(_dependencies);
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
    this._fileResolver = FileResolverDependency.getInstance(_dependencies);
    this._bundler = BundlerDependency.getInstance(_dependencies);
    this._fileCacheItemObserver = new WrapBus(this.onFileCacheItemAction.bind(this));
    this._dependencyObserver = new WrapBus(this.onDependencyAction.bind(this));
  }

  get sourceFileCache(): FileCacheItem {
    return this._fileCacheItem;
  }

  get sourceContent(): string {
    return this._sourceContent;
  }

  get id() {
    return this._id;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get ready() {
    return this._ready;
  }

  get ast() {
    return this._ast;
  }

  get filePath() {
    return this._filePath;
  }

  get absoluteDependencyPaths() {
    return this._absoluteDependencyPaths;
  }

  get relativeDependencyPaths() {
    return this._relativeDependencyPaths;
  }

  get type() {
    return this._type;
  }

  get dependencies(): Bundle[] {
    return this._absoluteDependencyPaths.map((filePath) => this._bundler.findByFilePath(filePath));
  }

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

  getDependencyByRelativePath(relativePath: string) {
    return this._bundler.findByFilePath(this.getAbsoluteDependencyPath(relativePath));
  }

  getAbsoluteDependencyPath(relativePath: string) {
    const absolutePath = this._relativeDependencyPaths[relativePath];
    if (absolutePath == null) {
      console.error(`Absolute path on bundle entry does not exist for ${relativePath}.`);
    }
    return absolutePath;
  }

  serialize() {
    return {
      _id: this._id,
      type: this._type,
      content: this._content,
      filePath: this.filePath,
      updatedAt: this._updatedAt,
      absoluteDependencyPaths: this.absoluteDependencyPaths,
      relativeDependencyPaths: this.relativeDependencyPaths,
    };
  }

  setPropertiesFromSource({ _id, filePath, type, updatedAt, content, absoluteDependencyPaths, relativeDependencyPaths }: IBundleData) {
    this._id        = _id;
    this._type      = type;
    this._filePath  = filePath;
    this._updatedAt = updatedAt;
    this._content   = content;
    this._absoluteDependencyPaths = absoluteDependencyPaths || [];
    this._relativeDependencyPaths = relativeDependencyPaths || {};
  }

  async load() {
    if (!isMaster) console.log("worker load bundle %s", this.filePath);
    const transformResult: IBundleLoaderResult = await this.loadTransformedContent();
    this._content         = transformResult.content;
    this._ast             = transformResult.ast;
    this._type            = transformResult.type;

    if (!this._fileCacheItem) {
      this._fileCacheItem   = await this._fileCache.item(this.filePath);
      this._fileCacheItem.observe(this._fileCacheItemObserver);
    }

    for (const dependencyBundle of this.dependencies) {
      dependencyBundle.unobserve(this._dependencyObserver);
    }

    this._relativeDependencyPaths = {};
    this._absoluteDependencyPaths = [];
    const dependencyPaths = transformResult.dependencyPaths;

    await Promise.all(dependencyPaths.map(async (dependencyPath) => {
      const resolvedPath = await this.resolveDependencyPath(dependencyPath);
      this._relativeDependencyPaths[dependencyPath] = resolvedPath;
      if (!resolvedPath) return;
      this._absoluteDependencyPaths.push(resolvedPath);
      const dependencyBundle = await this._bundler.bundle(resolvedPath);
      dependencyBundle.observe(this._dependencyObserver);
    }));

    await this.save();

    this._ready = true;
    this.notifyBundleReady();

    return this;
  }

  private async loadTransformedContent() {
    const dependencyPaths: string[] = [];

    let current: IBundleLoaderResult = {
      type: MimeTypeDependency.lookup(this.filePath, this._dependencies),
      content: this._sourceContent = await (await this._fileCache.item(this.filePath)).read()
    };

    return loadBundle(this, current, this._dependencies);
  }

  test() {

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
    // emitted by dependent bundles.
    if (this._readyLock || !this._ready) return;
    this._readyLock = true;
    setTimeout(() => this._readyLock = false, 0);
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
        console.error(`Cannot find dependency file ${dependencyPath} for ${this.filePath}.`);
      }
    }
  }

  private onFileCacheItemAction(action: Action) {
    if (action.type === ActiveRecordAction.ACTIVE_RECORD_DESERIALIZED) {
      this.load();
    }
  }
}

class FileCacheBundleSynchronizer {

}

/**
 * Recursively scans for entry dependencies and bundles them up into one encapsulated
 * package.
 */

// TODO - chance to bundler
export class Bundler extends Observable {

  readonly collection: ActiveRecordCollection<Bundle, IBundleData>;

  constructor(@inject(DependenciesDependency.NS) private _dependencies: Dependencies) {
    super();
    this.collection = ActiveRecordCollection.create(this.collectionName, _dependencies, (source: IBundleData) => {
      return new Bundle(source, this.collectionName, _dependencies);
    });
    this.collection.sync();
  }

  get collectionName() {
    return "bundleItems";
  }

  findByFilePath(filePath) {
    return this.collection.find((entity) => entity.filePath === filePath);
  }

  async bundle(entryFilePath: string): Promise<Bundle> {
    const bundle = this.findByFilePath(entryFilePath);
    if (bundle) return bundle.whenReady();
    return (await this.collection.create({
      filePath: entryFilePath
    }).insert()).load();
  }
}