import { Browser } from "./browser";

export interface ISyntheticDocumentRenderer {
  readonly element: HTMLElement;
}

export class DOMRenderer implements ISyntheticDocumentRenderer {
  readonly element: HTMLElement;

  constructor(readonly browser: Browser) {
    this.element = document.createElement("div");
  }
}