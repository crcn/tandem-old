import "./artboard.scss";

import { WrapBus } from "mesh";
import { BundlerDependency } from "@tandem/sandbox";

import {
  IActor,
  Action,
  isMaster,
  ITreeWalker,
  serializable,
  watchProperty,
} from "@tandem/common";

import {
  parseCSS,
  evaluateCSS,
  DOMNodeAction,
  DOMMutationAction,
  ISyntheticBrowser,
  isDOMMutationAction,
  SyntheticHTMLElement,
  BaseDecoratorRenderer,
  SyntheticDocument,
  SyntheticDOMRenderer,
  SyntheticBrowserAction,
  SyntheticCSSStyleSheet,
  RemoteSyntheticBrowser,
  SyntheticRendererAction,
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

@serializable()
export class SyntheticTDArtboardElement extends SyntheticHTMLElement {

  private _initialized: boolean;
  private _iframe: HTMLIFrameElement;
  private _contentDocument: SyntheticDocument;
  private _contentDocumentObserver: IActor;
  private _artboardBrowser: ISyntheticBrowser;
  private _combinedStyleSheet: SyntheticCSSStyleSheet;
  private _artboardBrowserObserver: IActor;

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

  initialize() {
    if (this._initialized) return;
    this._initialized = true;

    const bundler = BundlerDependency.getInstance(this.browser.dependencies);

    if (!this._artboardBrowser) {
      const documentRenderer = new SyntheticDOMRenderer();
      this._artboardBrowser = new RemoteSyntheticBrowser(this.ownerDocument.defaultView.browser.dependencies, new SyntheticArtboardRenderer(this, documentRenderer), this.browser);
      this._contentDocumentObserver = new WrapBus(this.onContentDocumentAction.bind(this));
      // this._artboardBrowser.observe(this._artboardBrowserObserver = new WrapBus(this.onArtboardBrowserAction.bind(this)));
      watchProperty(this._artboardBrowser, "window", this.onBrowserWindowChange.bind(this));
    }

    if (this.hasAttribute("src")) {
      const src = this.getAttribute("src");
      const window = this.ownerDocument.defaultView;
      this._artboardBrowser.open(bundler.findByFilePath(this.source.filePath).getAbsoluteDependencyPath(src));
    }
  }

  attachNative(node: HTMLElement) {
    if (this._native === node) return;
    super.attachNative(node);
    this.initialize();
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
    this._contentDocument.observe(this._contentDocumentObserver);
    this.injectCSS();

    // bubble loaded notification here
    this.notify(new DOMNodeAction(DOMNodeAction.DOM_NODE_LOADED));
  }

  protected onContentDocumentAction(action: Action) {
    this.notify(action);
  }
}

export class SyntheticArtboardRenderer extends BaseDecoratorRenderer {
  constructor(private _artboard: SyntheticTDArtboardElement, _renderer: ISyntheticDocumentRenderer) {
    super(_renderer);
  }
  getBoundingRect(uid: string) {
    const rect = this._renderer.getBoundingRect(uid);
    const offset = this._artboard.getBoundingClientRect();
    return rect.move({ left: offset.left, top: offset.top });
  }
}