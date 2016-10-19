import * as path from "path";
import { FileCache } from "./file-cache";
import { IFileSystem } from "./file-system";
import { BundleAction } from "./actions";
import { IFileResolver, IFileResolverOptions } from "./resolver";
import {
  inject,
  Injector,
  Dependency,
  Observable,
  IObservable,
  Dependencies,
  DEPENDENCIES_NS,
  BaseActiveRecord,
  MainBusDependency,
  MimeTypeDependency,
  ActiveRecordCollection,
} from "@tandem/common";
import {
  BundlerDependency,
  FileSystemDependency,
  FileCacheDependency,
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
  readonly value: any;
}


export interface IBundleLoaderResult extends IBundleContent {
  dependencyPaths?: string[];
}

export interface IBundleData {
  filePath: string;
  content?: IBundleContent;
  absoluteDependencyPaths?: string[];
  relativeDependencyPaths?: Object;
}

/**
 */

// TODO - fetch file cache item
// TODO - get bundle editor
export class Bundle extends BaseActiveRecord<IBundleData> {

  readonly idProperty = "filePath";

  private _filePath: string;
  private _ready: boolean;
  private _absoluteDependencyPaths: string[];
  private _relativeDependencyPaths: Object;
  private _content: IBundleContent;
  private _fileCache: FileCache;
  private _fileSystem: IFileSystem;
  private _fileResolver: IFileResolver;
  private _bundler: Bundler;

  constructor(source: IBundleData, collectionName: string, private _dependencies: Dependencies) {
    super(source, collectionName, MainBusDependency.getInstance(_dependencies));
    this._fileCache = FileCacheDependency.getInstance(_dependencies);
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
    this._fileResolver = FileResolverDependency.getInstance(_dependencies);
    this._bundler = BundlerDependency.getInstance(_dependencies);
  }

  get ready() {
    return this._ready;
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

  get dependencies(): Bundle[] {
    return this._absoluteDependencyPaths.map((filePath) => this._bundler.collection.findByUid(filePath));
  }

  get content(): IBundleContent {
    return this._content;
  }

  getDependencyByRelativePath(relativePath: string) {
    return this._bundler.collection.findByUid(this.getAbsoluteDependencyPath(relativePath));
  }

  getAbsoluteDependencyPath(relativePath: string) {
    return this._relativeDependencyPaths[relativePath];
  }

  serialize() {
    return {
      filePath: this.filePath,
      absoluteDependencyPaths: this.absoluteDependencyPaths,
      relativeDependencyPaths: this.relativeDependencyPaths,

      // TODO SerializerDependency.serialize(this.content.type, )
      content: null
    };
  }

  deserialize(source: IBundleData) {
    this._filePath = source.filePath;
  }

  async load() {
    console.log("load bundle %s", this.filePath);
    const transformResult: IBundleLoaderResult = await this.loadTransformedContent();
    this._content         = transformResult;
    this._relativeDependencyPaths = {};
    this._absoluteDependencyPaths = [];
    const dependencyPaths = transformResult.dependencyPaths;
    for (const dependencyPath of dependencyPaths) {
      const resolvedPath = await this.resolveDependencyPath(dependencyPath);
      this._relativeDependencyPaths[dependencyPath] = resolvedPath;
      if (!resolvedPath) continue;
      this._absoluteDependencyPaths.push(resolvedPath);
      await this._bundler.bundle(resolvedPath);
    }
    this._ready = true;
    this.notify(new BundleAction(BundleAction.BUNDLE_READY));
    return await this.save();
  }

  private async loadTransformedContent() {
    const dependencyPaths: string[] = [];

    let current: IBundleLoaderResult = {
      type: MimeTypeDependency.lookup(this.filePath, this._dependencies),
      value: await this._fileSystem.readFile(this.filePath)
    };

    let dependency: BundlerLoaderFactoryDependency;

    while(dependency = BundlerLoaderFactoryDependency.find(current.type, this._dependencies)) {
      current = await dependency.create(this._dependencies).load(this, current);
      if (current.dependencyPaths) {
        dependencyPaths.push(...current.dependencyPaths);
      }
    }

    return {
      type: current.type,
      value: current.value,
      dependencyPaths: dependencyPaths
    };
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

  constructor(@inject(DEPENDENCIES_NS) private _dependencies: Dependencies) {
    super();
    this.collection = ActiveRecordCollection.create(this.collectionName, _dependencies, (source: IBundleData) => {
      return new Bundle(source, this.collectionName, _dependencies);
    });
  }

  get collectionName() {
    return "bundleItems";
  }

  async bundle(entryFilePath: string): Promise<Bundle> {
    return this.collection.findByUid(entryFilePath) || await this.collection.create({
      filePath: entryFilePath
    }).load();
  }
}