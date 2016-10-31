import { bindable } from "@tandem/common/decorators";
import { Observable } from "@tandem/common/observable";
import { IPatchable } from "@tandem/common/object";
import { HTML_XMLNS } from "./constants";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticDocument } from "./document";
import { SyntheticHTMLElement } from "./html";

export class SyntheticNavigator {
  readonly appCodeName = "Tandem";
  readonly platform =  "synthetic";
  readonly userAgent = "none";
}

// export class SyntheticConsole {
//   log() {}
//   warn() {}
//   error() {}
//   notice() { }
// }

export class SyntheticWindow extends Observable {

  readonly navigator = new SyntheticNavigator();

  // TODO - emit events from logs here
  readonly console = console;

  @bindable()
  public location: SyntheticLocation;

  readonly document: SyntheticDocument;
  readonly window: SyntheticWindow;

  // TODO - need to wrap around these
  readonly setInterval = setInterval;
  readonly setTimeout = setTimeout;
  readonly process = process;

  public resolve: { extensions: string[], directories: string[] };

  constructor(readonly browser: ISyntheticBrowser, location: SyntheticLocation, document?: SyntheticDocument) {
    super();
    this.resolve = { extensions: [], directories: [] };
    this.document = document || this.createDocument();
    this.document.$window = this;
    this.location = location;
    this.window   = this;
  }

  get depth(): number {
    let i = 0;
    let c = this;
    while (c) {
      i++;
      c = <any>c.parent;
    }
    return i;
  }

  get parent(): SyntheticWindow {
    return this.browser.parent && this.browser.parent.window && this.browser.parent.window;
  }

  private createDocument() {
    const document = new SyntheticDocument(HTML_XMLNS);
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