import { Sandbox } from "@tandem/sandbox";
import { bindable } from "@tandem/common/decorators";
import { Observable } from "@tandem/common/observable";
import { IPatchable } from "@tandem/common/object";
import { HTML_XMLNS } from "./constants";
import { SyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticDocument } from "./document";
import { SyntheticHTMLElement } from "./html";
import { ISyntheticDocumentRenderer } from "../renderers";

export class SyntheticWindow extends Observable {

  @bindable()
  public location: SyntheticLocation;

  readonly document: SyntheticDocument;
  readonly window: SyntheticWindow;

  constructor(readonly browser: SyntheticBrowser, readonly renderer: ISyntheticDocumentRenderer, location: SyntheticLocation) {
    super();
    this.document = this.createDocument();
    this.location = location;
    this.window   = this;
  }

  get parent(): SyntheticWindow {
    return this.browser.parent && this.browser.parent.window && this.browser.parent.window;
  }

  get sandbox() {
    return this.browser.sandbox;
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
}