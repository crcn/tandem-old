import {
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticHTMLElement,
  BaseSyntheticComponent,
} from "@tandem/synthetic-browser";
import { MimeTypes } from "@tandem/common";

export class SyntheticTDFrame extends BaseSyntheticComponent<SyntheticHTMLElement, HTMLIFrameElement> {

  private _browser: SyntheticBrowser;

  async load() {
    const src = this.source.getAttribute("src");
    const window = this.source.ownerDocument.defaultView;
    const absolutePath = await window.sandbox.importer.resolve(src, window.location.toString());

    this._browser = new SyntheticBrowser(this.source.ownerDocument.defaultView.browser.dependencies);
    await this._browser.open(absolutePath);
  }

  get contentDocument() {
    return this._browser.documentComponent;
  }

  didEvaluate() {

  }

  targetDidMount() {
    this.target.contentDocument.body.appendChild(this._browser.renderer.element);
  }

  render() {
    return `<iframe ${this.source.attributesToString("data-uid", "style", "class")}></iframe>`;
  }
}