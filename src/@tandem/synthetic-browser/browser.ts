import { SyntheticLocation } from "./location";
import { SyntheticRendererAction, SyntheticBrowserAction } from "./actions";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode } from "./dom";
import { ISyntheticDocumentRenderer, SyntheticDOMRenderer, TetherRenderer, NoopRenderer } from "./renderers";
import {
  Action,
  IActor,
  inject,
  bindable,
  Injector,
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
  Dependencies,
  bindProperty,
  watchProperty,
  HTML_MIME_TYPE,
  MimeTypeDependency,
  PropertyChangeAction,
  PrivateBusDependency,
  DependenciesDependency,
  waitForPropertyChange,
} from "@tandem/common";

import {
  Bundle,
  Bundler,
  Sandbox,
  BundlerDependency,
} from "@tandem/sandbox";

import {
  SyntheticDOMCasterDependency,
  SyntheticDOMElementClassDependency,
} from "./dependencies";

import { WrapBus } from "mesh";

export interface ISyntheticBrowser extends IObservable {
  open(url: string): Promise<any>;
  window: SyntheticWindow;
  parent?: ISyntheticBrowser;
  renderer: ISyntheticDocumentRenderer;
  document: SyntheticDocument;
  dependencies: Dependencies;
  location: SyntheticLocation;
}

@loggable()
export abstract class BaseSyntheticBrowser extends Observable implements ISyntheticBrowser, IInjectable {

  protected readonly logger: Logger;

  private _url: string;
  private _window: SyntheticWindow;
  private _documentObserver: IActor;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;

  constructor(protected _dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, readonly parent?: ISyntheticBrowser) {
    super();
    Injector.inject(this, _dependencies);

    this._renderer = isMaster ? renderer || new SyntheticDOMRenderer() : new NoopRenderer();
    this._renderer.observe(new BubbleBus(this));
    this._documentObserver = new BubbleBus(this);
  }

  $didInject() { }

  get document() {
    return this.window && this.window.document;
  }

  get dependencies() {
    return this._dependencies;
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

  async open(url: string) {
    if (this._url && this._url === url) {
      return;
    }

    this.logger.verbose("opening %s", url);

    this._url = url;
    this._location = new SyntheticLocation(url);
    await this.open2(url);
  }

  protected abstract async open2(url: string);

  protected notifyLoaded() {
    this.notify(new SyntheticBrowserAction(SyntheticBrowserAction.BROWSER_LOADED));
  }
}

export class SyntheticBrowser extends BaseSyntheticBrowser {

  private _sandbox: Sandbox;
  private _entry: Bundle;

  @inject(BundlerDependency.ID)
  private _bundler: Bundler;

  $didInject() {
    super.$didInject();
    this._bundler = BundlerDependency.getInstance(this._dependencies);
    this._sandbox    = new Sandbox(this._dependencies, this.createSandboxGlobals.bind(this));
    watchProperty(this._sandbox, "exports", this.onSandboxExportsChange.bind(this));
    watchProperty(this._sandbox, "global", this.setWindow.bind(this));
  }

  get sandbox(): Sandbox {
    return this._sandbox;
  }

  async open2(url: string) {
    this._entry = await this._bundler.bundle(url);
    this.logger.info("opening %s in sandbox", url);
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
    for (const dependency of SyntheticDOMElementClassDependency.findAll(this._dependencies)) {
      document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
    }
  }

  private onSandboxExportsChange(exports: any) {
    const window = this._sandbox.global as SyntheticWindow;

    let exportsElement: SyntheticDOMNode;

    if (exports.nodeType) {
      exportsElement = exports;
    } else {
      console.warn(`Exported Sandbox object is not a synthetic DOM node.`);
    }

    if (exportsElement) {
      window.document.body.appendChild(exportsElement);
    }

    this.notifyLoaded();
  }
}
