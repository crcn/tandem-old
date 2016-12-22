import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class SyntheticTDRootElement extends SyntheticHTMLElement {
  createdCallback() {
    super.createdCallback();
    this.setAttribute("data-td-hide-layer", "true");
  }
}