import { SyntheticDOMElement } from "@tandem/synthetic-browser";

export class SyntheticTDRulerElement extends SyntheticDOMElement {
  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute("disabled", String(true));
    } else {
      this.removeAttribute("disabled");
    }
  }
}