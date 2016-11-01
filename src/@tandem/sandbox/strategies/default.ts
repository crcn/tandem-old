import { IFileResolver } from "@tandem/sandbox/resolver";
import { FileResolverProvider, DependencyLoaderFactoryProvider } from "@tandem/sandbox/providers";

import {
  DependencyGraph,
  IDependencyLoader,
  IDependencyContent,
  IDependencyGraphStrategy,
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
} from "../dependency-graph";

import {
  inject,
  Injector,
  InjectorProvider,
  MimeTypeAliasProvider,
} from "@tandem/common";


export class DefaultBundleLoader implements IDependencyLoader {
  @inject(InjectorProvider.ID)
  private _injector: Injector;

  constructor(readonly stragegy: DefaultBundleStragegy, readonly options: any) { }

  async load(filePath: string, content: IDependencyContent): Promise<IDependencyLoaderResult> {
    const dependencyPaths: string[] = [];

    let current: IDependencyLoaderResult = Object.assign({}, content);

    let dependency: DependencyLoaderFactoryProvider;

    // Some loaders may return the same mime type (such as html-loader, and css-loader which simply return an AST node).
    // This ensures that they don't get re-used.
    const used = {};

    while(current.type && (dependency = DependencyLoaderFactoryProvider.find(MimeTypeAliasProvider.lookup(current.type, this._injector), this._injector)) && !used[dependency.id]) {
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

export class DefaultBundleStragegy implements IDependencyGraphStrategy {

  @inject(FileResolverProvider.ID)
  private _resolver: IFileResolver;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  getLoader(loaderOptions: any): IDependencyLoader {
    return this._injector.inject(new DefaultBundleLoader(this, loaderOptions));
  }

  async resolve(relativeFilePath, cwd: string): Promise<IResolvedDependencyInfo> {
    return {
      filePath: await this._resolver.resolve(relativeFilePath, cwd)
    };
  }
}