import { bindable } from "@tandem/common/decorators";
import { Observable } from "@tandem/common/observable";
import { IPatchable } from "@tandem/common/object";
import { SyntheticLocation } from "../location";
import { SyntheticHTMLDocument, SyntheticHTMLTextNode } from "./html";

export class SyntheticWindow extends Observable implements IPatchable {

  @bindable()
  public location: SyntheticLocation;

  readonly document: SyntheticHTMLDocument;
  readonly window: SyntheticWindow;

  constructor(location: SyntheticLocation) {
    super();
    this.document = new SyntheticHTMLDocument(this);
    this.location = location;
    this.window   = this;
  }

  patch(source: SyntheticWindow) {

    // move this to if(patchGuard(this, source)) return;
    if (source["__patchTarget"]) return;
    source["__patchTarget"] = this;

    // TODO - move this logic to patchObject utility

    // update / remove old values
    for (const key in this) {
      const oldValue = this[key];
      const newValue = source[key];

      if (!newValue) {
        if (oldValue && oldValue.dispose) {
          oldValue.dispose();
        }
        this[key] = undefined;
        continue;
      }

      if (oldValue && oldValue.patch) {
        oldValue.patch(newValue);
      }
    }

    // add new values
    for (const key in source) {
      if (!this[key]) {
        this[key] = source[key];
      }
    }
  }
}