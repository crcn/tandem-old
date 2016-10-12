import { SyntheticLocation } from "./location";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode } from "./dom";
import { ISyntheticDocumentRenderer, SyntheticDOMRenderer, TetherRenderer } from "./renderers";
import {
  Action,
  bindable,
  BubbleBus,
  Observable,
  TypeWrapBus,
  ChangeAction,
  Dependencies,
  HTML_MIME_TYPE,
  MainBusDependency,
  MimeTypeDependency,
  PropertyChangeAction,
} from "@tandem/common";

import {
  BaseDOMNodeEntity,
  DefaultSyntheticDOMEntity,
} from "./entities";

import {
  Sandbox,
  SandboxAction,
  IModuleResolveOptions,
} from "@tandem/sandbox";

import {
  SyntheticDOMElementClassDependency,
  SyntheticDOMNodeEntityClassDependency,
} from "./dependencies";

import { WrapBus } from "mesh";

export class SyntheticBrowser extends Observable {

  private _window: SyntheticWindow;
  private _sandbox: Sandbox;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;
  private _documentEntity: BaseDOMNodeEntity<any, any>;

  constructor(private _dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, readonly parent?: SyntheticBrowser) {
    super();
    this._renderer = renderer || new SyntheticDOMRenderer();
    this._renderer.observe(new BubbleBus(this));
    this._sandbox  = new Sandbox(_dependencies, this.createSandboxGlobals.bind(this), this.getResolveOptions.bind(this));
    this._sandbox.observe(new WrapBus(this.onSandboxAction.bind(this)));
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
    await this._sandbox.open(HTML_MIME_TYPE, url);
  }

  get document() {
    return this._window && this._window.document;
  }

  get documentEntity() {
    return this._documentEntity;
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const oldWindow = this._window;
    const window = this._window = new SyntheticWindow(this, this._renderer, this._location);
    this._registerElementClasses(window.document);

    // TODO - this shouldn't be here
    window["process"] = {
      env: {
        NODE_ENV: "development"
      }
    };

    this.notify(new PropertyChangeAction("window", window, oldWindow));

    return window;
  }

  protected getResolveOptions(): IModuleResolveOptions {

    const extensions  = [];
    const directories = [];

    if (this.window) {
      const windowResolve = this.window.resolve;
      extensions.push(...windowResolve.extensions);
      directories.push(...windowResolve.directories);
    }

    if (this.parent) {
      const parentResolve = this.parent.getResolveOptions();
      extensions.push(...parentResolve.extensions);
      directories.push(...parentResolve.directories);
    }

    return {
      extensions: extensions,
      directories: directories
    };
  }

  private _registerElementClasses(document: SyntheticDocument) {
    for (const dependency of SyntheticDOMElementClassDependency.findAll(this._dependencies)) {
      document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
    }
  }

  protected onSandboxAction(action: Action) {
    if (action.type === SandboxAction.OPENED_MAIN_ENTRY) {
      this.onSandboxLoaded(action);
    }
    this.notify(action);
  }

  protected async onSandboxLoaded(action: SandboxAction) {
    const window = this._sandbox.global as SyntheticWindow;
    const mainExports = this._sandbox.mainExports;

    // The main entry module may be an HTML document. If that's the case, then the default
    // exports will be a synthetic DOM node -- append that to the document body
    if (mainExports && mainExports.nodeType) {
      window.document.body.appendChild(mainExports);
    }

    const documentEntity = this._documentEntity;

    this._documentEntity = this._renderer.entity = SyntheticDOMNodeEntityClassDependency.reuse(window.document, this._documentEntity, this._dependencies);
    await this._documentEntity.evaluate();

    if (this._documentEntity !== documentEntity) {
      this.notify(new PropertyChangeAction("documentEntity", this._documentEntity, documentEntity));
    }

  }
}
