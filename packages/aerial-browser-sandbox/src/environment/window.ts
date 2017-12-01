import { SyntheticWindow, createSyntheticWindow } from "../state";
import { getSEnvLocationClass } from "./location";
import { Dispatcher, weakMemo, generateDefaultId, mergeBounds, Rectangle } from "aerial-common2";

import { Mutation, Mutator, SetValueMutation, SetPropertyMutation, createPropertyMutation, createSetValueMutation, eachArrayValueMutation, diffArray, RemoveChildMutation, createStringMutation } from "source-mutation";
import { clamp, identity } from "lodash";
import { getSEnvEventTargetClass, getSEnvEventClasses, SEnvMutationEventInterface } from "./events";
import { SyntheticWindowRendererInterface, createNoopRenderer, SyntheticDOMRendererFactory, SyntheticWindowRendererEvent, SyntheticMirrorRenderer } from "./renderers";
import { getNodeByPath, getNodePath } from "../utils/node-utils";
import { getSEnvTimerClasses, SEnvTimersInterface } from "./timers";
import { createMediaMatcher } from "./media-match";
import { getSEnvLocalStorageClass } from "./local-storage";
import { getSEnvCSSRuleClasses, getSEnvCSSStyleDeclarationClass, getSEnvCSSStyleSheetClass } from "./css";
import { 
  SEnvElementInterface,
  getSEnvHTMLElementClasses, 
  getSEnvDocumentClass, 
  getSEnvDOMImplementationClass,
  getSEnvElementClass, 
  getSEnvHTMLElementClass, 
  SEnvDocumentInterface, 
  flattenDocumentSources,
  diffDocument, 
  diffComment, 
  filterNodes,
  diffHTMLNode,
  documentMutators,
} from "./nodes";
import { getSEnvCustomElementRegistry } from "./custom-element-registry";
import nwmatcher = require("nwmatcher");
import { SEnvNodeTypes, DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, HTML_XMLNS } from "./constants";

type OpenTarget = "_self" | "_blank";

export interface SEnvWindowInterface extends Window {
  uid: string;
  $id: string;
  didChange();
  $synthetic: boolean;
  $load();
  implementation: DOMImplementation;
  fetch: Fetch;
  struct: SyntheticWindow;
  externalResourceUris: string[];
  document: SEnvDocumentInterface;
  $setExternalUris(uris: string[]);
  dispose();

  // overridable by loaded window. Used
  // particularly to point generated source map URIs to 
  // proxies to handle any file mutations
  getSourceUri(uri: string);
  renderer:  SyntheticWindowRendererInterface;
  $selector: any;
  clone(deep?: boolean): SEnvWindowInterface;
};

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export type SEnvWindowContext = {
  fetch?: Fetch;
  reload?: () => {};
  getProxyUrl?: (url: string) => string;
  createRenderer?: (window: SEnvWindowInterface) => SyntheticWindowRendererInterface;
  console?: Console;
};

