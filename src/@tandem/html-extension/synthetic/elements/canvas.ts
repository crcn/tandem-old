import Canvas = require("canvas-prebuilt");
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLCanvas extends SyntheticHTMLElement {
  private _canvas: HTMLCanvasElement;

  createdCallback() {
    super.createdCallback();

    // default
    this._canvas = new Canvas(500, 500);
  }

  get height() {
    return this._canvas.height;
  }

  set height(value: number) {
    this._canvas.height = value;
  }

  msToBlob() {
    return null;
  }

  toDataURL(type?: string, ...args: any[]): string {
    return this._canvas.toDataURL(type, ...args);
  }

  toBlob(callback: (result: Blob | null) => void, type?: string, ...args: any[]): void {

  }

  get width() {
    return this._canvas.width;
  }

  set width(value: number) {
    this._canvas.width = value;
  }

  getContext(contextId: "2d", contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;
  getContext(contextId: "webgl" | "experimental-webgl", contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;

  getContext(contextId: string, contextAttributes?: any) {
    return this._canvas.getContext(contextId, contextAttributes);
  }
}