import {
  inject,
  Logger,
  loggable,
  Injector,
  Dependencies,
  JS_MIME_TYPE,
  DependenciesDependency,
} from "@tandem/common";

import {
  IBundleContent,
  IBundleLoaderResult,
  IBundleResolveResult,
  IBundleStragegy,
  IBundleLoader
} from "../bundle";

import { IFileResolver } from "../resolver";
import { FileResolverDependency } from "../dependencies";

import * as path from "path";
import * as sift from "sift";
import * as resolve from "resolve";

// https://webpack.github.io/docs/configuration.html
// internal APIs

export interface IWebpackLoaderConfig {

  // file name test
  test: RegExp|((filePath:string) => boolean);

  // whitelist
  include: string[];

  // blacklist
  exclude: string[];

  // bundle loader
  loader?: string;
  loaders?: IWebpackLoaderConfig[];
}

export interface IWebpackLoaderOptions {
  disablePreloaders?: boolean;
  disableLoaders?: boolean;
  loaders: [{
    name: string,
    query: Map<string, any>
  }]
}

export interface IWebpackResolveAliasConfig {
  [Idenfifier: string]: string;
}

export interface IWebpackResolveConfig {
  root?: string;
  alias?: IWebpackResolveAliasConfig;
  extensions?: string[];
  modulesDirectories: string[];
}

export interface IWebpackConfig {
  entry?: any;
  output?: any;
  resolve: IWebpackResolveConfig;
  module: {
    preLoaders?: IWebpackLoaderConfig[];
    loaders: IWebpackLoaderConfig[]
    postLoaders?: IWebpackLoaderConfig[];
  }
}

function testLoader(filePath: string, loader: IWebpackLoaderConfig) {
  if (!(typeof loader.test === "function" ? loader.test(filePath) : (<RegExp>loader.test).test(filePath))) return false;
  // more here
  return true;
}

export class MockWebpackCompiler {
  plugin(key: string, callback) {

  }
}

class WebpackLoaderContextModule {
  readonly meta: any = {};
  readonly errors: any[] = [];
}

class WebpackLoaderContext {

  private _async: boolean;
  private _resolve: Function;
  private _reject: Function;
  private _dependencies: string[];
  private _module: WebpackLoaderContextModule;
  readonly loaderIndex: number;

  constructor(
    readonly loaders: IWebpackLoaderConfig[],
    readonly loader: IWebpackLoaderConfig,
    readonly resourcePath: string,
    readonly options: IWebpackConfig,
    readonly _compiler: MockWebpackCompiler,
    readonly query: any = {}
  ) {
    this.loaderIndex = this.loaders.indexOf(this.loader);
    this._dependencies = [];
    this._module = new WebpackLoaderContextModule();
  }

  get dependencyPaths(): string[] {
    return this._dependencies;
  }

  async load(content): Promise<{ content: string, map: any }> {
    return new Promise<any>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      const module = require(this.loader.loader);
      const result = module.call(this, content);
      if (!this._async) return resolve(result);
    })
  }

  async() {
    this._async = true;
    return (err, content, map) => {
      if (err) return this._reject(err);
      this._resolve({ content, map });
    }
  }

  cacheable() {

  }

  clearDependencies() {
    this._dependencies = [];
  }

  addDependency(filePath) {
    this._dependencies.push(filePath);
  }
}

@loggable()
class WebpackBundleLoader implements IBundleLoader {
  protected readonly logger: Logger;
  constructor(readonly strategy: WebpackBundleStrategy, readonly options: IWebpackLoaderOptions) { }
  async load(filePath: string, { type, content }: IBundleContent): Promise<IBundleLoaderResult> {
    this.logger.verbose("loading %s", filePath);
    const { config } = this.strategy;

    // find the matching loaders
    const loaders = [
      ...(config.module.preLoaders || []),
      ...config.module.loaders,
      ...(config.module.postLoaders || [])
    ].filter(testLoader.bind(this, filePath));

    const dependencyPaths = [];

    let map;

    for (const loader of loaders) {
      const context = new WebpackLoaderContext(loaders, loader, filePath, this.strategy.config, this.strategy.compiler);
      const result = await context.load(content);
      map = result.map;
      content = result.content;
      dependencyPaths.push(...context.dependencyPaths);
    }

    this.logger.verbose("loaded %s", filePath);

    return {
      type: JS_MIME_TYPE,
      content: content,
      dependencyPaths: findCommonJSDependencyPaths(content)
    };
  }
}

function findCommonJSDependencyPaths(source) {
  return (source.replace(/\/\*[\s\S]+\*\//g, "").replace(/\/\/.*?/g, "").match(/require\(["'].*?["']\)/g) || []).map((expression) => {
    return expression.match(/require\(['"](.*?)["']\)/)[1];
  });
}

/**
 */

@loggable()
export class WebpackBundleStrategy implements IBundleStragegy {

  protected readonly logger: Logger;

  @inject(DependenciesDependency.ID)
  private _dependencies: Dependencies;

  @inject(FileResolverDependency.ID)
  private _resolver: IFileResolver;

  readonly config: IWebpackConfig;
  readonly compiler: MockWebpackCompiler;
  readonly basedir: string;

  constructor(config: string|IWebpackConfig) {

    if (typeof config === "string") {
      this.basedir = path.dirname(config);
      this.config = require(config);
    } else {
      this.basedir = process.cwd();
      this.config = config;
    }

    this.compiler = new MockWebpackCompiler();
  }

  /**
   * Results the relative file path from the cwd, and provides
   * information about how it should be treared.
   *
   * Examples:
   * const bundleInfo = resolver.resolve('text!./module.mu');
   * const bundleInfo = resolver.resolve('template!./module.mu');
   */

  getLoader(options: IWebpackLoaderOptions): IBundleLoader {
    return Injector.inject(new WebpackBundleLoader(this, options), this._dependencies);
  }

  async resolve(relativeFilePath: string, cwd: string): Promise<IBundleResolveResult> {

    const { config } = this;

    this.logger.verbose("resolving %s:%s", cwd, relativeFilePath);

    relativeFilePath = config.resolve.alias && config.resolve.alias[relativeFilePath] || relativeFilePath;

    const resolvedFilePath = await this._resolver.resolve(relativeFilePath, cwd, {
      extensions: this.config.resolve.extensions,
      directories: [...this.config.resolve.modulesDirectories, config.resolve.root, this.basedir]
    });

    return {
      filePath: resolvedFilePath,
      loaderOptions: []
    }
  }
}