export const mirrorWindow = (target: SEnvWindowInterface, source: SEnvWindowInterface) => {
  const { SEnvMutationEvent, SEnvWindowOpenedEvent, SEnvURIChangedEvent, SEnvWindowEvent } = getSEnvEventClasses();

  (source.renderer as SyntheticMirrorRenderer).source = target.renderer;
 
  if (target.$id !== source.$id) {
    throw new Error(`target must be a previous clone of the source.`);
  }

  const sync = () => {
    patchWindow(target, diffWindow(target, source));

    // sync window Ids to ensure future mutation events. This
    // also doubles as a sanity check for patching. 
    syncWindowIds(target, source);
  };

  // TODO - need to sync mutations from target to source since
  // the editor mutates the target -- changes need to be reflected in the source
  // so that incomming source mutations are properly mapped back to the target. 
  
  // happens with dynamic content.
  const onMutation = ({ mutation }: SEnvMutationEventInterface) => {
    const childObjects = flattenWindowObjectSources(target.struct);

    // likely a full window reload. In that case, need to diff & patch
    if (!childObjects[mutation.target.$id]) {
      console.warn(`Could not find matching mutation target, slowly syncing windows.`, mutation);
      sync();
    } else {
      patchWindow(target, [mutation]);
    }
  };

  const mirrorEvent = (event: Event) => {
    target.dispatchEvent(event);
  };

  const tryPatching = () => {
    if (source.document.readyState !== "complete") {
      return;
    }

    sync();
    source.addEventListener(SEnvMutationEvent.MUTATION, onMutation);
  };
  
  const onResize = (event: Event) => {
    target.resizeTo(source.innerWidth, source.innerHeight);
  };

  const onMove = (event: Event) => {
    target.moveTo(source.screenLeft, source.screenTop);
  };

  const onTargetMove = (event: Event) => {
    source.moveTo(target.screenLeft, target.screenTop);
  };

  const onTargetResize = (event: Event) => {
    source.resizeTo(target.innerWidth, target.innerHeight);
  };

  const onClose = (event: Event) => {
    target.close();
  };

  const onResourceChanged = (event: Event) => {
    target.$setExternalUris(source.externalResourceUris);
  };

  const onUriChanged = (event) => target.dispatchEvent(event);

  source.resizeTo(target.innerWidth, target.innerHeight);
  source.moveTo(target.screenLeft, target.screenTop);

  source.addEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
  source.addEventListener("move", onMove);
  source.addEventListener("resize", onResize);
  source.addEventListener("close", onClose);
  source.addEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
  target.addEventListener("move", onTargetMove);
  target.addEventListener("resize", onTargetResize);
  source.document.addEventListener("readystatechange", tryPatching);
  source.addEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, onResourceChanged);

  tryPatching();

  return () => {
    source.removeEventListener(SEnvMutationEvent.MUTATION, onMutation);
    source.removeEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
    source.removeEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
    source.removeEventListener("move", onMove);
    source.removeEventListener("resize", onResize);
    source.removeEventListener("close", onClose);
    target.removeEventListener("move", onTargetMove);
    target.removeEventListener("resize", onTargetResize);
    target.removeEventListener("readystatechange", tryPatching);
    source.removeEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, onResourceChanged);
  };
}
const defaultFetch = ((info) => {
  throw new Error(`Fetch not provided for ${info}`);
}) as any;

const throwUnsupportedMethod = () => {
  throw new Error(`Unsupported`);
}

