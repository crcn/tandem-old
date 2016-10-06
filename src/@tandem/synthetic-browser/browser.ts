import { SyntheticLocation } from "./location";
import { SyntheticDocument, SyntheticWindow, SyntheticMarkupNode } from "./dom";
import { ISyntheticDocumentRenderer, DOMRenderer, TetherRenderer } from "./renderers";
import {
  bindable,
  MimeTypes,
  Observable,
  TypeWrapBus,
  ChangeAction,
  Dependencies,
  MainBusDependency,
  PropertyChangeAction,
} from "@tandem/common";

import {
  Sandbox,
  SandboxAction,
} from "@tandem/sandbox";

import {
  SyntheticMarkupElementClassDependency
} from "./dependencies";

import { WrapBus } from "mesh";

export class SyntheticBrowser extends Observable {

  private _window: SyntheticWindow;
  private _sandbox: Sandbox;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;

  constructor(private _dependencies: Dependencies) {
    super();

    // TODO - renderer should not be part of the synthetic browser -- needs
    // to be part of the preview instead.
    this._renderer = new DOMRenderer();
    // this._renderer = new TetherRenderer(MainBusDependency.getInstance(_dependencies));
    this._sandbox = new Sandbox(_dependencies, this.createSandboxGlobals.bind(this));
    this._sandbox.observe(new TypeWrapBus(SandboxAction.EVALUATED, this.onSandboxEvaluated.bind(this)));
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
    this._sandbox.open(MimeTypes.HTML, url);
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const window = new SyntheticWindow(this._sandbox, this._location);
    this._registerElements(window);

    // TODO - this shouldn't be here
    window["process"] = {
      env: {
        NODE_ENV: "development"
      }
    };

    return window;
  }

  protected async onSandboxEvaluated(action: SandboxAction) {
    const window = this._sandbox.global as SyntheticWindow;
    const mainExports = this._sandbox.mainExports;

    // is a synthetic node
    if (mainExports && mainExports.nodeType) {
      window.document.body.appendChild(mainExports);
    }

    await window.document.load();
    if (this._window) {
      this._window.patch(window);
    } else {
      this._window = window;
      this._renderer.target = this._window.document;
    }
  }

  private _registerElements(window: SyntheticWindow) {
    for (const elementClassDependency of SyntheticMarkupElementClassDependency.findAll(this._dependencies)) {
      window.document.registerElementNS(elementClassDependency.xmlns, elementClassDependency.tagName, elementClassDependency.value);
    }
  }
}