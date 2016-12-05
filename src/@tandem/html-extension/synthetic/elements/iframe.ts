import { SyntheticHTMLElement, SyntheticWindow } from "@tandem/synthetic-browser";


export class SyntheticIframe extends SyntheticHTMLElement  {
  private _contentWindow: SyntheticWindow;
  createdCallback() {
    super.createdCallback();
    this._contentWindow = new SyntheticWindow();
  }
  
  get contentWindow() {
    return this._contentWindow;
  }
}