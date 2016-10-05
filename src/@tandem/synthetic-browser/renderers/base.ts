import { Action } from "@tandem/common";
import { WrapBus } from "mesh";
import { BoundingRect, watchProperty } from "@tandem/common";
import {
  HTMLNodeType,
  SyntheticHTMLNode,
  SyntheticHTMLTextNode,
  SyntheticHTMLElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";

export interface ISyntheticHTMLDocumentRenderer {
  readonly element: HTMLElement;
  target: SyntheticHTMLNode;
}

export abstract class BaseRenderer implements ISyntheticHTMLDocumentRenderer {

  readonly element: HTMLElement;
  private _target: SyntheticHTMLNode;

  constructor() {
    this.element = document.createElement("div");
  }

  get target(): SyntheticHTMLNode {
    return this._target;
  }

  set target(value: SyntheticHTMLNode) {
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
