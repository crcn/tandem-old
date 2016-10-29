import { IFileResolver } from "@tandem/sandbox/resolver";
import { FileResolverDependency, BundlerLoaderFactoryDependency } from "@tandem/sandbox/dependencies";
import {
  Bundler,
  IBundleLoader,
  IBundleContent,
  IBundleStragegy,
  IBundleLoaderResult,
  IBundleResolveResult,
} from "../bundle";
import {
  inject,
  Injector,
  Dependencies,
  DependenciesDependency,
  MimeTypeAliasDependency,
} from "@tandem/common";

export class DefaultBundleLoader implements IBundleLoader {
  @inject(DependenciesDependency.ID)
  private _dependencies: Dependencies;

  constructor(readonly stragegy: DefaultBundleStragegy, readonly options: any) {

  }

  async load(filePath: string, content: IBundleContent): Promise<IBundleLoaderResult> {
    const dependencyPaths: string[] = [];

    let current: IBundleLoaderResult = Object.assign({}, content);

    let dependency: BundlerLoaderFactoryDependency;

    // Some loaders may return the same mime type (such as html-loader, and css-loader which simply return an AST node).
    // This ensures that they don't get re-used.
    const used = {};

    while(current.type && (dependency = BundlerLoaderFactoryDependency.find(MimeTypeAliasDependency.lookup(current.type, this._dependencies), this._dependencies)) && !used[dependency.id]) {
      used[dependency.id] = true;
      current = await dependency.create(this.stragegy).load(filePath, current);
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
}

export class DefaultBundleStragegy implements IBundleStragegy {

  @inject(FileResolverDependency.ID)
  private _resolver: IFileResolver;

  @inject(DependenciesDependency.ID)
  private _dependencies: Dependencies;

  getLoader(loaderOptions: any): IBundleLoader {
    return Injector.inject(new DefaultBundleLoader(this, loaderOptions), this._dependencies);
  }

  async resolve(relativeFilePath, cwd: string): Promise<IBundleResolveResult> {
    return {
      filePath: await this._resolver.resolve(relativeFilePath, cwd)
    };
  }
}