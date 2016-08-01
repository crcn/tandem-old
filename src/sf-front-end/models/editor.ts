import { IFile } from "./base";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;

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

  public selection: Array<any> = [];

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

  public file: IFile;
}