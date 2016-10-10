
import {
  SyntheticDOMRenderer,
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticHTMLElement,
  BaseDecoratorRenderer,
  BaseSyntheticComponent,
  ISyntheticDocumentRenderer,
} from "@tandem/synthetic-browser";

import { MimeTypes, bubbleHTMLIframeEvents, watchProperty } from "@tandem/common";

export class SyntheticTDFrame extends BaseSyntheticComponent<SyntheticHTMLElement, HTMLDivElement> {

  private _browser: SyntheticBrowser;

  async evaluate() {


    if (!this._browser) {
      const documentRenderer = new SyntheticDOMRenderer();
      this._browser = new SyntheticBrowser(this.source.ownerDocument.defaultView.browser.dependencies, new SyntheticFrameRenderer(this, documentRenderer));
      watchProperty(this._browser, "documentComponent", this.onBrowserDocumentComponentChange.bind(this));
    }

    if (this.source.getAttribute("src")) {
      const src = this.source.getAttribute("src");
      const window = this.source.ownerDocument.defaultView;
      const absolutePath = await window.sandbox.importer.resolve(src, window.location.toString());
      await this._browser.open(absolutePath);
    } else {

    }
  }

  get contentDocument() {
    return this._browser.documentComponent;
  }

  protected onBrowserDocumentComponentChange() {
    while (this.firstChild) this.removeChild(this.firstChild);
    this.appendChild(this._browser.documentComponent);
  }

  targetDidMount() {
    const iframe = this.target.querySelector("iframe") as HTMLIFrameElement;
    if (iframe.contentDocument) {
      iframe.contentDocument.body.appendChild(this._browser.renderer.element);
    }
  }

  render() {
    return `<div class="m-frame-component" style="width:1024px;height:768px;position:relative;" ${this.source.attributesToString("data-uid", "style")}>
      <iframe style="border:none;width:100%;height:100%;position:absolute;top:0px;left:0px;"></iframe>

      <!-- overlay to ensure that the iframe does not receive any mouse events that will foo with the editing tools -->
      <div class="m-frame-component--overlay" style="width:100%;height:100%;position:absolute;top:0px;left:0px;background:transparent;"></div>
    </div>`;
  }
}

export class SyntheticFrameRenderer extends BaseDecoratorRenderer {
  constructor(private _frame: SyntheticTDFrame, _renderer: ISyntheticDocumentRenderer) {
    super(_renderer);
  }
  getBoundingRect(element: SyntheticDOMElement) {
    const rect = this._renderer.getBoundingRect(element);
    const offset = this._frame.source.getBoundingClientRect();
    return rect.move({ left: offset.left, top: offset.top });
  }
}