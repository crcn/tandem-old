import { IEditorFile } from "./base";
import { Selection } from "../selection";
import { IDisposable } from "sf-core/object";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Editor {

  private _zoom: number = 1;

  get zoom() { return this._zoom; }
  set zoom(value: number) {
    this._zoom = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, value)
    );
  }

  /**
   * The currently selected items in the preview
   */

  public selection: Selection<any> = new Selection<any>();

  /**
   * The current tool
   */

  public currentTool: any = {
    name: "pointer",
    cursor: "pointer"
  };

  /**
   */

  public tools: Array<any> = [];

  /**
   */

  public file: IEditorFile;
}