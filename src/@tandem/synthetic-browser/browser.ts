import { SyntheticLocation } from "./location";
import { SyntheticHTMLDocument, SyntheticWindow } from "./dom";
import { ISyntheticHTMLDocumentRenderer, DOMRenderer, TetherRenderer } from "./renderers";
import {
  bindable,
  MainBusDependency,
  Dependencies,
  MimeTypes,
  TypeWrapBus,
  PropertyChangeAction,
  ChangeAction,
  Observable,
} from "@tandem/common";

import {
  Sandbox,
  SandboxAction,
} from "@tandem/sandbox";

import { WrapBus } from "mesh";

export class SyntheticBrowser extends Observable {

  private _window: SyntheticWindow;
  private _sandbox: Sandbox;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticHTMLDocumentRenderer;

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

  get renderer(): ISyntheticHTMLDocumentRenderer {
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
    const window = new SyntheticWindow(this._location);

    // TODO - this shouldn't be here
    window["process"] = {
      env: {
        NODE_ENV: "development"
      }
    };

    return window;
  }

  protected onSandboxEvaluated(action: SandboxAction) {
    if (this._window) {
      this._window.patch(this._sandbox.global);
    } else {
      this._window = this._sandbox.global;
      this._renderer.target = this._window.document;
    }
  }
}