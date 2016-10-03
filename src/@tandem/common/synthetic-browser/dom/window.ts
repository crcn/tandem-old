import { SyntheticDocument } from "./document";
import { SyntheticLocation } from "../location";

export class SyntheticWindow {
  private _location: SyntheticLocation;
  readonly document: SyntheticDocument;

  constructor() {
    this.document = new SyntheticDocument(this);
  }

  get location(): SyntheticLocation {
    return this._location;
  }

  set location(value: SyntheticLocation) {
    this._location = value;
  }
}