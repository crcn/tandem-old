import { SyntheticHTMLElement, DefaultSyntheticComponent } from "@tandem/synthetic-browser";
import { HTMLNodeComponentDisplay } from "./display";

export class VisibleHTMLComponent extends DefaultSyntheticComponent {
  readonly display: HTMLNodeComponentDisplay;
  constructor(source: SyntheticHTMLElement) {
    super(source);
    this.display = new HTMLNodeComponentDisplay(this);
  }
}