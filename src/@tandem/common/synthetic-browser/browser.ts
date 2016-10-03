import { SyntheticLocation } from "./location";
import { SyntheticDocument, SyntheticWindow } from "./dom";
import { ISyntheticDocumentRenderer, DOMRenderer } from "./renderer";
import { Sandbox, Dependencies, MimeTypes, TypeWrapBus, ChangeAction } from "@tandem/common";

export class SyntheticBrowser {

  private _sandbox: Sandbox;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;

  constructor(private _dependencies: Dependencies) {
    this._renderer = new DOMRenderer();
    this._sandbox = new Sandbox(_dependencies, this.createSandboxGlobals.bind(this));
    this._sandbox.observe(new TypeWrapBus(ChangeAction.CHANGE, this.onSandboxChange.bind(this)));
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
    return new SyntheticWindow();
  }

  protected onSandboxChange(action: ChangeAction) {
    console.log("sandbox change");
  }
}