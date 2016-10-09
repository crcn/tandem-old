import { SyntheticHTMLElement, BaseSyntheticComponent, SyntheticDocument } from "@tandem/synthetic-browser";

export class SyntheticTDProject extends BaseSyntheticComponent<SyntheticHTMLElement, HTMLElement> {
  render() {
    return this.children.map((child) => child.render()).join("");
  }
}
