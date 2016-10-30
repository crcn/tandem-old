// TODO - this is deprecated. Move to strategies/default

import { IFileSystem } from "./file-system";
import { IFileResolver } from "./resolver";
import { ResolveFileAction } from "./actions";
import {
  IActor,
  inject,
  Injector,
  SingletonThenable,
  MimeTypeProvider,
  PrivateBusProvider,
  InjectorProvider,
} from "@tandem/common";
import * as resolve from "resolve";
import * as pkgpath from "package-path";

export interface IFileResolverOptions {
  extensions: string[];
  directories: string[];
}

export interface IFileResolver {
  resolve(filePath: string, cwd?: string, options?: IFileResolverOptions): Promise<string>;
}

const createFileResolverOptions = (extensions?: string[], directories?: string[]): IFileResolverOptions => {
  return {
    extensions: extensions || [],
    directories: directories || []
  }
}

const combineResoverOptions = (...options: IFileResolverOptions[]): IFileResolverOptions => {
  return options.reduce((a, b) => {
    if (!a) a = createFileResolverOptions();
    if (!b) b = createFileResolverOptions();
    return {
      extensions: a.extensions.concat(b.extensions),
      directories: a.directories.concat(b.directories)
    };
  });
}

export abstract class BaseFileResolver implements IFileResolver {
  private _cache: any;
  public options: IFileResolverOptions;

  constructor() {
    this._cache = {};
    this.options = createFileResolverOptions();
  }

  async resolve(relativePath: string, cwd?: string, options?: IFileResolverOptions): Promise<string> {
    return this._cache[cwd + relativePath] || (this._cache[cwd + relativePath] = new SingletonThenable(() => {
      return this.resolve2(relativePath, cwd, combineResoverOptions(this.options, options));
    }));
  }

  protected abstract async resolve2(filePath: string, cwd?: string, options?: IFileResolverOptions): Promise<string>;
}

export class RemoteFileResolver extends BaseFileResolver {
  constructor(@inject(PrivateBusProvider.ID) private _bus: IActor) {
    super();
  }
  async resolve2(filePath: string, cwd?: string, options?: IFileResolverOptions): Promise<string> {
    return (await this._bus.execute(new ResolveFileAction(filePath, cwd, options)).read()).value;
  }
}

export class LocalFileResolver extends BaseFileResolver {

  @inject(InjectorProvider.ID)
  private _dependencies: Injector;

  async resolve2(relativePath: string, cwd?: string, options?: IFileResolverOptions): Promise<string> {

    const { extensions, directories } = combineResoverOptions(options, {
      extensions: [], // temp
      directories: []
    });

    if (cwd) {
      const pkgPath = pkgpath.sync(cwd);


      const pkg = pkgPath && require(pkgPath + "/package.json");

      // check browser flag in package.json

      if (!/^(\.|\/)/.test(relativePath)) {
        cwd = pkgPath;
      }

      if (pkg && pkg.browser && pkg.browser[relativePath] != null) {
        relativePath = pkg.browser[relativePath];
      }

      directories.push(cwd + "/node_modules");

      if (<boolean><any>relativePath === false) return Promise.resolve(undefined);
    } else {
      cwd = process.cwd();
    }


    return resolve.sync(relativePath, {
      basedir: cwd,
      extensions: extensions,
      paths: directories,

      // moduleDirectory is required, but it foos with
      // dependency resolution. Solution: give a directory that doesn't have anything
      moduleDirectory: "/i/should/not/exist",

      packageFilter: (pkg, filePath) => {
        const main = pkg.browser ? pkg.browser[pkg.main] || pkg.browser : pkg.main;
        return {
          main: main
        }
      }
    });
  }
}