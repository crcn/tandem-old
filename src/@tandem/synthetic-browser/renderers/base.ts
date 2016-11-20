import { values } from "lodash";
import { Action } from "@tandem/common";
import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { SyntheticRendererAction, isDOMMutationEvent } from "../messages";

import {
  Logger,
  loggable,
  bindable,
  Observable,
  IObservable,
  BoundingRect,
  watchProperty,
  MetadataChangeAction,
  waitForPropertyChange,
} from "@tandem/common";

import {
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticCSSStyleDeclaration,
} from "../dom";


export interface ISyntheticDocumentRenderer extends IObservable {
  readonly element: HTMLElement;
  document: SyntheticDocument;

  /**
   * Called by whatever is mounting the document renderer
   */

  start();

  /**
   * Pauses the renderer
   */

  stop();

  /**
   * Returns the bounding rects exactly as they're computed by the target renderer.
   */

  getBoundingRect(uid: string): BoundingRect;


  /**
   * Returns the bounding rects exactly as they're computed by the target renderer.
   */

  getAllBoundingRects(): BoundingRect[];

  /**
   * Resolves when the renderer is running
   */

  whenRunning(): Promise<any>;

  /**
   * Fetches and returns a computed style by the target rendering engine.
   */

  getComputedStyle(uid: string): any;

  /**
   */

  requestRender(): void;
}

// render timeout -- this should be a low number
const REQUEST_UPDATE_TIMEOUT = 5;

@loggable()
export abstract class BaseRenderer extends Observable implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;
  private _document: SyntheticDocument;
  private _rendering: boolean;
  public  $rects: any;

  @bindable()
  protected _rendered: boolean;

  @bindable()
  protected _running: boolean;

  private _shouldRenderAgain: boolean;
  private _targetObserver: IDispatcher<any, any>;
  private _computedStyles: any;

  protected readonly logger: Logger;

  constructor() {
    super();
    this._running = false;
    this._computedStyles = {};

    // may be running in a worker. Do not create an element if that's the case.
    if (typeof window !== "undefined") {
      this.element = this.createElement();
    }

    this._targetObserver = new CallbackDispatcher(this.onDocumentAction.bind(this));
  }

  get document(): SyntheticDocument {
    return this._document;
  }

  set document(value: SyntheticDocument) {
    if (this._document === value) {
      this.requestRender();
      return;
    }

    if (this._document) {
      this._document.unobserve(this._targetObserver);
    }
    this._document = value;
    if (!this._document) return;
    this._document.observe(this._targetObserver);
    this.requestRender();
  }

  getAllBoundingRects() {
    return values(this.$rects) as BoundingRect[];
  }

  async whenRunning() {
    if (!this._running) await waitForPropertyChange(this, "_running", value => !!value);
  }

  async whenRendered() {
    if (!this._rendered) await waitForPropertyChange(this, "_rendered", value => !!value);
  }

  public start() {
    if (this._running) return;
    this._running = true;
    this.requestRender();
  }

  public stop() {
    this._running = false;
  }

  getComputedStyle(uid: string) {
    return this._computedStyles[uid];
  }

  getBoundingRect(uid: string) {
    return (this.$rects && this.$rects[uid]) || new BoundingRect(0, 0, 0, 0);
  }

  protected abstract render();

  protected createElement() {
    return document.createElement("div");
  }

  protected setRects(rects: { [IDentifier: string]: BoundingRect }, styles: { [IDentifier: string]: SyntheticCSSStyleDeclaration }) {
    this.$rects          = rects;
    this._computedStyles = styles;
    this._rendered = true;
    this.notify(new SyntheticRendererAction(SyntheticRendererAction.UPDATE_RECTANGLES));
  }

  protected onDocumentAction(action: Action) {
    if (isDOMMutationEvent(action)) {
      this.requestRender();
    }
  }

  public requestRender() {
    if (!this._document) return;

    if (this._rendering) {
      this._shouldRenderAgain = true;
      return;
    }
    this._rendering = true;

    // renderer here doesn't need to be particularly fast since the user
    // doesn't get to interact with visual content. Provide a slowish
    // timeout to ensure that we don't kill CPU from unecessary renders.
    setTimeout(async () => {
      if (!this._document) return;

      await this.whenRunning();

      this._shouldRenderAgain = false;
      this.logger.debug("Rendering synthetic document");
      await this.render();
      this._rendering = false;
      if (this._shouldRenderAgain) {
        this._shouldRenderAgain = false;
        this.requestRender();
      }
    }, this.getRequestUpdateTimeout());
  }

  protected getRequestUpdateTimeout() {

    // OVERRIDE ME - used for dynamic render throttling
    return REQUEST_UPDATE_TIMEOUT;
  }
}


export class BaseDecoratorRenderer extends Observable implements ISyntheticDocumentRenderer {
  constructor(protected _renderer: ISyntheticDocumentRenderer) {
    super();
    _renderer.observe(new CallbackDispatcher(this.onTargetRendererAction.bind(this)));
  }
  getComputedStyle(uid) {
    return this._renderer.getComputedStyle(uid);
  }
  getBoundingRect(uid) {
    return this._renderer.getBoundingRect(uid);
  }
  getAllBoundingRects() {
    return this._renderer.getAllBoundingRects();
  }
  whenRunning() {
    return this._renderer.whenRunning();
  }
  start() {
    this._renderer.start();
  }
  stop() {
    this._renderer.stop();
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

  requestRender() {
    return this._renderer.requestRender();
  }

  protected onTargetRendererAction(action: Action) {
    if (action.type === SyntheticRendererAction.UPDATE_RECTANGLES) {
      this.onTargetRendererSetRectangles();
    }
    // bubble up
    this.notify(action);
  }

  protected onTargetRendererSetRectangles() {

  }
}

export class NoopRenderer extends Observable implements ISyntheticDocumentRenderer {
  readonly element: HTMLElement;
  public document: SyntheticDocument;
  public getBoundingRect() {
    return BoundingRect.zeros();
  }
  public getEagerComputedStyle() {
    return null;
  }
  getAllBoundingRects() {
    return [];
  }
  public whenRunning() {
    return Promise.resolve();
  }
  public start() { }
  public stop() { }
  public getComputedStyle() {
    return null;
  }
  public hasLoadedComputedStyle() {
    return false;
  }
  requestRender() { }
  createElement() { return undefined; }
}