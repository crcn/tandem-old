import { SyntheticLocation } from "./location";
import { SyntheticRendererAction } from "./messages";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode } from "./dom";
import { ISyntheticDocumentRenderer, SyntheticDOMRenderer, TetherRenderer, NoopRenderer } from "./renderers";
import { IDispatcher } from "@tandem/mesh";
import {
  Action,
  inject,
  Logger,
  bindable,
  loggable,
  isMaster,
  Injector,
  Observable,
  IInjectable,
  IObservable,
  bindProperty,
  findTreeNode,
  ChangeAction,
  watchProperty,
  HTML_MIME_TYPE,
  MimeTypeProvider,
  BubbleDispatcher,
  InjectorProvider,
  PrivateBusProvider,
  PropertyChangeEvent,
  waitForPropertyChange,
} from "@tandem/common";

import {
  Sandbox,
  Dependency,
  DependencyGraph,
  DependencyGraphProvider,
  IDependencyGraphStrategyOptions,
  DependencyGraphStrategyOptionsProvider,
} from "@tandem/sandbox";

import {
  SyntheticDOMElementClassProvider,
} from "./providers";

import { CallbackDispatcher } from "@tandem/mesh";

export interface ISyntheticBrowserOpenOptions {
  url: string;
  dependencyGraphStrategyOptions?: IDependencyGraphStrategyOptions;
}

export interface ISyntheticBrowser extends IObservable {
  open(options: ISyntheticBrowserOpenOptions): Promise<any>;
  window: SyntheticWindow;
  parent?: ISyntheticBrowser;
  renderer: ISyntheticDocumentRenderer;
  document: SyntheticDocument;
  injector: Injector;
  location: SyntheticLocation;
}

@loggable()
export abstract class BaseSyntheticBrowser extends Observable implements ISyntheticBrowser, IInjectable {

  protected readonly logger: Logger;

  private _url: string;
  private _window: SyntheticWindow;
  private _documentObserver: IDispatcher<any, any>;
  private _location: SyntheticLocation;
  private _openOptions: ISyntheticBrowserOpenOptions;
  private _renderer: ISyntheticDocumentRenderer;

  constructor(protected _injector: Injector, renderer?: ISyntheticDocumentRenderer, readonly parent?: ISyntheticBrowser) {
    super();
    _injector.inject(this);

    this._renderer = _injector.inject(isMaster ? renderer || new SyntheticDOMRenderer() : new NoopRenderer());
    this._renderer.observe(new BubbleDispatcher(this));
    this._documentObserver = new BubbleDispatcher(this);
  }

  $didInject() { }

  get document() {
    return this.window && this.window.document;
  }

  get injector() {
    return this._injector;
  }

  get location() {
    return this._location;
  }

  get window() {
    return this._window;
  }

  protected setWindow(value: SyntheticWindow) {
    if (this._window) {
      this._window.document.unobserve(this._documentObserver);
    }
    const oldWindow = this._window;
    this._window = value;
    this._renderer.document = value.document;
    this._window.document.observe(this._documentObserver);
    this.notify(new PropertyChangeEvent("window", value, oldWindow));
  }

  get renderer(): ISyntheticDocumentRenderer {
    return this._renderer;
  }

  protected get openOptions(): ISyntheticBrowserOpenOptions {
    return this._openOptions;
  }

  async open(options: ISyntheticBrowserOpenOptions) {
    if (JSON.stringify(this._openOptions) === JSON.stringify(options) && this._window) {
      return;
    }

    this._openOptions = options;
    this._location = new SyntheticLocation(options.url);
    await this.open2(options);
  }

  protected abstract async open2(options: ISyntheticBrowserOpenOptions);

}

export class SyntheticBrowser extends BaseSyntheticBrowser {

  private _sandbox: Sandbox;
  private _entry: Dependency;
  private _graph: DependencyGraph;

  $didInject() {
    super.$didInject();
    this._sandbox    = new Sandbox(this._injector, this.createSandboxGlobals.bind(this));
    watchProperty(this._sandbox, "exports", this.onSandboxExportsChange.bind(this));
    watchProperty(this._sandbox, "global", this.setWindow.bind(this));
  }

  get sandbox(): Sandbox {
    return this._sandbox;
  }

  async open2(options: ISyntheticBrowserOpenOptions) {

    this.logger.info(`Opening ${options.url} ...`);
    const timerLogger = this.logger.startTimer();
    const strategyOptions = options.dependencyGraphStrategyOptions || DependencyGraphStrategyOptionsProvider.find(options.url, this._injector);
    const graph = this._graph = DependencyGraphProvider.getInstance(strategyOptions, this._injector);
    this._entry = await graph.getDependency(await graph.resolve(options.url, "/"));
    await this._sandbox.open(this._entry);

    timerLogger.stop(`Loaded ${options.url}`);
  }

  get document() {
    return this.window && this.window.document;
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const window = new SyntheticWindow(this.location, this);
    this._registerElementClasses(window.document);
    Object.assign(window, this._graph.createGlobalContext());
    return window;
  }

  private _registerElementClasses(document: SyntheticDocument) {
    for (const dependency of SyntheticDOMElementClassProvider.findAll(this._injector)) {
      document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
    }
  }

  private async onSandboxExportsChange(exports: any) {
    const window = this._sandbox.global as SyntheticWindow;

    let exportsElement: SyntheticDOMNode;

    this.logger.debug("Evaluated entry", this.location.toString());

    // look for module exports - typically by evaluator, or loader
    if (exports.nodeType) {
      exportsElement = exports;

    // check for explicit renderPreview function - less ideal
    } else if (exports.renderPreview) {
      exportsElement = exports.renderPreview();
    } else {

      this.logger.debug(`Checking exports for render metadata:`, Object.keys(exports).join(", "));

      // scan for reflect metadata
      for (const key in exports) {
        const value = exports[key];
        const renderPreview = exports.renderPreview || value.$$renderPreview;
        if (renderPreview) {
          this.logger.debug("Found render preview metadata");
          exportsElement = renderPreview();
        }
      }

      if (!exportsElement) {
        this.logger.warn(`Exported Sandbox object is not a synthetic DOM node.`);
      }
    }

    if (exportsElement) {
      window.document.body.appendChild(exportsElement);
    }
  }
}
