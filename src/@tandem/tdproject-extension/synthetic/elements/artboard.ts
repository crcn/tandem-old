import * as path from "path";

import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { debounce } from "lodash";

import {
  Action,
  Status,
  isMaster,
  bindable,
  ITreeWalker,
  serializable,
  BoundingRect,
  bindProperty,
  watchProperty,
} from "@tandem/common";

import {
  parseCSS,
  evaluateCSS,
  DOMNodeEvent,
  DOMMutationEvent,
  ISyntheticBrowser,
  SyntheticDocument,
  isDOMMutationEvent,
  SyntheticHTMLElement,
  BaseDecoratorRenderer,
  SyntheticDOMRenderer,
  SyntheticCSSStyleSheet,
  RemoteSyntheticBrowser,
  SyntheticRendererAction,
  VisibleDOMNodeCapabilities,
  ISyntheticDocumentRenderer,
} from "@tandem/synthetic-browser";

// default CSS styles to inject into the synthetic document
const DEFAULT_FRAME_STYLE_SHEET = evaluateCSS(parseCSS(`
  .artboard-entity {
    width: 1024px;
    height: 768px;
    position: absolute;
  }

  .artboard-entity iframe, .artboard-entity-overlay {
    border: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .artboard-entity-overlay {
    background: transparent;
  }
`));

// TODO - watch src for any changes
@serializable()
export class SyntheticTDArtboardElement extends SyntheticHTMLElement {

  private _iframe: HTMLIFrameElement;
  private _contentDocument: SyntheticDocument;
  private _contentDocumentObserver: IDispatcher<any, any>;
  private _artboardBrowser: ISyntheticBrowser;
  private _combinedStyleSheet: SyntheticCSSStyleSheet;
  private _artboardBrowserObserver: IDispatcher<any, any>;

  @bindable(true)
  readonly status: Status = new Status(null);

  createdCallback() {
    this.setAttribute("class", "artboard-entity");
    this.innerHTML = `<iframe /><div class="artboard-entity-overlay" />`;
  }

  get contentDocument() {
    return this._contentDocument;
  }

  get title(): string {
    return this.getAttribute("title");
  }

  set title(value: string) {
    this.setAttribute("title", value);
  }

  attachedCallback() {
    if (this.ownerDocument.styleSheets.indexOf(DEFAULT_FRAME_STYLE_SHEET) === -1) {
      this.ownerDocument.styleSheets.push(DEFAULT_FRAME_STYLE_SHEET);
    }
  }

  attributeChangedCallback(key: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(key, oldValue, newValue);
    if (/src|strategy/.test(key)) {
      this.loadBrowser();
    }
  }

  async createBrowser() {
    if (this._artboardBrowser) return;

    const documentRenderer = new SyntheticDOMRenderer();
    this._artboardBrowser = new RemoteSyntheticBrowser(this.ownerDocument.defaultView.browser.injector, new SyntheticArtboardRenderer(this, documentRenderer), this.browser);
    bindProperty(this._artboardBrowser, "status", this, "status").trigger();
    this._contentDocumentObserver = new CallbackDispatcher(this.onContentDocumentAction.bind(this));
    watchProperty(this._artboardBrowser, "window", this.onBrowserWindowChange.bind(this));
    await this.loadBrowser();
  }

  protected computeCapabilities() {
    return new VisibleDOMNodeCapabilities(true, true);
  }

  private loadBrowser = debounce(async () => {
    if (!this._artboardBrowser) return;
    if (this.hasAttribute("src")) {
      const src = this.getAttribute("src");
      const window = this.ownerDocument.defaultView;
      this._artboardBrowser.open({
        url: this.getAttribute("src"),
        dependencyGraphStrategyOptions: {
          name: this.getAttribute("dependency-graph-strategy"),
          config: this.getAttribute("dependency-graph-config") && path.resolve(this.source.filePath, this.getAttribute("strategy-config"))
        }
      });
    }
  }, 0)

  attachNative(node: HTMLElement) {
    if (this._native === node) return;
    super.attachNative(node);
    this.createBrowser();
    const iframe = this._iframe = node.querySelector("iframe") as HTMLIFrameElement;

    const onload = async () => {
      iframe.contentDocument.body.appendChild(this._artboardBrowser.renderer.element);
      this._artboardBrowser.renderer.start();
    };

    iframe.onload = onload;
    if (iframe.contentDocument) onload();
  }

  get inheritCSS() {
    return this.hasAttribute("inherit-css");
  }

  protected injectCSS() {

    const document = this._artboardBrowser.document;
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

    this._contentDocument = this._artboardBrowser.window.document;
    this._contentDocument.$ownerNode = this;
    this._contentDocument.observe(this._contentDocumentObserver);
    this.injectCSS();

    // bubble loaded notification here
    this.notify(new DOMNodeEvent(DOMNodeEvent.DOM_NODE_LOADED));
  }

  protected onContentDocumentAction(action: Action) {
    this.notify(action);
  }
}

export class SyntheticArtboardRenderer extends BaseDecoratorRenderer {
  constructor(private _artboard: SyntheticTDArtboardElement, _renderer: ISyntheticDocumentRenderer) {
    super(_renderer);
  }
  getBoundingRect(uid: string): BoundingRect {
    const rect = this._renderer.getBoundingRect(uid);
    const offset = this._artboard.getBoundingClientRect();
    return rect.move({ left: offset.left, top: offset.top });
  }
}