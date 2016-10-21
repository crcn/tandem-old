
import {
  parseCSS,
  evaluateCSS,
  IMarkupEdit,
  SyntheticBrowser,
  SyntheticDocument,
  ISyntheticBrowser,
  BaseDOMNodeEntity,
  SyntheticDOMElement,
  SyntheticDOMRenderer,
  SyntheticHTMLElement,
  BaseDecoratorRenderer,
  RemoteSyntheticBrowser,
  SyntheticRendererAction,
  SyntheticCSSStyleSheet,
  BaseVisibleDOMNodeEntity,
  DOMNodeEntityCapabilities,
  ISyntheticDocumentRenderer,
} from "@tandem/synthetic-browser";

import { IFileResolver, FileResolverDependency } from "@tandem/sandbox";

import { pick } from "lodash";
import * as path from "path";
import * as React from "react";
import { WrapBus } from "mesh";
import { VisibleHTMLEntity } from "@tandem/html-extension";
import { watchProperty, IActor, Action, inject } from "@tandem/common";

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

// TODOS:
// - [ ] userAgent attribute
// - [ ] location attribute
// - [ ] preset attribute
// - [ ] fixtures
export class TDArtboardEntity extends VisibleHTMLEntity {

  private _artboardBrowser: ISyntheticBrowser;
  private _combinedStyleSheet: SyntheticCSSStyleSheet;
  private _artboardBrowserObserver: IActor;
  private _documentStyleSheetObserver: IActor;

  constructor(source: SyntheticHTMLElement) {
    super(source);
    this._documentStyleSheetObserver = new WrapBus(this.onDocumentStyleSheetsAction.bind(this));
    // this._artboardBrowserObserver = new WrapBus(this.onArtboardBrowserAction.bind(this));
  }

  evaluate() {
    const ownerDocument = this.source.ownerDocument as SyntheticDocument;

    // TODO - this is a nono - mutating the source document. Need to find another way to inject
    // styles into the DOM renderer.
    if (ownerDocument.styleSheets.indexOf(DEFAULT_FRAME_STYLE_SHEET) === -1) {
      ownerDocument.styleSheets.push(DEFAULT_FRAME_STYLE_SHEET);
    }

    ownerDocument.styleSheets.observe(this._documentStyleSheetObserver);

    if (!this._artboardBrowser) {
      const documentRenderer = new SyntheticDOMRenderer();
      this._artboardBrowser = new RemoteSyntheticBrowser(ownerDocument.defaultView.browser.dependencies, new SyntheticFrameRenderer(this, documentRenderer), this.browser);
      // this._artboardBrowser.observe(this._artboardBrowserObserver)
      watchProperty(this._artboardBrowser, "window", this.onBrowserWindowChange.bind(this));
      watchProperty(this._artboardBrowser, "documentEntity", this.onBrowserDocumentEntityChange.bind(this));
    }

    if (this.source.hasAttribute("src")) {
      const src = this.source.getAttribute("src");
      const window = ownerDocument.defaultView;
      this._artboardBrowser.open(this.source.bundle.getAbsoluteDependencyPath(src));
    }
  }

  get title(): string {
    return this.change.getAttribute("title");
  }

  // protected onVisibilityChange() {
  //   if (this.visible) {
  //     this._artboardBrowser.sandbox.resume();
  //   } else {
  //     this._artboardBrowser.sandbox.pause();
  //   }
  // }

  set title(value: string) {
    this.change.setAttribute("title", value);
  }

  get layerChildren() {
    return this._artboardBrowser && this._artboardBrowser.bodyEntity && this._artboardBrowser.bodyEntity.children;
  }

  get capabilities() {
    return new DOMNodeEntityCapabilities(true, true);
  }

  get contentDocument() {
    return this._artboardBrowser.documentEntity;
  }

  get inheritCSS() {
    return this.change.hasAttribute("inherit-css");
  }

  protected onBrowserDocumentEntityChange() {
    while (this.firstChild) this.removeChild(this.firstChild);
    this.appendChild(this._artboardBrowser.documentEntity);
  }

  protected onDocumentStyleSheetsAction(action: Action) {
    this.injectCSS();
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

  // protected onArtboardBrowserAction(action: Action) {
  //   if (action.type === SyntheticRendererAction.UPDATE_RECTANGLES) {
  //     this.notify(action);
  //   }
  // }

  protected onBrowserWindowChange() {
    this.injectCSS();
  }

  targetDidMount() {
    const iframe = this.target.querySelector("iframe") as HTMLIFrameElement;

    const onload = () => {
      iframe.contentDocument.body.appendChild(this._artboardBrowser.renderer.element);

      // re-render the renderer so that it can make proper bounding rect calculations
      // on the native DOM.
      this._artboardBrowser.renderer.requestUpdate();
    };

    iframe.onload = onload;
    if (iframe.contentDocument) onload();
  }

  render() {
    return <div className="artboard-entity" {...pick(this.renderAttributes(), ["style", "id", "className", "data-uid", "key"])}>
      <iframe />
      <div className="artboard-entity-overlay" />
    </div>;
  }
}

export class SyntheticFrameRenderer extends BaseDecoratorRenderer {
  constructor(private _frame: TDArtboardEntity, _renderer: ISyntheticDocumentRenderer) {
    super(_renderer);
  }
  getBoundingRect(uid: string) {
    const rect = this._renderer.getBoundingRect(uid);
    const offset = this._frame.source.getBoundingClientRect();
    return rect.move({ left: offset.left, top: offset.top });
  }
}