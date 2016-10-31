import { SyntheticLocation } from "./location";
import { SyntheticRendererAction, SyntheticBrowserAction } from "./actions";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode } from "./dom";
import { ISyntheticDocumentRenderer, SyntheticDOMRenderer, TetherRenderer, NoopRenderer } from "./renderers";
import {
  Action,
  IActor,
  inject,
  bindable,
  loggable,
  Logger,
  isMaster,
  BubbleBus,
  Observable,
  TypeWrapBus,
  ChangeAction,
  IInjectable,
  findTreeNode,
  IObservable,
  Injector,
  bindProperty,
  watchProperty,
  HTML_MIME_TYPE,
  MimeTypeProvider,
  PropertyChangeAction,
  PrivateBusProvider,
  InjectorProvider,
  waitForPropertyChange,
} from "@tandem/common";

import {
  BundleDependency,
  Bundler,
  Sandbox,
  BundlerProvider,
  IBundleStrategyOptions,
} from "@tandem/sandbox";

import {
  SyntheticDOMElementClassProvider,
} from "./providers";

import { WrapBus } from "mesh";

export interface ISyntheticBrowserOpenOptions {
  url: string;
  bundleStrategyOptions?: IBundleStrategyOptions;
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
  private _documentObserver: IActor;
  private _location: SyntheticLocation;
  private _openOptions: ISyntheticBrowserOpenOptions;
  private _renderer: ISyntheticDocumentRenderer;

  constructor(protected _injector: Injector, renderer?: ISyntheticDocumentRenderer, readonly parent?: ISyntheticBrowser) {
    super();
    _injector.inject(this);

    this._renderer = isMaster ? renderer || new SyntheticDOMRenderer() : new NoopRenderer();
    this._renderer.observe(new BubbleBus(this));
    this._documentObserver = new BubbleBus(this);
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
    this.notify(new PropertyChangeAction("window", value, oldWindow));
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

    this.logger.verbose("opening %s", options);

    this._openOptions = options;
    this._location = new SyntheticLocation(options.url);
    await this.open2(options);
  }

  protected abstract async open2(options: ISyntheticBrowserOpenOptions);

  protected notifyLoaded() {
    this.notify(new SyntheticBrowserAction(SyntheticBrowserAction.BROWSER_LOADED));
  }
}

export class SyntheticBrowser extends BaseSyntheticBrowser {

  private _sandbox: Sandbox;
  private _entry: BundleDependency;

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
    const bundler = BundlerProvider.getInstance(options.bundleStrategyOptions, this._injector);
    this._entry = await bundler.bundle({ filePath: options.url });
    this.logger.info("opening %s in sandbox", options.url);
    this._sandbox.open(this._entry);
  }

  get document() {
    return this.window && this.window.document;
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const window = new SyntheticWindow(this, this.location);
    this._registerElementClasses(window.document);
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

    this.logger.info("Evaluating entry %s", this.location.toString());

    // look for module exports - typically by evaluator, or loader
    if (exports.nodeType) {
      exportsElement = exports;

    // check for explicit renderPreview function - less ideal
    } else if (exports.renderPreview) {
      exportsElement = exports.renderPreview();
    } else {

      // scan for reflect metadata
      for (const key in exports) {
        const value = exports[key];
        const renderPreview = Reflect.getMetadata("tandem:renderPreview", value);
        if (renderPreview) {
          console.log("FOUND");
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

    this.notifyLoaded();
  }
}
