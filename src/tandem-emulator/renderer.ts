import { Action } from "tandem-common";
import { Browser } from "./browser";
import { WrapBus } from "mesh";
import { SyntheticAction } from "./actions";
import { SyntheticElement } from "./synthetic";

export interface ISyntheticDocumentRenderer {
  readonly element: HTMLElement;
}

export abstract class BaseRenderer implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;

  constructor(readonly browser: Browser) {
    browser.window.observe(new WrapBus(this.onWindowAction.bind(this)));
    this.element = document.createElement("div");
  }

  protected onWindowAction(action: Action) {
    if (action.type === SyntheticAction.PATCHED) {
      this.update();
    }
  }

  // TODO
  get rectangles(): Array<any> {
    return [];
  }

  protected abstract update();
}

export class DOMRenderer extends BaseRenderer {
  update() {
    const document = this.browser.window.get("document");
    const body     = document.get("body") as SyntheticElement;

    // simple for now -- just reset the entire outer HTML
    this.element.innerHTML = body.outerHTML;
  }
}