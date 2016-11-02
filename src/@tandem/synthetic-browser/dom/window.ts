import { bindable } from "@tandem/common/decorators";
import { HTML_XMLNS } from "./constants";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticDocument } from "./document";
import { Logger, Observable, PrivateBusProvider } from "@tandem/common";
import { SyntheticHTMLElement } from "./html";
import { NoopBus } from "mesh";

export class SyntheticNavigator {
  readonly appCodeName = "Tandem";
  readonly platform =  "synthetic";
  readonly userAgent = "none";
}

export class SyntheticConsole {
  constructor(private _logger: Logger) {

    // Ensure that when the logs get dispatched that they are displayed.
    this._logger.filterable = false;
  }

  log(text, ...rest: any[]) {
    this._logger.verbose(text, ...rest);
  }
  info(text, ...rest: any[]) {
    this._logger.info(text, ...rest);
  }
  warn(text, ...rest: any[]) {
    this._logger.warn(text, ...rest);
  }
  error(text, ...rest: any[]) {
    this._logger.error(text, ...rest);
  }
}

export class SyntheticWindow extends Observable {

  readonly navigator = new SyntheticNavigator();

  // TODO - emit events from logs here
  readonly console: SyntheticConsole;

  @bindable()
  public location: SyntheticLocation;

  readonly document: SyntheticDocument;
  readonly window: SyntheticWindow;

  // TODO - need to wrap around these
  readonly setInterval = setInterval;
  readonly setTimeout = setTimeout;

  public resolve: { extensions: string[], directories: string[] };

  constructor(location: SyntheticLocation, readonly browser?: ISyntheticBrowser, document?: SyntheticDocument) {
    super();
    this.resolve = { extensions: [], directories: [] };
    this.document = document || this.createDocument();
    this.document.$window = this;
    this.location = location;
    this.window   = this;
    this.console  = new SyntheticConsole(
      new Logger(browser && PrivateBusProvider.getInstance(browser.injector) || new NoopBus(), "**VM** ")
    );
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