
import {
  IMarkupEdit,
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticHTMLElement,
  SyntheticDOMRenderer,
  BaseDecoratorRenderer,
  SyntheticDOMCapabilities,
  BaseSyntheticDOMNodeEntity,
  SyntheticCSSStyleSheet,
  parseCSS,
  evaluateCSS,
  ISyntheticDocumentRenderer,
  BaseVisibleSyntheticDOMNodeEntity,
} from "@tandem/synthetic-browser";

import { SandboxAction } from "@tandem/sandbox";

import { omit } from "lodash";
import * as React from "react";
import { WrapBus } from "mesh";
import { SyntheticVisibleHTMLEntity } from "@tandem/html-extension";
import { watchProperty, IActor, Action } from "@tandem/common";

// default CSS styles to inject into the synthetic document
const DEFAULT_FRAME_STYLE_SHEET = evaluateCSS(parseCSS(`
  .frame-entity {
    width: 1024px;
    height: 768px;
    position: absolute;
  }

  .frame-entity iframe, .frame-entity-overlay {
    border: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .frame-entity-overlay {
    background: transparent;
  }
`));

// TODOS:
// - [ ] userAgent attribute
// - [ ] location attribute
// - [ ] preset attribute
export class SyntheticTDFrameEntity extends SyntheticVisibleHTMLEntity {

  private _frameBrowser: SyntheticBrowser;
  private _frameBrowserObserver: IActor;

  async evaluate() {

    const ownerDocument = this.source.ownerDocument;

    // TODO - possibly move this logic to the parent where it checks for the default style sheet & automatically
    // injects it into the document
    if (ownerDocument.styleSheets.indexOf(DEFAULT_FRAME_STYLE_SHEET) === -1) {
      ownerDocument.styleSheets.push(DEFAULT_FRAME_STYLE_SHEET);
    }

    if (!this._frameBrowser) {
      const documentRenderer = new SyntheticDOMRenderer();
      this._frameBrowser = new SyntheticBrowser(ownerDocument.defaultView.browser.dependencies, documentRenderer);
      this._frameBrowser.observe(this._frameBrowserObserver = new WrapBus(this.onFrameBrowserAction.bind(this)));
      watchProperty(this._frameBrowser, "documentEntity", this.onBrowserDocumentEntityChange.bind(this));
    }

    if (this.source.getAttribute("src")) {
      const src = this.source.getAttribute("src");
      const window = ownerDocument.defaultView;
      const absolutePath = await window.sandbox.importer.resolve(src, window.location.toString());
      await this._frameBrowser.open(absolutePath);
    } else {
      // add frame body here
    }
  }

  get title(): string {
    return this.change.getAttribute("title");
  }

  set title(value: string) {
    this.change.setAttribute("title", value);
  }

  get capabilities() {
    return new SyntheticDOMCapabilities(true, true);
  }

  get contentDocument() {
    return this._frameBrowser.documentEntity;
  }

  get inheritCSS() {
    return this.source.hasAttribute("inherit-css");
  }

  protected onBrowserDocumentEntityChange() {
    while (this.firstChild) this.removeChild(this.firstChild);
    this.appendChild(this._frameBrowser.documentEntity);
  }

  protected onFrameBrowserAction(action: Action) {
    if (action.type === SandboxAction.OPENED_MAIN_ENTRY) {
      this.onFrameBrowserRevaluated();
    }
  }

  protected renderEntityAttributes() {

    // todo - add presets here
    return super.renderEntityAttributes();
  }

  protected onFrameBrowserRevaluated() {
    if (this.inheritCSS) {
      this._frameBrowser.document.styleSheets.push(...this.browser.document.styleSheets);
    }
  }

  targetDidMount() {
    const iframe = this.target.querySelector("iframe") as HTMLIFrameElement;
    const onload = () => iframe.contentDocument.body.appendChild(this._frameBrowser.renderer.element);
    iframe.onload = onload;
    if (iframe.contentDocument) onload();
  }

  render() {
    return <div className="frame-entity" {...omit(this.renderAttributes(), ["inheritCss"])}>
      <iframe />
      <div className="frame-entity-overlay" />
    </div>;
  }
}

export class SyntheticFrameRenderer extends BaseDecoratorRenderer {
  constructor(private _frame: SyntheticTDFrameEntity, _renderer: ISyntheticDocumentRenderer) {
    super(_renderer);
  }
  getBoundingRect(uid: string) {
    const rect = this._renderer.getBoundingRect(uid);
    const offset = this._frame.source.getBoundingClientRect();
    return rect.move({ left: offset.left, top: offset.top });
  }
}