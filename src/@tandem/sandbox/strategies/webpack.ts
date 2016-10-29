// A bit of a cluster fuck this is. Needs cleaning after many of mysteries
// around webpack are resolved.

import {
  inject,
  Logger,
  loggable,
  Injector,
  Dependencies,
  JS_MIME_TYPE,
  DependenciesDependency,
} from "@tandem/common";

// TODO - handle __webpack_public_path__

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

export interface INormalizedWebpackLoaderConfig {
  modulePath: string;
  query: string;
}

export interface IWebpackLoaderOptions {
  disablePreloaders?: boolean;
  disableAllLoaders?: boolean;
  loaders: INormalizedWebpackLoaderConfig[]
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
  private _module: WebpackLoaderContextModule;
  readonly loaderIndex: number;
  readonly options: any;
  private _compiler: MockWebpackCompiler;
  readonly query: string;

  constructor(
    readonly loaders: INormalizedWebpackLoaderConfig[],
    readonly loader: INormalizedWebpackLoaderConfig,
    readonly strategy: WebpackBundleStrategy,
    readonly resourcePath: string,
    private _dependencies: string[]
  ) {

    this._compiler = strategy.compiler;

    this.query = loader.query;
    this.options = Object.assign({ context: "" }, strategy.config);
    this.loaderIndex = this.loaders.indexOf(loader);
    this._module = new WebpackLoaderContextModule();
  }

  get dependencyPaths(): string[] {
    return this._dependencies;
  }

  private get module() {
    return require(this.loader.modulePath);
  }

  async load(content): Promise<{ content: string, map: any }> {
    return new Promise<any>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      const result = this.module.call(this, content);
      if (!this._async) {
        return resolve(result && { content: result });
      }
    })
  }

  pitch() {
    const module = this.module;
    if (!module.pitch) return;

    const remainingRequests = this.loaders.slice(this.loaderIndex + 1).map((loader) => {
      return loader.modulePath + (loader.query || "")
    });

    remainingRequests.push(this.resourcePath);
    const result = module.pitch(remainingRequests.join("!"));
    if (result == null) return;

    return { content: result, map: undefined }
  }

  emitFile(fileName: string, content: string) {
    throw new Error(`emit file is not supported yet`);
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

  dependency(filePath) {
    return this.addDependency(filePath);
  }

  resolve(cwd: string, relativePath: string, callback: (err, result?) => any) {
    this.strategy.resolve(relativePath, cwd).then((info) => {
      callback(null, info.filePath);
    }).catch(callback);
  }
}

@loggable()
class WebpackBundleLoader implements IBundleLoader {
  protected readonly logger: Logger;
  constructor(readonly strategy: WebpackBundleStrategy, readonly options: IWebpackLoaderOptions) { }
  async load(filePath: string, { type, content, map }: IBundleContent): Promise<IBundleLoaderResult> {
    this.logger.verbose("loading %s", filePath);

    const { config } = this.strategy;

    // find the matching loaders
    const usableConfigLoaders = [];

    if (!this.options.disableAllLoaders) {
      if (!this.options.disablePreloaders) usableConfigLoaders.push(...(config.module.preLoaders || []));
      usableConfigLoaders.push(...config.module.loaders, ...(config.module.postLoaders || []));
    }

    const moduleLoaders = [
      ...normalizeConfigLoaders(...usableConfigLoaders.filter(testLoader.bind(this, filePath))),
      ...(this.options.loaders || [])
    ]

    const dependencyPaths = [];

    const contexts = moduleLoaders.map((loader) => {
      return new WebpackLoaderContext(
        moduleLoaders,
        loader,
        this.strategy,
        filePath,
        dependencyPaths
      );
    });

    const loadNext = async (content: string, map: any, index: number = 0): Promise<{ map: any, content: string }> => {
      if (index >= contexts.length) return { content, map };
      const context = contexts[index];
      const result = (await context.pitch() || await loadNext(content, map, index + 1));
      return await context.load(result.content) || result;
    }

    const result = await loadNext(content, map, 0);

    this.logger.verbose("loaded %s", filePath);

    return {
      type: JS_MIME_TYPE,
      content: result.content,
      map: result.map,
      dependencyPaths: findCommonJSDependencyPaths(result.content).concat(dependencyPaths)
    };
  }
}

/**
 */

function normalizeConfigLoaders(...loaders: IWebpackLoaderConfig[]) {
  const normalizedLoaders = [];
  for (const loader of loaders) {
    normalizedLoaders.push(...parserLoaderOptions(loader.loader).loaders);
  }
  return normalizedLoaders;
}

/**
 */

function parserLoaderOptions(moduleInfo: string, hasFile: boolean = false): IWebpackLoaderOptions {

  const loaderParts = moduleInfo.replace(/^(-|!)?!/,"").split("!");
  if (hasFile) loaderParts.pop();

  const options: IWebpackLoaderOptions = {
    disablePreloaders: /^-?!/.test(moduleInfo),
    disableAllLoaders: /^(-|!)!/.test(moduleInfo), // !!raw!filePath
    loaders: loaderParts.map((loaderName) => {
      const [moduleName, query] = loaderName.split("?");
      return {
        modulePath: require.resolve(moduleName),
        query: query && "?" + query
      }
    })
  };

  return options;
}

function combineLoaders(...options: IWebpackLoaderOptions[]) {
  let combinedOptions: IWebpackLoaderOptions = {
    disablePreloaders: false,
    disableAllLoaders: false,
    loaders: []
  };
  for (const ops of options) {
    combinedOptions.disableAllLoaders = combinedOptions.disableAllLoaders || ops.disableAllLoaders;
    combinedOptions.disablePreloaders = combinedOptions.disablePreloaders || ops.disablePreloaders;
    combinedOptions.loaders.push(...ops.loaders);
  }
  return combinedOptions;
}

function findCommonJSDependencyPaths(source) {
  return (
    source.replace(/\/\*[\s\S]+\*\//g, "")
    .replace(/\/\/.*?/g, "")
    .match(/require\(["'].*?["']\)/g) || []
  ).map((expression) => {
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

  async resolve(moduleInfo: string, cwd: string): Promise<IBundleResolveResult> {

    let loaderOptions = parserLoaderOptions(moduleInfo, true);
    let relativeFilePath = moduleInfo.split("!").pop();

    const { config } = this;

    this.logger.verbose("resolving %s:%s", cwd, moduleInfo);

    relativeFilePath = config.resolve.alias && config.resolve.alias[relativeFilePath] || relativeFilePath;

    const resolvedFilePath = await this._resolver.resolve(relativeFilePath, cwd, {
      extensions: this.config.resolve.extensions,
      directories: [...this.config.resolve.modulesDirectories, config.resolve.root, this.basedir]
    });

    return {
      filePath: resolvedFilePath,
      loaderOptions: loaderOptions
    }
  }
}