export const getSEnvWindowClass = weakMemo((context: SEnvWindowContext) => {
  const { createRenderer, fetch = defaultFetch, getProxyUrl = identity } = context;


  const SEnvEventTarget = getSEnvEventTargetClass(context);
  const SEnvDocument = getSEnvDocumentClass(context);
  const SEnvLocation = getSEnvLocationClass(context);
  const SEnvCustomElementRegistry = getSEnvCustomElementRegistry(context);
  const SEnvElement     = getSEnvElementClass(context);
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);
  const SEnvLocalStorage = getSEnvLocalStorageClass(context);
  const SEnvDOMImplementation = getSEnvDOMImplementationClass(context);
  const { SEnvTimers } = getSEnvTimerClasses(context);
  const { SEnvEvent, SEnvMutationEvent, SEnvWindowOpenedEvent, SEnvURIChangedEvent, SEnvWindowEvent } = getSEnvEventClasses(context);

  const { SEnvCSSFontFace, SEnvCSSKeyframesRule, SEnvCSSMediaRule, SEnvCSSStyleRule, SEnvUnknownGroupingRule } = getSEnvCSSRuleClasses(context);

  const SEnvCSSStyleDeclaration = getSEnvCSSStyleDeclarationClass(context);
  const SEnvCSSStyleSheet = getSEnvCSSStyleSheetClass(context);

  // register default HTML tag names
  const TAG_NAME_MAP = getSEnvHTMLElementClasses(context);

  class SEnvNavigator implements Navigator {
    readonly appCodeName: string = "Tandem";
    readonly appName: string = "Tandem";
    readonly appVersion: string = "1.0";
    readonly platform: string = "Tandem";
    readonly product: string = "Tandem";
    readonly productSub: string = "tandem";
    readonly userAgent: string = "Tandem";
    readonly vendor: string = "Tandem";
    readonly vendorSub: string = "Tandem";
    readonly authentication: WebAuthentication;
    readonly cookieEnabled: boolean = true;
    readonly onLine: boolean = true;
    readonly geolocation: Geolocation;
    gamepadInputEmulation: GamepadInputEmulationType;
    readonly language: string = "en/us";
    readonly maxTouchPoints: number = 0;
    readonly mimeTypes: MimeTypeArray;
    readonly msManipulationViewsEnabled: boolean;
    readonly msMaxTouchPoints: number;
    readonly msPointerEnabled: boolean;
    readonly plugins: PluginArray = [] as any;
    readonly pointerEnabled: boolean;
    readonly serviceWorker: ServiceWorkerContainer;
    readonly webdriver: boolean;
    readonly hardwareConcurrency: number;
    readonly languages: string[] = ["en/us"];
    readonly mediaDevices: MediaDevices;
    getUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void {
      throwUnsupportedMethod();
    }
    sendBeacon(url: USVString, data?: BodyInit): boolean {
      throwUnsupportedMethod();
      return false;
    }
    msSaveBlob(blob: any, defaultName?: string): boolean {
      throwUnsupportedMethod();
      return false;
    }
    msSaveOrOpenBlob(blob: any, defaultName?: string): boolean {
      throwUnsupportedMethod();
      return false;
    }
    getGamepads(): Gamepad[] {
      throwUnsupportedMethod();
      return [];
    }
    javaEnabled(): boolean {
      return false;
    }
    msLaunchUri(uri: string, successCallback?: MSLaunchUriCallback, noHandlerCallback?: MSLaunchUriCallback): void {
      
      throwUnsupportedMethod();
    }
    requestMediaKeySystemAccess(keySystem: string, supportedConfigurations: MediaKeySystemConfiguration[]): Promise<MediaKeySystemAccess> {
      return null;
    }
    vibrate(pattern: number | number[]): boolean {
      throwUnsupportedMethod();
      return false;
    }
    confirmSiteSpecificTrackingException(args: ConfirmSiteSpecificExceptionsInformation): boolean {
      throwUnsupportedMethod();
      return false;
    }
    confirmWebWideTrackingException(args: ExceptionInformation): boolean {
      throwUnsupportedMethod();
      return false;
    }
    removeSiteSpecificTrackingException(args: ExceptionInformation): void {
      throwUnsupportedMethod();
    }
    removeWebWideTrackingException(args: ExceptionInformation): void {
      throwUnsupportedMethod();
    }
    storeSiteSpecificTrackingException(args: StoreSiteSpecificExceptionsInformation): void {
      throwUnsupportedMethod();
    }
    storeWebWideTrackingException(args: StoreExceptionsInformation): void {
      throwUnsupportedMethod();
    }
  }

  return class SEnvWindow extends SEnvEventTarget implements SEnvWindowInterface {

    readonly location: Location;
    private _selector: any;
    private _renderer: SyntheticWindowRendererInterface;
    private _animationFrameRequests: Function[];

    readonly sessionStorage: Storage;
    readonly localStorage: Storage;
    readonly console: Console = context.console;
    readonly indexedDB: IDBFactory;
    readonly applicationCache: ApplicationCache;
    readonly $synthetic = true;
    readonly caches: CacheStorage;
    readonly clientInformation: Navigator;
    public externalResourceUris: string[];
    readonly implementation: DOMImplementation;
    uid: string;
    closed: boolean;
    readonly crypto: Crypto;
    defaultStatus: string;
    readonly devicePixelRatio: number;
    readonly document: SEnvDocumentInterface;
    readonly doNotTrack: string;
    event: Event | undefined;
    readonly URIChangedEvent: any;
    readonly external: External;
    readonly frameElement: Element;
    readonly frames: Window;
    readonly history: History;
    innerHeight: number;
    innerWidth: number;
    readonly isSecureContext: boolean;
    readonly length: number;
    readonly locationbar: BarProp;
    readonly menubar: BarProp;
    readonly msContentScript: ExtensionScriptApis;
    readonly msCredentials: MSCredentials;
    name: string = "";
    readonly navigator: Navigator;
    offscreenBuffering: string | boolean;
    onabort: (this: Window, ev: UIEvent) => any;
    onafterprint: (this: Window, ev: Event) => any;
    onbeforeprint: (this: Window, ev: Event) => any;
    onbeforeunload: (this: Window, ev: BeforeUnloadEvent) => any;
    onblur: (this: Window, ev: FocusEvent) => any;
    oncanplay: (this: Window, ev: Event) => any;
    oncanplaythrough: (this: Window, ev: Event) => any;
    onchange: (this: Window, ev: Event) => any;
    onclick: (this: Window, ev: MouseEvent) => any;
    oncompassneedscalibration: (this: Window, ev: Event) => any;
    oncontextmenu: (this: Window, ev: PointerEvent) => any;
    ondblclick: (this: Window, ev: MouseEvent) => any;
    ondevicelight: (this: Window, ev: DeviceLightEvent) => any;
    ondevicemotion: (this: Window, ev: DeviceMotionEvent) => any;
    ondeviceorientation: (this: Window, ev: DeviceOrientationEvent) => any;
    ondrag: (this: Window, ev: DragEvent) => any;
    ondragend: (this: Window, ev: DragEvent) => any;
    ondragenter: (this: Window, ev: DragEvent) => any;
    ondragleave: (this: Window, ev: DragEvent) => any;
    ondragover: (this: Window, ev: DragEvent) => any;
    ondragstart: (this: Window, ev: DragEvent) => any;
    ondrop: (this: Window, ev: DragEvent) => any;
    ondurationchange: (this: Window, ev: Event) => any;
    onemptied: (this: Window, ev: Event) => any;
    onended: (this: Window, ev: MediaStreamErrorEvent) => any;
    onerror: ErrorEventHandler;
    onfocus: (this: Window, ev: FocusEvent) => any;
    onhashchange: (this: Window, ev: HashChangeEvent) => any;
    oninput: (this: Window, ev: Event) => any;
    oninvalid: (this: Window, ev: Event) => any;
    onkeydown: (this: Window, ev: KeyboardEvent) => any;
    onkeypress: (this: Window, ev: KeyboardEvent) => any;
    onkeyup: (this: Window, ev: KeyboardEvent) => any;
    onload: (this: Window, ev: Event) => any;
    onloadeddata: (this: Window, ev: Event) => any;
    onloadedmetadata: (this: Window, ev: Event) => any;
    onloadstart: (this: Window, ev: Event) => any;
    onmessage: (this: Window, ev: MessageEvent) => any;
    onmousedown: (this: Window, ev: MouseEvent) => any;
    onmouseenter: (this: Window, ev: MouseEvent) => any;
    onmouseleave: (this: Window, ev: MouseEvent) => any;
    onmousemove: (this: Window, ev: MouseEvent) => any;
    onmouseout: (this: Window, ev: MouseEvent) => any;
    onmouseover: (this: Window, ev: MouseEvent) => any;
    onmouseup: (this: Window, ev: MouseEvent) => any;
    onmousewheel: (this: Window, ev: WheelEvent) => any;
    onmsgesturechange: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturedoubletap: (this: Window, ev: MSGestureEvent) => any;
    onmsgestureend: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturehold: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturestart: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturetap: (this: Window, ev: MSGestureEvent) => any;
    onmsinertiastart: (this: Window, ev: MSGestureEvent) => any;
    onmspointercancel: (this: Window, ev: MSPointerEvent) => any;
    onmspointerdown: (this: Window, ev: MSPointerEvent) => any;
    onmspointerenter: (this: Window, ev: MSPointerEvent) => any;
    onmspointerleave: (this: Window, ev: MSPointerEvent) => any;
    onmspointermove: (this: Window, ev: MSPointerEvent) => any;
    onmspointerout: (this: Window, ev: MSPointerEvent) => any;
    onmspointerover: (this: Window, ev: MSPointerEvent) => any;
    onmspointerup: (this: Window, ev: MSPointerEvent) => any;
    onoffline: (this: Window, ev: Event) => any;
    ononline: (this: Window, ev: Event) => any;
    onorientationchange: (this: Window, ev: Event) => any;
    onpagehide: (this: Window, ev: PageTransitionEvent) => any;
    onpageshow: (this: Window, ev: PageTransitionEvent) => any;
    onpause: (this: Window, ev: Event) => any;
    onplay: (this: Window, ev: Event) => any;
    onplaying: (this: Window, ev: Event) => any;
    onpopstate: (this: Window, ev: PopStateEvent) => any;
    onprogress: (this: Window, ev: ProgressEvent) => any;
    onratechange: (this: Window, ev: Event) => any;
    onreadystatechange: (this: Window, ev: ProgressEvent) => any;
    onreset: (this: Window, ev: Event) => any;
    onresize: (this: Window, ev: UIEvent) => any;
    onscroll: (this: Window, ev: UIEvent) => any;
    onseeked: (this: Window, ev: Event) => any;
    onseeking: (this: Window, ev: Event) => any;
    onselect: (this: Window, ev: UIEvent) => any;
    onstalled: (this: Window, ev: Event) => any;
    onstorage: (this: Window, ev: StorageEvent) => any;
    onsubmit: (this: Window, ev: Event) => any;
    onsuspend: (this: Window, ev: Event) => any;
    ontimeupdate: (this: Window, ev: Event) => any;
    ontouchcancel: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchstart: (ev: TouchEvent) => any;
    onunload: (this: Window, ev: Event) => any;
    onvolumechange: (this: Window, ev: Event) => any;
    onwaiting: (this: Window, ev: Event) => any;
    onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
    opener: any;
    orientation: string | number;
    readonly outerHeight: number;
    readonly outerWidth: number;
    readonly pageXOffset: number;
    readonly pageYOffset: number;
    readonly parent: Window;
    readonly performance: Performance;
    readonly personalbar: BarProp;
    screen: Screen;
    screenLeft: number;
    screenTop: number;
    screenX: number;
    screenY: number;
    readonly scrollbars: BarProp;
    scrollX: number = 0;
    scrollY: number = 0;
    readonly self: Window;
    readonly speechSynthesis: SpeechSynthesis;
    status: string;
    readonly statusbar: BarProp;
    readonly CustomEvent: typeof Event = SEnvEvent as any as typeof Event;
    readonly styleMedia: StyleMedia;
    readonly toolbar: BarProp;
    readonly top: SEnvWindowInterface;
    readonly window: SEnvWindowInterface;
    readonly getProxyUrl: (url: string) => string;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
    Blob: typeof Blob;
    readonly customElements: CustomElementRegistry;
    private _struct: SyntheticWindow;

    private _scrollRect: Rectangle = { width: Infinity, height: Infinity };

    // classes
    readonly EventTarget: typeof EventTarget = SEnvEventTarget;
    readonly Element: typeof Element = SEnvElement;
    readonly HTMLElement: typeof HTMLElement = SEnvHTMLElement;
    fetch: Fetch;
    private _childWindowCount: number = 0;
    private _timers: SEnvTimersInterface;
    private _matchMedia: any;
    public $id: string;

    readonly CSSFontFaceRule: typeof CSSFontFaceRule;
    readonly CSSKeyframesRule: typeof CSSKeyframesRule;
    readonly CSSKeyframeRule: typeof CSSKeyframeRule;
    readonly CSSMediaRule: typeof CSSMediaRule;
    readonly CSSStyleRule: typeof CSSStyleRule;
    readonly UnknownGroupingRule: typeof CSSGroupingRule;
    readonly CSSStyleDeclaration: typeof CSSStyleDeclaration;
    readonly CSSStyleSheet: typeof CSSStyleSheet;
    
    constructor(origin: string, top?: SEnvWindowInterface) {
      super();

      this._onRendererPainted = this._onRendererPainted.bind(this);
      this.clearImmediate = this.clearImmediate.bind(this);
      this.clearTimeout = this.clearTimeout.bind(this);
      this.clearInterval = this.clearInterval.bind(this);
      this.setImmediate = this.setImmediate.bind(this);
      this.setTimeout = this.setTimeout.bind(this);
      this.setInterval = this.setInterval.bind(this);
      this._timers = new SEnvTimers();
      
      this.CSSFontFaceRule = SEnvCSSFontFace as any;
      this.CSSKeyframesRule = SEnvCSSKeyframesRule as any;
      this.CSSKeyframeRule = SEnvCSSStyleRule as any;
      this.CSSMediaRule = SEnvCSSMediaRule as any;
      this.CSSStyleRule = SEnvCSSStyleRule as any;
      this.UnknownGroupingRule = SEnvUnknownGroupingRule as any;
      this.CSSStyleDeclaration = SEnvCSSStyleDeclaration as any;
      this.CSSStyleSheet = SEnvCSSStyleSheet as any;

      this.implementation = new SEnvDOMImplementation(this);

      this.URIChangedEvent = SEnvURIChangedEvent;
      this.uid = this.$id = generateDefaultId();
      this.location = new SEnvLocation(origin, context.reload);
      this.window   = this.self = this;
      this.top = top || this;
      this.localStorage = new SEnvLocalStorage([]);
      this.innerWidth = DEFAULT_WINDOW_WIDTH;
      this.innerHeight = DEFAULT_WINDOW_HEIGHT;
      this.moveTo(0, 0);
      this.externalResourceUris = [];

      this.navigator = new SEnvNavigator();
      
      this.fetch = async (info) => {
        let inf = String(info);
        if (!/^http/.test(inf) && /^http/.test(origin)) {
          if (inf.charAt(0) !== "/") {
            const dir = this.location.pathname.split("/");
            dir.pop();
            inf = dir.join("/") + inf;
          }
          inf = this.location.protocol + "//" + this.location.host + inf;
        }
        const fetchPromise = fetch(inf);
        const ret = await fetchPromise;
        this.$setExternalUris([...this.externalResourceUris, info as string]);
        return ret;
      }

      const customElements = this.customElements = new SEnvCustomElementRegistry(this);
      for (const tagName in TAG_NAME_MAP) {
        customElements.define(tagName, TAG_NAME_MAP[tagName]);
      }
      
      this._matchMedia =  createMediaMatcher(this);
      this.document = this.implementation.createHTMLDocument(null) as SEnvDocumentInterface;
      this.renderer = (createRenderer || createNoopRenderer)(this);

      this.document.addEventListener(SEnvMutationEvent.MUTATION, this._onDocumentMutation.bind(this));
    }

    getSourceUri(uri: string) {
      return uri;
    }
    
    didChange() {
      this._struct = undefined;
    }

    get renderer() {
      return this._renderer;
    }

    set renderer(value: SyntheticWindowRendererInterface) {
      if (this._renderer) {
        this._renderer.removeEventListener(SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
      }
      this._renderer = value;
      this._renderer.addEventListener(SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
    }

    $setExternalUris (uris: string[]) {
      this.externalResourceUris = [...uris];
      this._struct = undefined;
      this.dispatchEvent(new SEnvWindowEvent(SEnvWindowEvent.EXTERNAL_URIS_CHANGED));
    }

    get struct() {
      if (!this._struct) {
        this._struct = createSyntheticWindow({
          $id: this.$id,
          location: this.location.toString(),
          document: this.document.struct,
          instance: this,
          renderContainer: this.renderer.container,
          externalResourceUris: [...this.externalResourceUris],
          scrollPosition: {
            left: this.scrollX,
            top: this.scrollY,
          },
          bounds: {
            left: this.screenLeft,
            top: this.screenTop,
            right: this.screenLeft + this.innerWidth,
            bottom: this.screenTop + this.innerHeight
          }
        });
      }
      return this._struct;
    }

    dispose() {
      this.renderer.dispose();
      this._timers.dispose();
    }

    get $selector(): any {
      if (this._selector) return this._selector;
      
      this._selector = nwmatcher(this);

      // VERBOSITY = false to prevent breaking on invalid selector rules
      this._selector.configure({ CACHING: true, VERBOSITY: false });

      return this._selector;
    }

    reloadWhenUrisChange(uris: string[]) {
      this.$setExternalUris([ ...this.externalResourceUris, ...uris]);
    }

    alert(message?: any): void { }
    blur(): void { }
    cancelAnimationFrame(handle: number): void { }
    captureEvents(): void { }
    close(): void {
      this.closed = true;
      const event = new SEnvEvent();
      event.initEvent("close", true, true);
      this.dispatchEvent(event);
    }

    confirm(message?: string): boolean {
      return false;
    }

    atob(encodedString: string): string {
      this._throwUnsupportedMethod();
      return null;
    }

    btoa(rawString: string): string {
      this._throwUnsupportedMethod();
      return null;
    }


    departFocus(navigationReason: NavigationReason, origin: FocusNavigationOrigin): void {
      
    }

    focus(): void {

    }
    getComputedStyle(elt: SEnvElementInterface, pseudoElt?: string): CSSStyleDeclaration {
      return this.renderer.getComputedStyle(elt);
    }

    getMatchedCSSRules(elt: Element, pseudoElt?: string): CSSRuleList {
      this._throwUnsupportedMethod();
      return null;
    }

    getSelection(): Selection {
      this._throwUnsupportedMethod();
      return null;
    }

    matchMedia(mediaQuery: string): MediaQueryList {
      return {
        matches: this._matchMedia(mediaQuery),
        media: mediaQuery,
        addListener: null,
        removeListener: null,
      };
    }

    clearInterval(handle: number): void {
      return this._timers.clearInterval(handle);
    }

    clearTimeout(handle: number): void {
      return this._timers.clearTimeout(handle);
    }

    setInterval(handler, ms: number, ...args): number {
      return this._timers.setInterval(handler, ms, ...args);
    }

    clone(deep?: boolean) {
      const window = new SEnvWindow(this.location.toString(), this.top === this ? null : this.top);
      window.$id = this.$id;
      if (deep !== false) {
        window.document.$id = this.document.$id;
        patchWindow(window, diffWindow(window, this));
      }
      window.renderer.start();
      return window;
    }


    setTimeout(handler, ms, ...args): number {
      return this._timers.setTimeout(handler, ms, ...args);
    }

    clearImmediate(handle: number): void {
      return this._timers.clearImmediate(handle);
    }

    setImmediate(handler): number {
      return this._timers.setImmediate(handler);
    }

    moveBy(x?: number, y?: number): void {

    }

    moveTo(x: number = this.screenLeft, y: number = this.screenTop): void {
      x = x && Math.round(x);
      y = y && Math.round(y);
      if (x === this.screenLeft && y === this.screenTop) {
        return;
      }
      this.screenLeft = this.screenY = x;
      this.screenTop  = this.screenX = y;
      this.didChange();
      const e = new SEnvEvent();
      e.initEvent("move", true, true);
      this.dispatchEvent(e);
    }

    msWriteProfilerMark(profilerMarkName: string): void {

    }

    open(url?: string, target?: string, features?: string, replace?: boolean): Window {

      const windowId = this.$id + "." + (++this._childWindowCount);

      const open = () => {

        const SEnvWindow = getSEnvWindowClass({ console, fetch, reload: open });
        
        const window = new SEnvWindow(url);
        window.$id = windowId;
        window.document.$id = window.$id + "-document";
        window.$load();
        const event = new SEnvWindowOpenedEvent();
        event.initWindowOpenedEvent(window);
        this.dispatchEvent(event);

        return window;
      };

      return open();
    }

    postMessage(message: any, targetOrigin: string, transfer?: any[]): void {

    }

    print(): void {

    }

    prompt(message?: string, _default?: string): string | null {
      this._throwUnsupportedMethod();
      return null;
    }

    releaseEvents(): void {

    }

    requestAnimationFrame(callback: FrameRequestCallback): number {
      if (!this._animationFrameRequests) {
        this._animationFrameRequests = [];
      }

      this._animationFrameRequests.push(callback);

      return -1;
    }

    resizeBy(x?: number, y?: number): void {

    }

    resizeTo(x: number = this.innerWidth, y: number = this.innerHeight): void {
      x = x && Math.round(x);
      y = y && Math.round(y);
      if (x === this.innerWidth && y === this.innerHeight) {
        return;
      }
      this.innerWidth = x;
      this.innerHeight = y;
      this.didChange();
      const event = new SEnvEvent();
      event.initEvent("resize", true, true);
      this.dispatchEvent(event);
    }

    scroll(...args): void {
      this.scrollTo(...args);
    }

    scrollBy(...args): void {

    }

    protected _throwUnsupportedMethod() {
      throw new Error("This node type does not support this method.");
    }

    scrollTo(...args): void {

      let left: number;
      let top: number;

      // scroll with options
      if (typeof args[0] === "object") {

      } else {
        [left, top] = args;
      }

      // TODO - use computed bounds here too
      left = clamp(left, 0, this._scrollRect.width);
      top  = clamp(top, 0, this._scrollRect.height);

      const oldScrollX = this.scrollX;
      const oldScrollY = this.scrollY;

      // no change
      if (oldScrollX === left && oldScrollY === top) {
        return;
      }
    

      this.scrollX = left;
      this.scrollY = top;
      
      const event = new SEnvEvent();
      event.initEvent("scroll", true, true);
      this.dispatchEvent(event);
    }

    stop(): void {

    }

    webkitCancelAnimationFrame(handle: number): void {

    }

    webkitConvertPointFromNodeToPage(node: Node, pt: WebKitPoint): WebKitPoint {
      this._throwUnsupportedMethod();
      return null;
    }

    webkitConvertPointFromPageToNode(node: Node, pt: WebKitPoint): WebKitPoint {
      this._throwUnsupportedMethod();
      return null;
    }

    webkitRequestAnimationFrame(callback: FrameRequestCallback): number {
      this._throwUnsupportedMethod();
      return -1;
    }

    createImageBitmap(...args) {
      return Promise.reject(null);
    }

    async $load() {
      const location = this.location.toString();
      this.renderer.start();
      if (location) {
        const response = await this.fetch(location);
        const content  = await response.text();
        await this.document.$load(content);
      } else {
        await this.document.$load("");
      }
    }

    private _onDocumentMutation(event: SEnvMutationEventInterface) {
      this.didChange();
      const eventClone = new SEnvMutationEvent();
      eventClone.initMutationEvent(event.mutation);
      this.dispatchEvent(eventClone);
    }

    protected _onRendererPainted(event: SyntheticWindowRendererEvent) {
      this._scrollRect = event.scrollRect;

      // sync scroll position that may have changed
      // during window resize, otherwise 
      this.scrollTo(event.scrollPosition.left, event.scrollPosition.top);

      if (this._animationFrameRequests) {
        const animationFrameRequests = this._animationFrameRequests;
        this._animationFrameRequests = [];
        for (let i = 0, n = animationFrameRequests.length; i < n; i++) {
          animationFrameRequests[i]();
        }
      }
    }
  }
});

export const openSyntheticEnvironmentWindow = (location: string, context: SEnvWindowContext) => {
  const SEnvWindow = getSEnvWindowClass(context);
  const window = new SEnvWindow(location);
  window.$load();
  return window;
}

export const diffWindow = (oldWindow: SEnvWindowInterface, newWindow: SEnvWindowInterface) => { 
  return diffDocument(oldWindow.document, newWindow.document);
};

export const flattenWindowObjectSources = (window: SyntheticWindow) => {
  if (!window.document) {
    return {};
  }
  return flattenDocumentSources(window.document);
};

export const windowMutators = {
  ...documentMutators
};

export const patchWindow = (oldWindow: SEnvWindowInterface, mutations: Mutation<any>[]) => {
  const childObjects = flattenWindowObjectSources(oldWindow.struct);
  for (const mutation of mutations) {
    const target = childObjects[mutation.target.$id];
    if (!target) {
      throw new Error(`Unable to find target for mutation ${mutation.type}`);
    }

    const mutate = windowMutators[mutation.type] as Mutator<any, any>;

    if (!mutate) {
      throw new Error(`Unable to find window mutator for ${mutation.type}`);
    }

    mutate(target, mutation);
  }
}

/**
 * Synchronizes IDs between two windows to ensure that future mutations sync 
 * properly - seen window mirror impl.
 */

export const syncWindowIds = (sourceWindow: SEnvWindowInterface, targetWindow: SEnvWindowInterface) => {
  const sourceChildObjects = flattenWindowObjectSources(sourceWindow.struct);
  const targetChildObjects = flattenWindowObjectSources(targetWindow.struct);

  const sids = Object.keys(sourceChildObjects);
  const tids = Object.keys(targetChildObjects);


  if (sids.length !== tids.length) {  
    throw new Error(`child object count missmatch. Cannot synchronize ids`);
  }

  // source & target windows should be synchronized, so it should
  // okay to just copy IDs over
  for (let i = 0, n = sids.length; i < n; i++) {
    const sco = sourceChildObjects[sids[i]];
    const nco = targetChildObjects[tids[i]];

    if (sco.$id === nco.$id) {
      continue;
    }

    if (sco.struct.type !== nco.struct.type) {
      throw new Error(`Cannot set $id from type ${sco.struct.type} to type ${nco.struct.type}.`);
    }
    
    // TODO - assert the type here --- should be identical
    nco.$id = sco.$id;
  }

}