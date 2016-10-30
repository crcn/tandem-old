import { IFileResolver } from "@tandem/sandbox/resolver";
import { FileResolverProvider, BundlerLoaderFactoryProvider } from "@tandem/sandbox/providers";
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
  Dependencies,
  DependenciesProvider,
  MimeTypeAliasProvider,
} from "@tandem/common";


export class DefaultBundleLoader implements IBundleLoader {
  @inject(DependenciesProvider.ID)
  private _dependencies: Dependencies;

  constructor(readonly stragegy: DefaultBundleStragegy, readonly options: any) { }

  async load(filePath: string, content: IBundleContent): Promise<IBundleLoaderResult> {
    const dependencyPaths: string[] = [];

    let current: IBundleLoaderResult = Object.assign({}, content);

    let dependency: BundlerLoaderFactoryProvider;

    // Some loaders may return the same mime type (such as html-loader, and css-loader which simply return an AST node).
    // This ensures that they don't get re-used.
    const used = {};

    while(current.type && (dependency = BundlerLoaderFactoryProvider.find(MimeTypeAliasProvider.lookup(current.type, this._dependencies), this._dependencies)) && !used[dependency.id]) {
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

  @inject(FileResolverProvider.ID)
  private _resolver: IFileResolver;

  @inject(DependenciesProvider.ID)
  private _dependencies: Dependencies;

  getLoader(loaderOptions: any): IBundleLoader {
    return this._dependencies.inject(new DefaultBundleLoader(this, loaderOptions));
  }

  async resolve(relativeFilePath, cwd: string): Promise<IBundleResolveResult> {
    return {
      filePath: await this._resolver.resolve(relativeFilePath, cwd)
    };
  }
}