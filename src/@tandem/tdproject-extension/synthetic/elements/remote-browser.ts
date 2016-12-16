import path =  require("path");

import { CallbackDispatcher, IDispatcher, IMessage } from "@tandem/mesh";
import { debounce } from "lodash";

import {
  Status,
  isMaster,
  bindable,
  CoreEvent,
  ITreeWalker,
  serializable,
  BoundingRect,
  bindProperty,
  watchProperty,
  hasURIProtocol,
  bubbleHTMLIframeEvents,
} from "@tandem/common";

import {
  parseCSS,
  evaluateCSS,
  DOMNodeEvent,
  ISyntheticBrowser,
  SyntheticDocument,
  SyntheticHTMLElement,
  BaseDecoratorRenderer,
  SyntheticDOMRenderer,
  SyntheticCSSStyleSheet,
  RemoteSyntheticBrowser,
  SyntheticRendererEvent,
  VisibleDOMNodeCapabilities,
  ISyntheticDocumentRenderer,
} from "@tandem/synthetic-browser";

// TODO - watch src for any changes
@serializable("SyntheticRemoteBrowserElement")
export class SyntheticRemoteBrowserElement extends SyntheticHTMLElement {

  private _iframe: HTMLIFrameElement;
  private _contentDocument: SyntheticDocument;
  private _contentDocumentObserver: IDispatcher<any, any>;
  private _browser: ISyntheticBrowser;
  private _combinedStyleSheet: SyntheticCSSStyleSheet;
  private _browserObserver: IDispatcher<any, any>;

  @bindable(true)
  readonly status: Status = new Status(null);

  createdCallback() {

    Object.assign(this.style, {
      position: "absolute",
      width: "1024px",
      height: "1024px"
    }, this.style.toObject());  

    this.innerHTML = `
      <iframe data-td-selectable="false" style="border: none; width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;" />
    `;
  }

  get contentDocument() {
    return this._contentDocument;
  }

  get title(): string {
    return this.getAttribute("title");
  }

  get src() {
    return this.getAttribute("src");
  }

  set src(value) {
    this.setAttribute("src", value);
  }

  set title(value: string) {
    this.setAttribute("title", value);
  }

  attributeChangedCallback(key: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(key, oldValue, newValue);
    if (/src|strategy|inject/.test(key)) {
      this.loadBrowser();
    }
  }

  async createBrowser() {
    if (this._browser) return;

    const documentRenderer = new SyntheticDOMRenderer();
    this._browser = new RemoteSyntheticBrowser(this.ownerDocument.defaultView.browser.injector, new SyntheticRemoteBrowserRenderer(this, documentRenderer), this.browser);
    bindProperty(this._browser, "status", this, "status").trigger();
    this._contentDocumentObserver = new CallbackDispatcher(this.onContentDocumentEvent.bind(this));
    watchProperty(this._browser, "window", this.onBrowserWindowChange.bind(this));
    await this.loadBrowser();
  }

  protected computeCapabilities() {
    return new VisibleDOMNodeCapabilities(true, true);
  }

  private loadBrowser = debounce(async () => {
    if (!this._browser) return;
    if (this.hasAttribute("src")) {
      const src = this.getAttribute("src");
      const window = this.ownerDocument.defaultView;
      this._browser.open({
        uri: src,
        injectScript: decodeURIComponent(this.getAttribute("inject-script")),
        dependencyGraphStrategyOptions: {
          config: {
            rootDirectoryUri: hasURIProtocol(src) ? src : path.dirname(this.$source.uri)
          }
        }
      });
    }
  }, 0)

  attachNative(node: HTMLElement) {
    if (this._native === node) return;
    super.attachNative(node);
    this.createBrowser();
    const iframe = this._iframe = node.querySelector("iframe") as HTMLIFrameElement;
    bubbleHTMLIframeEvents(iframe);

    const onload = async () => {
      iframe.contentDocument.body.appendChild(this._browser.renderer.element);
      this._browser.renderer.start();
    };

    iframe.onload = onload;
    if (iframe.contentDocument) onload();
  }

  get inheritCSS() {
    return this.hasAttribute("inherit-css");
  }

  protected injectCSS() {

    const document = this._browser.document;
    if (!this.inheritCSS || !document) return;
    if (this._combinedStyleSheet) {
      const index = document.styleSheets.indexOf(this._combinedStyleSheet);
      if (index !== -1) {
        document.styleSheets.splice(index, 1);
      }
    }

    // combine the style sheets together to make it easier to replace when
    // the parent document changes.
    this._combinedStyleSheet = new SyntheticCSSStyleSheet([]);
    this.browser.document.styleSheets.forEach((styleSheet) => {
      this._combinedStyleSheet.rules.push(...styleSheet.rules);
    });
    document.styleSheets.push(this._combinedStyleSheet);
  }

  visitWalker(walker: ITreeWalker) {
    super.visitWalker(walker);
    if (this.contentDocument) {
      walker.accept(this.contentDocument);
    }
  }

  protected onBrowserWindowChange() {

    if (this._contentDocument) {
      this._contentDocument.unobserve(this._contentDocumentObserver);
    }

    this._contentDocument = this._browser.window.document;
    this._contentDocument.$ownerNode = this;
    this._contentDocument.observe(this._contentDocumentObserver);
    this.injectCSS();

    // bubble loaded notification here
    this.notify(new DOMNodeEvent(DOMNodeEvent.DOM_NODE_LOADED));
  }

  protected onContentDocumentEvent(event: CoreEvent) {
    this.notify(event);
  }
}

export class SyntheticRemoteBrowserRenderer extends BaseDecoratorRenderer {
  constructor(private _element: SyntheticRemoteBrowserElement, _renderer: ISyntheticDocumentRenderer) {
    super(_renderer);
  }
  getBoundingRect(uid: string): BoundingRect {
    const rect = this._renderer.getBoundingRect(uid);
    const offset = this._element.getBoundingClientRect();
    return rect.move({ left: offset.left, top: offset.top });
  }
}