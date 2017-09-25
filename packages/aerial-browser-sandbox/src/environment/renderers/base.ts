import { getSEnvEventTargetClass, getSEnvEventClasses, SEnvMutationEventInterface } from "../events";
import { SEnvWindowInterface } from "../window";
import { SEnvElementInterface } from "../nodes/element";
import { Rectangle, Point } from "aerial-common2";

const EventTarget = getSEnvEventTargetClass();
const { SEnvEvent, SEnvMutationEvent } = getSEnvEventClasses();

export interface RenderedClientRects {
  [identifier: string]: ClientRect
};


export interface RenderedComputedStyleDeclarations {
  [identifier: string]: CSSStyleDeclaration
};

export interface SyntheticWindowRendererInterface extends EventTarget {
  container: HTMLElement;
  sourceWindow: Window;
  computedStyles: RenderedComputedStyleDeclarations;
  clientRects: RenderedClientRects;
  scrollPosition: Point;
  scrollRect: Rectangle;
  dispose();
  readonly allBoundingClientRects: RenderedClientRects;
  getBoundingClientRect(element: SEnvElementInterface): ClientRect;
  getComputedStyle(element: SEnvElementInterface, pseudoElement?: SEnvElementInterface): CSSStyleDeclaration;
}

export type SyntheticDOMRendererFactory = (window: Window) => SyntheticWindowRendererInterface;


export class SyntheticWindowRendererEvent extends SEnvEvent {

  static readonly PAINTED = "PAINTED";

  rects: RenderedClientRects;
  styles: RenderedComputedStyleDeclarations;
  scrollPosition: Point;
  scrollRect: Rectangle;

  initRendererEvent(type: string, rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations, scrollRect: Rectangle, scrollPosition) {
    super.initEvent(type, true, true);
    this.rects = rects;
    this.styles = styles;
    this.scrollRect = scrollRect;
    this.scrollPosition = scrollPosition;
  }
}

const REQUEST_UPDATE_TIMEOUT = 5;

export abstract class BaseSyntheticWindowRenderer extends EventTarget implements SyntheticWindowRendererInterface {
  abstract readonly container: HTMLElement;
  private _rects: RenderedClientRects;
  private _scrollWidth: number;
  private _scrollHeight: number;
  private _scrollRect: Rectangle;
  private _scrollPosition: Point;
  private _styles: RenderedComputedStyleDeclarations;
  private _currentRenderPromise: Promise<any>;
  private _shouldRenderAgain: boolean;
  private _runningPromise: Promise<any>;
  private _resolveRunningPromise: () => any;

  constructor(protected _sourceWindow: SEnvWindowInterface) {
    super();
    this._runningPromise = Promise.resolve();
    this._onDocumentLoad = this._onDocumentLoad.bind(this);
    this._onDocumentReadyStateChange = this._onDocumentReadyStateChange.bind(this);
    this._onWindowResize = this._onWindowResize.bind(this);
    this._onWindowScroll = this._onWindowScroll.bind(this);
    this._onWindowMutation = this._onWindowMutation.bind(this);
    this._addTargetListeners();
    this.reset();
  }

  get allBoundingClientRects() {
    return this._rects;
  }

  get clientRects() {
    return this._rects;
  }
  
  get computedStyles() {
    return this._styles;
  }
  
  get scrollRect() {
    return this._scrollRect;
  }

  get scrollPosition() {
    return this._scrollPosition;
  }

  get sourceWindow(): SEnvWindowInterface {
    return this._sourceWindow;
  }

  getBoundingClientRect(element: SEnvElementInterface): ClientRect {
    return this._rects && this._rects[element.$id];
  }

  getComputedStyle(element: SEnvElementInterface, pseudoElement?: SEnvElementInterface): CSSStyleDeclaration {
    return this._styles && this._styles[element.$id];
  }

  protected _removeTargetListeners() {

  }

  dispose() {

  }

  protected _addTargetListeners() {
    this._sourceWindow.document.addEventListener("readystatechange", this._onDocumentReadyStateChange);
    this._sourceWindow.addEventListener("resize", this._onWindowResize);
    this._sourceWindow.addEventListener("scroll", this._onWindowScroll);
  }

  protected _onDocumentReadyStateChange(event: Event) {
    if (this._sourceWindow.document.readyState === "complete") {
      this._onDocumentLoad(event);
    }
  }

  public whenRunning() {
    return this._runningPromise;
  }

  public resume() {
    if (this._resolveRunningPromise) {
      const resolve = this._resolveRunningPromise;
      this._resolveRunningPromise = undefined;
      resolve();
    }
  }

  public pause() {
    if (!this._resolveRunningPromise) {
      this._runningPromise = new Promise((resolve) => {
        this._resolveRunningPromise = resolve;
      });
    }
  }

  protected _onDocumentLoad(event: Event) {
    this.requestRender();

    // document load is when the page is visible to the user, so only listen for 
    // mutations after stuff is loaded in (They'll be fired as the document is loaded in) (CC)
    this._sourceWindow.addEventListener(SEnvMutationEvent.MUTATION, this._onWindowMutation);
  }

  public requestRender() {
    if (!this._sourceWindow) return;

    if (this._currentRenderPromise) {
      this._shouldRenderAgain = true;
    }

    return this._currentRenderPromise || (this._currentRenderPromise = new Promise<any>((resolve, reject) => {

      const done = () => {
        this._currentRenderPromise = undefined;
      }

      // renderer here doesn't need to be particularly fast since the user
      // doesn't get to interact with visual content. Provide a slowish
      // timeout to ensure that we don't kill CPU from unecessary renders.
      const render = async () => {
        if (!this._sourceWindow) return;
        await this.whenRunning();
        this._shouldRenderAgain = false;
        await this.render();
        if (this._shouldRenderAgain) {
          this._shouldRenderAgain = false;
          await render();
        }
      }

      render().then(resolve, reject).then(done, done);
    }));
  }

  protected reset() {
    
  }

  protected abstract render(): any;

  protected _onWindowResize(event: Event) {
    this.requestRender();
  }

  protected _onWindowScroll(event: Event) {
    this.requestRender();
  }

  protected _onWindowMutation(event: SEnvMutationEventInterface) {
    this.requestRender();
  }

  protected getRequestUpdateTimeout() {
    
    // OVERRIDE ME - used for dynamic render throttling
    return REQUEST_UPDATE_TIMEOUT;
  }

  protected setPaintedInfo(rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations, scrollRect: Rectangle, scrollPosition: Point) {
    this._rects = rects;
    this._styles = styles;
    this._scrollRect = scrollRect;
    this._scrollPosition = scrollPosition;
    const event = new SyntheticWindowRendererEvent();
    event.initRendererEvent(SyntheticWindowRendererEvent.PAINTED, rects, styles, scrollRect, scrollPosition);
    this.dispatchEvent(event);
  }
}
