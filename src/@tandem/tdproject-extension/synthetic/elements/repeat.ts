import { SyntheticHTMLElement, SyntheticDOMAttribute } from "@tandem/synthetic-browser";

export class SyntheticTDRepeatElement extends SyntheticHTMLElement {
  createdCallback() {
    console.log("repeat");
    console.log(this.innerHTML);
  }

}