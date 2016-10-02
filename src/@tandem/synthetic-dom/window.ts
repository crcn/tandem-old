import { SyntheticDocument } from "./document";
import { SyntheticLocation } from "./location";

export class SyntheticWindow {
  private _location: SyntheticLocation;

  constructor() {

  }

  get location(): SyntheticLocation {
    return this._location;
  }

  set location(value: SyntheticLocation) {
    this._location = value;
  }
}