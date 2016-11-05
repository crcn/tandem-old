// A bit of a cluster fuck this is. Needs cleaning after many of mysteries
// around webpack are resolved.
import {
  inject,
  Logger,
  loggable,
  Injector,
  JS_MIME_TYPE,
  InjectorProvider,
} from "@tandem/common";

import * as md5 from "md5";
import * as nodeLibs from "node-libs-browser";
import * as detective from "detective";

// TODO - handle __webpack_public_path__
import { RawSourceMap } from "source-map";
import { IDependencyContent } from "../../base";

import {
  IDependencyLoader,
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
  IDependencyGraphStrategy,
} from "../base";

import { IModule } from "@tandem/sandbox/sandbox";
import { Dependency } from "@tandem/sandbox/dependency-graph/dependency";
import { IFileResolver } from "@tandem/sandbox/resolver";
import { FileResolverProvider } from "@tandem/sandbox/providers";

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

  // dependency loader
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

export interface IWebpackNodeConfig {
  __filename: boolean;
  fs: string;
}

export interface IWebpackConfig {
  entry?: any;
  context: string;
  output?: any;
  node: IWebpackNodeConfig,
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
  plugin(key: string, callback) { }
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
    readonly strategy: WebpackDependencyGraphStrategy,
    readonly resourcePath: string,
    readonly id: string,
    private _dependencies: string[]
  ) {

    this._compiler = strategy.compiler;

    this.query = loader.query;
    this.options = Object.assign({ context: "" }, strategy.config);
    this.loaderIndex = this.loaders.indexOf(loader);
    this._module = new WebpackLoaderContextModule();
  }

  get includedDependencyPaths(): string[] {
    return this._dependencies;
  }

  private get module() {
    return require(this.loader.modulePath);
  }

  async load(content, map): Promise<{ content: string, map: any }> {
    return new Promise<any>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      const result = this.module.call(this, content, map);
      if (!this._async) {
        return resolve(result && { content: result });
      }
    })
  }

  capture() {
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
    // throw new Error(`emit file is not supported yet`);
  }


  async() {
    this._async = true;
    return (err, content, map: RawSourceMap) => {
      if (err) return this._reject(err);

      // change sources to absolute path
      if (map) {
        map.sources = map.sources.map(relativePath => {
          return relativePath.charAt(0) !== "/" ? path.join(this.strategy.config.context || process.cwd(), relativePath) : relativePath;
        });
      }

      this._resolve({ content, map });
    }
  }

  cacheable() {

  }

  clearProviders() {
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
class WebpackDependencyLoader implements IDependencyLoader {
  protected readonly logger: Logger;
  constructor(readonly strategy: WebpackDependencyGraphStrategy, readonly options: IWebpackLoaderOptions) { }
  async load({ filePath, hash }: IResolvedDependencyInfo, { type, content, map }: IDependencyContent): Promise<IDependencyLoaderResult> {
    this.logger.verbose("Loading %s", filePath);

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

    const includedDependencyPaths = [];

    const contexts = moduleLoaders.map((loader) => {
      return new WebpackLoaderContext(
        moduleLoaders,
        loader,
        this.strategy,
        filePath,
        hash,
        includedDependencyPaths
      );
    });

    const loadNext = async (content: string, map: any, index: number = 0): Promise<{ map: any, content: string }> => {
      if (index >= contexts.length) return { content, map };
      const context = contexts[index];
      const result = (await context.capture() || await loadNext(content, map, index + 1));
      return await context.load(result.content, result.map) || result;
    }

    const result = await loadNext(content, map, 0);

    this.logger.verbose("loaded %s", filePath);

    const foundProviderPaths = detective(result.content);

    return {
      map: result.map,
      type: JS_MIME_TYPE,
      content: result.content,
      importedDependencyPaths: foundProviderPaths,
      includedDependencyPaths: includedDependencyPaths
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

export class WebpackSandboxContext {
  readonly module: WebpackSandboxContext;
  readonly id: string;
  readonly __filename: string;
  readonly __dirname: string;

  constructor(private _target: IModule) {
    this.module = this;
    this.id = _target.source.hash;

    // TODO - need to check webpack config for this.
    this.__filename = _target.source.filePath;
    this.__dirname = path.dirname(_target.source.filePath);
  }

  get exports() {
    return this._target.exports;
  }

  set exports(value: any) {
    this._target.exports = value;
  }
}

export class WebpackProtocolResolver {
  async resolve(url): Promise<string> {

    // cheap for now. Will need to scan all loaded webpack strategy singletons later
    // on.
    return path.join(process.cwd(), url.replace("webpack://", ""));
  }
}

/**
 */

@loggable()
export class WebpackDependencyGraphStrategy implements IDependencyGraphStrategy {

  protected readonly logger: Logger;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  @inject(FileResolverProvider.ID)
  private _resolver: IFileResolver;

  readonly config: IWebpackConfig;
  readonly compiler: MockWebpackCompiler;
  readonly basedir: string;

  constructor(config: string|IWebpackConfig) {

    if (config && typeof config === "object") {
      this.basedir = process.cwd();
      this.config = config;
    } else {
      this.basedir = config && path.dirname(<string>config) || process.cwd();
      this.config = require(<string>config || path.join(this.basedir, "webpack.config.js"));
    }

    this.compiler = new MockWebpackCompiler();
  }

  createGlobalContext() {
    return {
      __webpack_public_path__: "",

      // TODO _ this should be shared by other strategies later on
      process: {
        argv: [],
        nextTick: next => setTimeout(next, 0),
        env: process.env,
        cwd: () => process.cwd()
      }
    };
  }

  createModuleContext(module: IModule) {
    return new WebpackSandboxContext(module);
  }

  /**
   * Results the relative file path from the cwd, and provides
   * information about how it should be treared.
   *
   * Examples:
   * const dependencyInfo = resolver.resolve('text!./module.mu');
   * const dependencyInfo = resolver.resolve('template!./module.mu');
   */

  getLoader(options: IWebpackLoaderOptions): IDependencyLoader {
    return this._injector.inject(new WebpackDependencyLoader(this, options));
  }

  async resolve(moduleInfo: string, cwd: string): Promise<IResolvedDependencyInfo> {

    const { config } = this;

    moduleInfo = config.resolve.alias && config.resolve.alias[moduleInfo] || moduleInfo;


    let loaderOptions = parserLoaderOptions(moduleInfo, true);

    let resolvedFilePath;
    const relativeFilePath = moduleInfo.split("!").pop();

    try {

      this.logger.verbose("Resolving %s:%s (%s)", cwd, relativeFilePath, moduleInfo);

      resolvedFilePath = await this._resolver.resolve(relativeFilePath, cwd, {
        extensions: this.config.resolve.extensions,
        directories: [...this.config.resolve.modulesDirectories, config.resolve.root, this.basedir]
      });
    } catch(e) {
      this.logger.warn(`Unable to resolve ${relativeFilePath}`);
    }

    const isCore = resolvedFilePath && resolve.isCore(resolvedFilePath);

    if (isCore) {
      let type = moduleInfo;
      if (this.config.node) {
        const value = this.config.node[moduleInfo];
        if (this.config.node[moduleInfo] === "empty") {
          type = "empty";
        }
      }
      resolvedFilePath = nodeLibs[type] || require.resolve(`node-libs-browser/mock/${type}`);
    }

    return {
      filePath: resolvedFilePath,
      loaderOptions: loaderOptions,
      hash: md5(`webpack:${resolvedFilePath}:${JSON.stringify(loaderOptions)}`)
    };
  }
}

