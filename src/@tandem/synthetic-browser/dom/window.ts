import { bindable } from "@tandem/common/decorators";
import { HTML_XMLNS } from "./constants";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticDocument } from "./document";
import { Logger, Observable, PrivateBusProvider } from "@tandem/common";
import { SyntheticHTMLElement } from "./html";
import { SyntheticWindowTimers } from "./timers";
import { noopDispatcherInstance } from "@tandem/mesh";
import { Blob, FakeBlob } from "./blob";
import { URL, FakeURL } from "./url";
import { btoa, atob } from "abab"

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
    this._logger.debug(text, ...rest);
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
  readonly setTimeout: Function;
  readonly setInterval: Function;
  readonly setImmediate: Function;
  readonly clearTimeout: Function;
  readonly clearInterval: Function;
  readonly clearImmediate: Function;

  private _windowTimers: SyntheticWindowTimers;

  readonly Blob = Blob;
  readonly URL  = URL;
  readonly btoa = btoa;

  public resolve: { extensions: string[], directories: string[] };

  constructor(location: SyntheticLocation, readonly browser?: ISyntheticBrowser, document?: SyntheticDocument) {
    super();
    this.resolve = { extensions: [], directories: [] };
    this.document = document || this.createDocument();
    this.document.$window = this;
    this.location = location;
    this.window   = this;
    this.console  = new SyntheticConsole(
      new Logger(browser && PrivateBusProvider.getInstance(browser.injector) || noopDispatcherInstance, "**VM** ")
    );

    const windowTimers = this._windowTimers = new SyntheticWindowTimers();
    this.setTimeout = windowTimers.setTimeout.bind(windowTimers);
    this.setInterval = windowTimers.setInterval.bind(windowTimers);
    this.setImmediate = windowTimers.setImmediate.bind(windowTimers);
    this.clearTimeout = windowTimers.clearTimeout.bind(windowTimers);
    this.clearInterval = windowTimers.clearInterval.bind(windowTimers);
    this.clearImmediate = windowTimers.clearImmediate.bind(windowTimers);
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

  dispose() {
    this._windowTimers.dispose();
  }

  get parent(): SyntheticWindow {
    return this.browser.parent && this.browser.parent.window && this.browser.parent.window;
  }

  private createDocument() {
    const document = new SyntheticDocument(HTML_XMLNS);
    document.registerElementNS(HTML_XMLNS, "default", SyntheticHTMLElement);
    const documentElement = document.createElement("html");

    // head
    documentElement.appendChild(document.createElement("head"));

    // body
    documentElement.appendChild(document.createElement("body"));

    document.appendChild(documentElement);
    return document;
  }
}