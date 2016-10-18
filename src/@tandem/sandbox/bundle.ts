import * as path from "path";
import { IFileSystem } from "./file-system";
import { IFileResolver } from "./resolver";
import { Dependencies, Dependency, Observable, MimeTypeDependency } from "@tandem/common";
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

/**
 * Recursively scans for entry dependencies and bundles them up into one encapsulated
 * package.
 */

export class Bundle extends Observable {

  private _fileSystem: IFileSystem;
  private _fileResolver: IFileResolver;
  private _loading: boolean;

  constructor(private _entryFilePath: string, private _dependencies: Dependencies) {
    super();
    this._fileSystem   = FileSystemDependency.getInstance(this._dependencies);
    this._fileResolver = FileResolverDependency.getInstance(this._dependencies);
    this.load(this._entryFilePath);
  }

  get entryFilePath() {
    return this._entryFilePath;
  }

  private async load(filePath: string) {
    const transformResult: IBundleTransformResult = await this.loadTransformed(filePath);
    const loader = BundlerLoaderFactoryDependency.create(transformResult.mimeType, this._dependencies);
    const loadResult: IBundleLoaderResult = await loader.load(transformResult.content);
    const resolvedDependencyPaths = await this.resolveDependencyPaths(loadResult.dependencyPaths || [], path.dirname(filePath));

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

  private async resolveDependencyPaths(dependencyPaths?: string[], cwd?: string) {
    const resolvedPaths = [];
    for (const dependencyPath of dependencyPaths) {
      resolvedPaths.push(await this._fileResolver.resolve(dependencyPath, cwd));
    }
    return resolvedPaths;
  }
}