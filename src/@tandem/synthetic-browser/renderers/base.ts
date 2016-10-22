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

export interface ISyntheticDocumentRenderer extends IObservable {
  readonly element: HTMLElement;
  document: SyntheticDocument;
  getBoundingRect(uid: string): BoundingRect;
  getComputedStyle(uid: string): any;
  fetchComputedStyle(uid: string): Promise<any>;
  requestUpdate(): void;
}

// render timeout -- this should be a low number
const REQUEST_UPDATE_TIMEOUT = 50;

export abstract class BaseRenderer extends Observable implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;
  private _document: SyntheticDocument;
  private _updating: boolean;
  private _rects: any;
  private _shouldUpdateAgain: boolean;
  private _targetObserver: IActor;

  constructor() {
    super();

    // may be running in a worker. Do not create an element if that's the case.
    if (typeof document !== "undefined") {
      this.element = this.createElement();
    }

    this._targetObserver = new WrapBus(this.onDocumentAction.bind(this));
  }

  get document(): SyntheticDocument {
    return this._document;
  }

  set document(value: SyntheticDocument) {
    if (this._document === value) {
      this.requestUpdate();
      return;
    }

    if (this._document) {
      this._document.unobserve(this._targetObserver);
    }
    this._document = value;
    if (!this._document) return;
    this._document.observe(this._targetObserver);
    this.requestUpdate();
  }

  get rects() {
    return this._rects;
  }

  getComputedStyle(uid: string) {
    return undefined;
  }

  async fetchComputedStyle(uid: string) {
    // OVERRIDE ME
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

  protected onDocumentAction(action: Action) {
    this.requestUpdate();
  }

  public requestUpdate() {
    if (!this._document) return;

    if (this._updating) {
      this._shouldUpdateAgain = true;
      return;
    }
    this._updating = true;

    // renderer here doesn't need to be particularly fast since the user
    // doesn't get to interact with visual content. Provide a slowish
    // timeout to ensure that we don't kill CPU from unecessary renders.
    setTimeout(async () => {
      if (!this._document) return;
      this._shouldUpdateAgain = false;
      await this.update();
      this._updating = false;
      if (this._shouldUpdateAgain) {
        this._shouldUpdateAgain = false;
        this.requestUpdate();
      }
    }, REQUEST_UPDATE_TIMEOUT);
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
  get document() {
    return this._renderer.document;
  }
  set document(value) {
    this._renderer.document = value;
  }

  requestUpdate() {
    return this._renderer.requestUpdate();
  }

  protected onTargetRendererAction(action: Action) {

  }
}

export class NoopRenderer extends BaseRenderer {
  update() { }
  requestUpdate() { }
  createElement() { return undefined; }
}