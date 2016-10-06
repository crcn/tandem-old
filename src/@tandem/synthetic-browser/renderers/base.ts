import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import { BoundingRect, watchProperty } from "@tandem/common";
import {
  MarkupNodeType,
  SyntheticMarkupNode,
  SyntheticMarkupText,
  SyntheticMarkupElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";

export interface ISyntheticDocumentRenderer {
  readonly element: HTMLElement;
  target: SyntheticMarkupNode;
}

export abstract class BaseRenderer implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;
  private _target: SyntheticMarkupNode;

  constructor() {
    this.element = document.createElement("div");
  }

  get target(): SyntheticMarkupNode {
    return this._target;
  }

  set target(value: SyntheticMarkupNode) {
    this._target = value;
    this._target.observe(new WrapBus(this.onTargetChange.bind(this)));
    this.update();
  }

  // TODO
  get rectangles(): Array<any> {
    return [];
  }

  protected abstract update();

  protected onTargetChange(action: Action) {
    this.update();
  }
}
