import { Sandbox } from "@tandem/sandbox";
import { MimeTypes } from "@tandem/common";
import { bindable } from "@tandem/common/decorators";
import { Observable } from "@tandem/common/observable";
import { IPatchable } from "@tandem/common/object";
import { HTML_XMLNS } from "./constants";
import { SyntheticLocation } from "../location";
import { SyntheticDocument } from "./document";
import { SyntheticHTMLElement } from "./html";

export class SyntheticWindow extends Observable implements IPatchable {

  @bindable()
  public location: SyntheticLocation;

  readonly document: SyntheticDocument;
  readonly window: SyntheticWindow;

  constructor(readonly sandbox: Sandbox, location: SyntheticLocation) {
    super();
    this.document = this.createDocument();
    this.location = location;
    this.window   = this;
  }

  private createDocument() {
    const document = new SyntheticDocument(this, HTML_XMLNS);
    document.registerElementNS(HTML_XMLNS, "default", SyntheticHTMLElement);
    const documentElement = document.createElement("div");

    // head
    documentElement.appendChild(document.createElement("div"));

    // body
    documentElement.appendChild(document.createElement("div"));

    document.appendChild(documentElement);
    return document;
  }

  // TODO - use visitor pattern here
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