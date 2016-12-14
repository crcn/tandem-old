import { Sandbox } from "@tandem/sandbox";
import { bindable } from "@tandem/common/decorators";
import { btoa, atob } from "abab"
import { HTML_XMLNS } from "./constants";
import { URL, FakeURL } from "./url";
import { Blob, FakeBlob } from "./blob";
import { SyntheticHistory } from "./history";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticCSSStyle } from "./css";
import { SyntheticDocument } from "./document";
import { SyntheticDOMElement } from "./markup";
import { SyntheticHTMLElement } from "./html";
import { SyntheticLocalStorage } from "./local-storage";
import { SyntheticWindowTimers } from "./timers";
import { bindDOMNodeEventMethods } from "./utils";
import { SyntheticXMLHttpRequest, XHRServer } from "./xhr";
import { Logger, Observable, PrivateBusProvider, PropertyWatcher, MutationEvent } from "@tandem/common";
import { noopDispatcherInstance, IStreamableDispatcher, CallbackDispatcher } from "@tandem/mesh";
import { 
  DOMEventTypes,
  IDOMEventEmitter,
  SyntheticDOMEvent,
  DOMEventDispatcherMap, 
  DOMEventListenerFunction, 
} from "./events";

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

// TODO - register element types from injector
export class SyntheticDOMImplementation {
  constructor(private _window: SyntheticWindow) {

  }
  hasFeature(value: string) {
    return false;
  }

  createHTMLDocument(title?: string) {
    const document = new SyntheticDocument(HTML_XMLNS, this);
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

export class SyntheticWindow extends Observable {

  readonly navigator = new SyntheticNavigator();

  // TODO - emit events from logs here
  readonly console: SyntheticConsole;

  @bindable()
  public location: SyntheticLocation;

  @bindable()
  public onload: DOMEventListenerFunction;

  @bindable()
  public onpopstate: DOMEventListenerFunction;

  readonly document: SyntheticDocument;
  readonly window: SyntheticWindow;

  // TODO - need to wrap around these
  readonly history: SyntheticHistory;
  readonly setTimeout: Function;
  readonly setInterval: Function;
  readonly setImmediate: Function;
  readonly clearTimeout: Function;
  readonly clearInterval: Function;
  readonly clearImmediate: Function;
  readonly localStorage: SyntheticLocalStorage;
  readonly self: SyntheticWindow;

  private _implementation: SyntheticDOMImplementation;

  readonly XMLHttpRequest:  { new(): SyntheticXMLHttpRequest };

  readonly HTMLElement;
  readonly Element;
  readonly WebSocket: { new(): any };

  private _windowTimers: SyntheticWindowTimers;
  private _eventListeners: DOMEventDispatcherMap;
  private _server: XHRServer;

  readonly Blob = Blob;
  readonly URL  = URL;
  readonly btoa = btoa;

  constructor(location?: SyntheticLocation, readonly browser?: ISyntheticBrowser, document?: SyntheticDocument) {
    super();

    const injector = browser && browser.injector;

    const bus = injector && PrivateBusProvider.getInstance(injector) || noopDispatcherInstance;
    
    // in case proto gets set - don't want the original to get fudged
    // but doesn't work -- element instanceof HTMLElement 
    this.HTMLElement = SyntheticHTMLElement;
    this.Element     = SyntheticDOMElement;

    const xhrServer = this._server = new XHRServer(this);

    this.WebSocket = class WebSocket { }

    if (injector) injector.inject(xhrServer);

    this.XMLHttpRequest = class extends SyntheticXMLHttpRequest { 
      constructor() {
        super(xhrServer);
      }
    };

    this.self = this;

    this._implementation = new SyntheticDOMImplementation(this);
    this._eventListeners = new DOMEventDispatcherMap(this);

    this.localStorage = new SyntheticLocalStorage();
    this.document = document || this._implementation.createHTMLDocument();
    this.document.$window = this;
    this.location = location || new SyntheticLocation("");
    this.history = new SyntheticHistory(this.location.toString());

    this.history.$locationWatcher.connect((newLocation) => {

      // copy props over -- changing the location means a redirect.
      this.location.$copyPropertiesFromUrl(newLocation.toString());
    });

    
    new PropertyWatcher<SyntheticLocation, string>(this.location, "href").connect((newValue) =>  {
      this.notify(new SyntheticDOMEvent(DOMEventTypes.POP_STATE));
    });
    
    this.window   = this;
    this.console  = new SyntheticConsole(
      new Logger(bus, "**VM** ")
    );

    const windowTimers  = this._windowTimers = new SyntheticWindowTimers();
    this.setTimeout     = windowTimers.setTimeout.bind(windowTimers);
    this.setInterval    = windowTimers.setInterval.bind(windowTimers);
    this.setImmediate   = windowTimers.setImmediate.bind(windowTimers);
    this.clearTimeout   = windowTimers.clearTimeout.bind(windowTimers);
    this.clearInterval  = windowTimers.clearInterval.bind(windowTimers);
    this.clearImmediate = windowTimers.clearImmediate.bind(windowTimers);

    bindDOMNodeEventMethods(this, DOMEventTypes.POP_STATE);
  }

  get sandbox() {
    return this.browser && this.browser.sandbox;
  }

  getComputedStyle() {
    return new SyntheticCSSStyle();
  }

  addEventListener(type: string, listener: DOMEventListenerFunction) {
    this._eventListeners.add(type, listener);
  }

  addEvent(type: string, listener: DOMEventListenerFunction) {
    this._eventListeners.add(type, listener);
  }

  removeEventListener(type: string, listener: DOMEventListenerFunction) {
    this._eventListeners.remove(type, listener);
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

  // ugly method invoked by browser to fire load events
  public $doneLoading() {

    // always comes before load event since DOM_CONTENT_LOADED assumes that assets
    // such as stylesheets have not yet been loaded in
    this.notify(new SyntheticDOMEvent(DOMEventTypes.DOM_CONTENT_LOADED));

    // sandbox has already mapped & loaded external dependencies, so go ahead and fire
    // the DOM events
    this.notify(new SyntheticDOMEvent(DOMEventTypes.LOAD));
  }
}