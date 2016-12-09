import md5 =  require("md5");
import path =  require("path");
import { IModule } from "@tandem/sandbox/sandbox";
import { IFileResolver } from "@tandem/sandbox/resolver";
import { IDependencyContent } from "../../base";
import { FileResolverProvider } from "@tandem/sandbox/providers";
import { DependencyLoaderFactoryProvider } from "@tandem/sandbox/dependency-graph/providers";

import {
  IDependencyLoader,
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
  IDependencyGraphStrategy,
} from "../base";

import {
  inject,
  Injector,
  InjectorProvider,
  MimeTypeAliasProvider,
} from "@tandem/common";

export type dependencyLoaderType = { new(strategy: IDependencyGraphStrategy): IDependencyLoader };

export abstract class BaseDependencyLoader implements IDependencyLoader {
  constructor(readonly strategy: IDependencyGraphStrategy) { }
  abstract load(info: IResolvedDependencyInfo, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}

export class DefaultDependencyLoader implements IDependencyLoader {
  @inject(InjectorProvider.ID)
  private _injector: Injector;

  constructor(readonly stragegy: DefaultDependencyGraphStrategy, readonly options: any) { }

  async load(info: IResolvedDependencyInfo, content: IDependencyContent): Promise<IDependencyLoaderResult> {
    const importedDependencyUris: string[] = [];

    let current: IDependencyLoaderResult = Object.assign({}, content);

    let dependency: DependencyLoaderFactoryProvider;

    // Some loaders may return the same mime type (such as html-loader, and css-loader which simply return an AST node).
    // This ensures that they don't get re-used.
    const used = {};

    while(current.type && (dependency = DependencyLoaderFactoryProvider.find(MimeTypeAliasProvider.lookup(current.type, this._injector), this._injector)) && !used[dependency.id]) {
      used[dependency.id] = true;
      current = await dependency.create(this.stragegy).load(info, current);
      if (current.importedDependencyUris) {
        importedDependencyUris.push(...current.importedDependencyUris);
      }
    }

    return {
      map: current.map,
      type: current.type,
      content: current.content,
      importedDependencyUris: importedDependencyUris
    };
  }
}

export class DefaultDependencyGraphStrategy implements IDependencyGraphStrategy {

  @inject(FileResolverProvider.ID)
  private _resolver: IFileResolver;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  getLoader(loaderOptions: any): IDependencyLoader {
    return this._injector.inject(new DefaultDependencyLoader(this, loaderOptions));
  }

  createGlobalContext() {
    return { };
  }

  createModuleContext(module: IModule) {
    return {
      module: module,
      exports: module.exports,
      __filename: module.source.uri,
      __dirname: path.dirname(module.source.uri)
    }
  }

  async resolve(fileUri: string, cwd: string): Promise<IResolvedDependencyInfo> {
    const uri = await this._resolver.resolve(fileUri, cwd); 
    return {
      uri: uri,
      hash: md5(uri)
    };
  }
}