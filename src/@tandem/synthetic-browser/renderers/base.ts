import { Action } from "@tandem/common";
import { SyntheticRendererAction } from "../actions";
import { WrapBus } from "mesh";
import { Observable, IObservable } from "@tandem/common";
import { BoundingRect, watchProperty, IActor } from "@tandem/common";
import {
  MarkupNodeType,
  SyntheticDocument,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDOMElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";

import {
  BaseSyntheticDOMNodeEntity
} from "../entities";

export interface ISyntheticDocumentRenderer extends IObservable {
  readonly element: HTMLElement;
  entity: BaseSyntheticDOMNodeEntity<any, any>;
  getBoundingRect(uid: string): BoundingRect;
  requestUpdate(): void;
}

export abstract class BaseRenderer extends Observable implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;
  private _entity: BaseSyntheticDOMNodeEntity<any, any>;
  private _updating: boolean;
  private _rects: any;
  private _shouldUpdateAgain: boolean;
  private _targetObserver: IActor;

  constructor() {
    super();
    this.element = document.createElement("div");
    this._targetObserver = new WrapBus(this.onEntityAction.bind(this));
  }

  get entity(): BaseSyntheticDOMNodeEntity<any, any> {
    return this._entity;
  }

  set entity(value: BaseSyntheticDOMNodeEntity<any, any>) {
    if (this._entity === value) {
      this.update();
      return;
    }

    if (this._entity) {
      this._entity.unobserve(this._targetObserver);
    }
    this._entity = value;
    this._entity.observe(this._targetObserver);
    this.update();
  }

  get rects() {
    return this._rects;
  }

  getBoundingRect(uid: string) {
    return (this._rects && this._rects[uid]) || new BoundingRect(0, 0, 0, 0);
  }

  protected abstract update();

  protected setRects(rects: any) {
    this._rects = rects;
    this.notify(new SyntheticRendererAction(SyntheticRendererAction.UPDATE_RECTANGLES));
  }

  protected onEntityAction(action: Action) {
    this.requestUpdate();
  }

  public requestUpdate() {
    if (this._updating) {
      this._shouldUpdateAgain = true;
      return;
    }
    this._updating = true;
    requestAnimationFrame(async () => {
      await this.update();
      this._updating = false;
      if (this._shouldUpdateAgain) {
        this._shouldUpdateAgain = false;
        this.requestUpdate();
      }
    });
  }
}

export class BaseDecoratorRenderer implements ISyntheticDocumentRenderer {
  constructor(protected _renderer: ISyntheticDocumentRenderer) {
    _renderer.observe(new WrapBus(this.onTargetRendererAction.bind(this)));
  }
  getBoundingRect(uid) {
    return this._renderer.getBoundingRect(uid);
  }
  observe(actor) {
    return this._renderer.observe(actor);
  }
  unobserve(actor) {
    return this._renderer.unobserve(actor);
  }
  notify(action) {
    return this._renderer.notify(action);
  }
  get element() {
    return this._renderer.element;
  }
  get entity() {
    return this._renderer.entity;
  }
  set entity(value) {
    this._renderer.entity = value;
  }

  requestUpdate() {
    return this._renderer.requestUpdate();
  }

  protected onTargetRendererAction(action: Action) {

  }
}