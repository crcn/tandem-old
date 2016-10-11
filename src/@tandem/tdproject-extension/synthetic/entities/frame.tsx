import "./frame.scss";

import {
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticHTMLElement,
  SyntheticDOMRenderer,
  BaseDecoratorRenderer,
  SyntheticDOMCapabilities,
  BaseSyntheticDOMNodeEntity,
  ISyntheticDocumentRenderer,
  BaseVisibleSyntheticDOMNodeEntity,
} from "@tandem/synthetic-browser";

import { SandboxAction } from "@tandem/sandbox";

import { omit } from "lodash";
import * as React from "react";
import { WrapBus } from "mesh";
import { SyntheticVisibleHTMLEntity } from "@tandem/html-extension";
import { watchProperty, IActor, Action } from "@tandem/common";


// TODOS:
// - [ ] userAgent attribute
// - [ ] location attribute
// - [ ] preset attribute
export class SyntheticTDFrameEntity extends SyntheticVisibleHTMLEntity {

  private _frameBrowser: SyntheticBrowser;
  private _frameBrowserObserver: IActor;

  async evaluate() {

    if (!this.source.hasAttribute("style")) {
      // TODO - define platform preset here
      this.source.setAttribute("style", "position: absolute; width: 1024px; height: 768px;");
    }

    if (!this._frameBrowser) {
      const documentRenderer = new SyntheticDOMRenderer();
      this._frameBrowser = new SyntheticBrowser(this.source.ownerDocument.defaultView.browser.dependencies, documentRenderer);
      this.browser.observe(this._frameBrowserObserver = new WrapBus(this.onFrameBrowserAction.bind(this)));
      watchProperty(this._frameBrowser, "documentEntity", this.onBrowserDocumentEntityChange.bind(this));
    }

    if (this.source.getAttribute("src")) {
      const src = this.source.getAttribute("src");
      const window = this.source.ownerDocument.defaultView;
      const absolutePath = await window.sandbox.importer.resolve(src, window.location.toString());
      await this._frameBrowser.open(absolutePath);
    } else {
      // add frame body here
    }
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

  protected onFrameBrowserRevaluated() {
    if (this.inheritCSS) {
      this._frameBrowser.document.styleSheets.push(...this.browser.document.styleSheets);
    }
  }

  targetDidMount() {
    const iframe = this.target.querySelector("iframe") as HTMLIFrameElement;
    if (iframe.contentDocument) {
      iframe.contentDocument.body.appendChild(this._frameBrowser.renderer.element);
    }
  }

  render() {
    return <div className="frame-entity" {...omit(this.renderAttributes(), ["inherit-css"])}>
      <iframe style={{border:"none", width: "100%", height: "100%", position: "absolute", top: 0, left: 0}} />
      <div key="overlay" style={{width:"100%",height:"100%",position:"absolute",top: 0, left: 0, background: "transparent"}} />
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