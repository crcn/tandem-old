import { SyntheticHTMLElement, BaseSyntheticDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";

export class SyntheticTDProject extends BaseSyntheticDOMContainerEntity<SyntheticHTMLElement, HTMLElement> {
  render() {
    return this.children.map((child) => child.render()).join("");
  }
}
