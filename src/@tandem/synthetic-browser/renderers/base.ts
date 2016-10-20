import { Action } from "@tandem/common";
import { SyntheticRendererAction, DOMEntityAction } from "../actions";
import { WrapBus } from "mesh";
import { Observable, IObservable, MetadataChangeAction } from "@tandem/common";
import { BoundingRect, watchProperty, IActor } from "@tandem/common";
import {
  DOMNodeType,
  SyntheticDocument,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDOMElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";

import {
  BaseDOMNodeEntity
} from "../entities";

export interface ISyntheticDocumentRenderer extends IObservable {
  readonly element: HTMLElement;
  entity: BaseDOMNodeEntity<any, any>;
  getBoundingRect(uid: string): BoundingRect;
  getComputedStyle(uid: string): any;
  fetchComputedStyle(uid: string): Promise<any>;
  requestUpdate(): void;
}

export abstract class BaseRenderer extends Observable implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;
  private _entity: BaseDOMNodeEntity<any, any>;
  private _updating: boolean;
  private _rects: any;
  private _shouldUpdateAgain: boolean;
  private _targetObserver: IActor;

  constructor() {
    super();
    this.element = this.createElement();
    this._targetObserver = new WrapBus(this.onEntityAction.bind(this));
  }

  get entity(): BaseDOMNodeEntity<any, any> {
    return this._entity;
  }

  set entity(value: BaseDOMNodeEntity<any, any>) {
    if (this._entity === value) {
      this.requestUpdate();
      return;
    }

    if (this._entity) {
      this._entity.unobserve(this._targetObserver);
    }
    this._entity = value;
    if (!this._entity) return;
    this._entity.observe(this._targetObserver);
    this.requestUpdate();
  }

  get rects() {
    return this._rects;
  }

  getComputedStyle(uid: string) {
    return undefined;
  }

  async fetchComputedStyle(uid: string) {

  }

  getBoundingRect(uid: string) {
    return (this._rects && this._rects[uid]) || new BoundingRect(0, 0, 0, 0);
  }

  protected abstract update();

  protected createElement() {
    return document.createElement("div");
  }

  protected setRects(rects: any) {
    this._rects = rects;
    this.notify(new SyntheticRendererAction(SyntheticRendererAction.UPDATE_RECTANGLES));
  }

  protected onEntityAction(action: Action) {
    if (action.type !== MetadataChangeAction.METADATA_CHANGE) {
      this.requestUpdate();
    }
  }

  public requestUpdate() {
    if (!this._entity) return;

    if (this._updating) {
      this._shouldUpdateAgain = true;
      return;
    }
    this._updating = true;

    requestAnimationFrame(async () => {
      if (!this.entity) return;
      this._shouldUpdateAgain = false;
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
  getComputedStyle(uid) {
    return this._renderer.getComputedStyle(uid);
  }
  fetchComputedStyle(uid) {
    return this._renderer.fetchComputedStyle(uid);
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

export class NoopRenderer extends BaseRenderer {
  createElement() { return null; }
  update() { }
  requestUpdate() { }
}