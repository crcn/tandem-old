import * as path from "path";
import { IFileSystem } from "./file-system";
import { IFileResolver, IFileResolverOptions } from "./resolver";
import { Dependencies, Dependency, Observable, MimeTypeDependency, BaseActiveRecord } from "@tandem/common";
import {
  FileSystemDependency,
  FileResolverDependency,
  BundlerLoaderFactoryDependency,
  BundleTransformerFactoryDependency,
} from "./dependencies";

interface IBundleFile {
  readonly filePath: string;
  readonly content: string;
}

export interface IBundleLoaderResult {

  /**
   * Dependencies that also need to be loaded in
   */

  dependencyPaths?: string[];

  /**
   * TODO
   */

  // toCommonJSDependencyString(): string;
}

export interface IBundleTransformResult {
  mimeType: string;
  content: any;
}

export interface IBundleLoader {
  load(content: string): Promise<IBundleLoaderResult>;
}


export interface IBundleTransformer {
  transform(content: string): Promise<IBundleTransformResult>;
}

export type bundleLoaderType = { new(): IBundleLoader };
export type bundleTransformerType = { new(): IBundleTransformer };

// TODO - needs to store compiled data here
class BundleDependency extends Dependency<IBundleFile> {
  static NS = "bundle";
  constructor(file: IBundleFile, readonly dependencies: IBundleFile[]) {
    super(BundleDependency.NS, file);
  }
  static getNamespace(filePath: string) {
    return [this.NS, filePath].join("/");
  }
  static findFile(filePath: string, dependencies: Dependencies): IBundleFile {
    return this.find(filePath, dependencies).value;
  }
  static find(filePath: string, dependencies: Dependencies) {
    return dependencies.query<BundleDependency>(this.getNamespace(filePath));
  }
}

export interface IBundleItemContentData {
  readonly type: string;
  readonly value: string;
}

export interface IBundleItemContent {
  readonly type: string;
  readonly data: any;
  serialize(): IBundleItemContentData;
  deserialize(source: IBundleItemContentData);
}

export interface IBundleItemData {
  fileName: string;
  content: IBundleItemContentData;
  dependencyPaths: string[];
}

/**
 */

export class BundleEntry extends BaseActiveRecord<IBundleItemData> {

  private _fileName: string;
  private _dependencyPaths: string[];
  private _content: IBundleItemContent;

  constructor(source: IBundleItemData, collectionName: string) {
    super(source, collectionName, null);
  }

  get fileName() {
    return this._fileName;
  }

  get dependencyPaths() {
    return this._dependencyPaths;
  }

  get content(): IBundleItemContent {
    return this._content;
  }

  serialize() {
    return {
      fileName: this.fileName,
      dependencyPaths: this.dependencyPaths,
      content: this.content.serialize()
    };
  }

  deserialize(source: IBundleItemData) {
    this._fileName = source.fileName;
    this._dependencyPaths = source.dependencyPaths;
    // this._content = // BundleItemContentFactoryDependency.create(source.content)
  }

  async load() {

  }

  async bundle() {

  }
}

/**
 * Recursively scans for entry dependencies and bundles them up into one encapsulated
 * package.
 */

// TODO - chance to bundler
export class Bundle extends Observable {

  private _fileSystem: IFileSystem;
  private _fileResolver: IFileResolver;
  private _loading: boolean;

  constructor(private _entryFilePath: string, private _dependencies: Dependencies, public resolveOptions?: IFileResolverOptions) {
    super();
    this._fileSystem   = FileSystemDependency.getInstance(this._dependencies);
    this._fileResolver = FileResolverDependency.getInstance(this._dependencies);
    this.load(this._entryFilePath).then(() => {
      console.log("COMPLETE");
    });
  }

  get entryFilePath() {
    return this._entryFilePath;
  }

  private async load(filePath: string) {

    const dep = BundleDependency.find(filePath, this._dependencies);

    const transformResult: IBundleTransformResult = await this.loadTransformed(filePath);
    const loader = BundlerLoaderFactoryDependency.create(transformResult.mimeType, this._dependencies);
    const loadResult: IBundleLoaderResult = await loader.load(transformResult.content);
    const resolvedDependencyPaths = await this.resolveDependencyPaths(loadResult.dependencyPaths || [], filePath);

    for (const resolvedFilePath of resolvedDependencyPaths) {
      this.load(resolvedFilePath);
    }
  }

  private async loadTransformed(filePath: string) {

    let current: IBundleTransformResult = {
      mimeType: MimeTypeDependency.lookup(filePath, this._dependencies),
      content: await this._fileSystem.readFile(filePath)
    };

    let dependency: BundleTransformerFactoryDependency;

    while(dependency = BundleTransformerFactoryDependency.find(current.mimeType, this._dependencies)) {
      console.log(dependency.create(this._dependencies));
      current = await dependency.create(this._dependencies).transform(current.content);
    }

    return current;
  }

  private async resolveDependencyPaths(dependencyPaths?: string[], dependentPath?: string) {
    const cwd = path.dirname(dependentPath);
    const resolvedPaths = [];
    for (const dependencyPath of dependencyPaths) {

      if (/^#/.test(dependencyPath)) {
        continue;
      }

      // check for protocol -- // at the minium
      if (/^(\w+:)?\/\//.test(dependencyPath)) {
        resolvedPaths.push(dependencyPath);
      } else {
        try {
          resolvedPaths.push(await this._fileResolver.resolve(dependencyPath, cwd));
        } catch(e) {
          console.error(`Cannot find dependency file ${dependencyPath} for ${dependentPath}.`);
        }
      }
    }
    return resolvedPaths;
  }
}