import { Action } from "@tandem/common";
import { SyntheticRendererAction } from "../actions";
import { WrapBus } from "mesh";
import { Observable, IObservable } from "@tandem/common";
import { BoundingRect, watchProperty } from "@tandem/common";
import {
  MarkupNodeType,
  SyntheticDocument,
  SyntheticMarkupNode,
  SyntheticMarkupText,
  SyntheticMarkupElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";


export interface ISyntheticDocumentRenderer extends IObservable {
  readonly element: HTMLElement;
  target: SyntheticMarkupNode;
  getBoundingRect(element: SyntheticMarkupElement);
}

export abstract class BaseRenderer extends Observable implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;
  private _document: SyntheticDocument;
  private _updating: boolean;
  private _rects: any;
  private _shouldUpdateAgain: boolean;

  constructor() {
    super();
    this.element = document.createElement("div");
  }

  get target(): SyntheticDocument {
    return this._document;
  }

  set target(value: SyntheticDocument) {
    this._document = value;
    this._document.observe(new WrapBus(this.onTargetChange.bind(this)));
    this.update();
  }

  getBoundingRect(element: SyntheticMarkupElement) {
    return (this._rects && this._rects[element.uid]) || new BoundingRect(0, 0, 0, 0);
  }

  protected abstract update();

  protected setRects(rects: any) {
    this._rects = rects;
    this.notify(new SyntheticRendererAction(SyntheticRendererAction.UPDATE_RECTANGLES));
  }

  protected onTargetChange(action: Action) {
    if (this._updating) {
      this._shouldUpdateAgain = true;
      return;
    }
    this._updating = true;
    requestAnimationFrame(() => {
      this.update();
      this._updating = false;
      if (this._shouldUpdateAgain) {
        this._shouldUpdateAgain = false;
        this.update();
      }
    });
  }
}
