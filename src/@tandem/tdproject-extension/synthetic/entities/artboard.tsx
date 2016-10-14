
import {
  parseCSS,
  evaluateCSS,
  IMarkupEdit,
  SyntheticBrowser,
  SyntheticDocument,
  BaseDOMNodeEntity,
  SyntheticDOMElement,
  SyntheticDOMRenderer,
  SyntheticHTMLElement,
  BaseDecoratorRenderer,
  SyntheticCSSStyleSheet,
  BaseVisibleDOMNodeEntity,
  DOMNodeEntityCapabilities,
  ISyntheticDocumentRenderer,
} from "@tandem/synthetic-browser";

import { SandboxAction } from "@tandem/sandbox";

import { pick } from "lodash";
import * as React from "react";
import { WrapBus } from "mesh";
import { VisibleHTMLEntity } from "@tandem/html-extension";
import { watchProperty, IActor, Action } from "@tandem/common";

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

  private _artboardBrowser: SyntheticBrowser;
  private _artboardBrowserObserver: IActor;

  async evaluate() {

    const ownerDocument = this.source.ownerDocument;

    // TODO - possibly move this logic to the parent where it checks for the default style sheet & automatically
    // injects it into the document
    if (ownerDocument.styleSheets.indexOf(DEFAULT_FRAME_STYLE_SHEET) === -1) {
      ownerDocument.styleSheets.push(DEFAULT_FRAME_STYLE_SHEET);
    }

    if (!this._artboardBrowser) {
      const documentRenderer = new SyntheticDOMRenderer();
      this._artboardBrowser = new SyntheticBrowser(ownerDocument.defaultView.browser.dependencies, new SyntheticFrameRenderer(this, documentRenderer), this.browser);
      this._artboardBrowser.observe(this._artboardBrowserObserver = new WrapBus(this.onArtboardBrowserAction.bind(this)));
      watchProperty(this._artboardBrowser, "window", this.onBrowserWindowChange.bind(this));
      watchProperty(this._artboardBrowser, "documentEntity", this.onBrowserDocumentEntityChange.bind(this));
    }

    if (this.source.hasAttribute("src")) {
      const src = this.source.getAttribute("src");
      const window = ownerDocument.defaultView;
      const absolutePath = await window.sandbox.importer.resolve(src, window.location.toString());
      await this._artboardBrowser.open(absolutePath);
    }
  }

  get title(): string {
    return this.change.getAttribute("title");
  }

  set title(value: string) {
    this.change.setAttribute("title", value);
  }

  get layerChildren() {
    return this._artboardBrowser && this._artboardBrowser.bodyEntity.children;
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

  get inheritGlobals() {
    return this.change.getAttribute("inherit-globals");
  }

  protected onBrowserDocumentEntityChange() {
    while (this.firstChild) this.removeChild(this.firstChild);
    this.appendChild(this._artboardBrowser.documentEntity);
  }

  protected onArtboardBrowserAction(action: Action) {
    if (action.type === SandboxAction.OPENED_MAIN_ENTRY) {
      this.onArtboardBrowserRevaluated();
    }

    // bubble actions up to the root
    this.notify(action);
  }

  protected renderEntityAttributes() {

    // todo - add presets here
    return super.renderEntityAttributes();
  }

  protected onBrowserWindowChange() {

    let childWindowProps = {};

    // these frame props accessible in the child window
    for (const attribute of this.change.attributes) {
      childWindowProps[attribute.name] = attribute.value;
    }

    let inheritGlobalKey = this.inheritGlobals;
    if (inheritGlobalKey === "" || inheritGlobalKey === true) {
      inheritGlobalKey = "window";
    }

    if (inheritGlobalKey) {
      childWindowProps = Object.assign({}, this.browser.window[inheritGlobalKey], childWindowProps);
    }

    for (const key in childWindowProps) {

      // respect scope here -- do not override any properties that currently exist
      if (this._artboardBrowser.window[key] != null) continue;
      this._artboardBrowser.window[key] = childWindowProps[key];
    }
  }

  protected onArtboardBrowserRevaluated() {
    if (this.inheritCSS) {
      this._artboardBrowser.document.styleSheets.push(...this.browser.document.styleSheets);
    }
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