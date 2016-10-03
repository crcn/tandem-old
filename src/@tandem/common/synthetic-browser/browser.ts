import { Sandbox } from "@tandem/common/sandbox";
import { Dependencies } from "@tandem/common/dependencies";
import { SyntheticLocation } from "./location";
import { ISyntheticDocumentRenderer, DOMRenderer } from "./renderer";

export class SyntheticBrowser {

  private _sandbox: Sandbox;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;

  constructor(private _dependencies: Dependencies) {
    this._renderer = new DOMRenderer();
    this._sandbox = new Sandbox(_dependencies);
  }

  get renderer(): ISyntheticDocumentRenderer {
    return this._renderer;
  }

  get location(): SyntheticLocation {
    return this._location;
  }

  async open(url: string) {
    this._location = new SyntheticLocation(url);
    this._sandbox.import("dom", url);
  }

}