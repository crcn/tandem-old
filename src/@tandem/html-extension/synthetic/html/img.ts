import { SyntheticMarkupElementClassDependency, SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLImage extends SyntheticHTMLElement {
  onAdded() {
    super.onAdded();
    // TODO - dispatch change when image does here
  }
}

export const syntheticHTMLImageClassDependency = new SyntheticMarkupElementClassDependency("img", SyntheticHTMLImage);