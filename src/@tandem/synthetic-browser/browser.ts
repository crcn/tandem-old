import { SyntheticLocation } from "./location";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode } from "./dom";
import { ISyntheticDocumentRenderer, DOMRenderer, TetherRenderer } from "./renderers";
import {
  bindable,
  MimeTypes,
  BubbleBus,
  Observable,
  TypeWrapBus,
  ChangeAction,
  Dependencies,
  MainBusDependency,
  PropertyChangeAction,
} from "@tandem/common";

import {
  ISyntheticComponent,
  BaseSyntheticComponent,
  DefaultSyntheticComponent,
  evaluateSyntheticComponent,
} from "./components";

import {
  Sandbox,
  SandboxAction,
} from "@tandem/sandbox";

import { SyntheticDOMNodeComponentClassDependency, SyntheticDOMElementClassDependency } from "./dependencies";

import { WrapBus } from "mesh";

export class SyntheticBrowser extends Observable {

  private _window: SyntheticWindow;
  private _sandbox: Sandbox;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;
  private _documentComponent: BaseSyntheticComponent<any, any>;

  constructor(private _dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer) {
    super();
    this._renderer = renderer || new DOMRenderer();
    this._renderer.observe(new BubbleBus(this));
    this._sandbox  = new Sandbox(_dependencies, this.createSandboxGlobals.bind(this));
    this._sandbox.observe(new TypeWrapBus(SandboxAction.OPENED_MAIN_ENTRY, this.onSandboxLoaded.bind(this)));
  }

  get sandbox(): Sandbox {
    return this._sandbox;
  }

  get dependencies(): Dependencies {
    return this._dependencies;
  }

  @bindable()
  get window(): SyntheticWindow {
    return this._window;
  }

  get renderer(): ISyntheticDocumentRenderer {
    return this._renderer;
  }

  get location(): SyntheticLocation {
    return this._location;
  }

  async open(url: string) {
    this._location = new SyntheticLocation(url);
    await this._sandbox.open(MimeTypes.HTML, url);
  }

  get document() {
    return this._window && this._window.document;
  }

  get documentComponent() {
    return this._documentComponent;
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const window = new SyntheticWindow(this, this._renderer, this._location);
    this._registerElementClasses(window.document);

    // TODO - this shouldn't be here
    window["process"] = {
      env: {
        NODE_ENV: "development"
      }
    };

    return window;
  }

  private _registerElementClasses(document: SyntheticDocument) {
    for (const dependency of SyntheticDOMElementClassDependency.findAll(this._dependencies)) {
      document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
    }
  }

  protected async onSandboxLoaded(action: SandboxAction) {
    const window = this._sandbox.global as SyntheticWindow;
    const mainExports = this._sandbox.mainExports;

    // The main entry module may be an HTML document. If that's the case, then the default
    // exports will be a synthetic DOM node -- append that to the document body
    if (mainExports && mainExports.nodeType) {
      window.document.body.appendChild(mainExports);
    }

    this._window = window;
    this._documentComponent = this._renderer.target = await evaluateSyntheticComponent(window.document, this._documentComponent, this._dependencies) as BaseSyntheticComponent<any, any>;

    this.notify(action);
  }
}
