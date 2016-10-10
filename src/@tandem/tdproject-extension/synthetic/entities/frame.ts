import "./frame.scss";

import {
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticHTMLElement,
  SyntheticDOMRenderer,
  BaseDecoratorRenderer,
  BaseSyntheticDOMNodeEntity,
  SyntheticDOMCapabilities,
  ISyntheticDocumentRenderer,
  BaseVisibleSyntheticDOMNodeEntity,
} from "@tandem/synthetic-browser";

import { SyntheticVisibleHTMLEntity } from "@tandem/html-extension";

import { watchProperty } from "@tandem/common";

export class SyntheticTDFrameEntity extends SyntheticVisibleHTMLEntity {

  private _browser: SyntheticBrowser;

  async evaluate() {

    if (!this._browser) {
      const documentRenderer = new SyntheticDOMRenderer();
      this._browser = new SyntheticBrowser(this.source.ownerDocument.defaultView.browser.dependencies, new SyntheticFrameRenderer(this, documentRenderer));
      watchProperty(this._browser, "documentEntity", this.onBrowserDocumentComponentChange.bind(this));
    }

    if (this.source.getAttribute("src")) {
      const src = this.source.getAttribute("src");
      const window = this.source.ownerDocument.defaultView;
      const absolutePath = await window.sandbox.importer.resolve(src, window.location.toString());
      await this._browser.open(absolutePath);
    } else {

    }
  }

  get capabilities() {
    return new SyntheticDOMCapabilities(true, true);
  }

  get contentDocument() {
    return this._browser.documentEntity;
  }

  protected onBrowserDocumentComponentChange() {
    while (this.firstChild) this.removeChild(this.firstChild);
    this.appendChild(this._browser.documentEntity);
  }

  targetDidMount() {
    const iframe = this.target.querySelector("iframe") as HTMLIFrameElement;
    if (iframe.contentDocument) {
      iframe.contentDocument.body.appendChild(this._browser.renderer.element);
    }
  }

  render() {
    return `<div class="frame-entity" ${this.extraAttributesToString()} ${this.source.attributesToString("style")}>
      <iframe style="border:none;width:100%;height:100%;position:absolute;top:0px;left:0px;"></iframe>

      <!-- overlay to ensure that the iframe does not receive any mouse events that will foo with the editing tools -->
      <div class="frame-entity-overlay" style="width:100%;height:100%;position:absolute;top:0px;left:0px;background:transparent;"></div>
    </div>`;
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