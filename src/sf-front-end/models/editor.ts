import { IEditorFile, BaseTool } from "./base";
import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import { Selection } from "../selection";
import { IDisposable } from "sf-core/object";
import { IInjectable } from "sf-core/dependencies";
import { inject } from "sf-core/decorators";
import {
  ZoomAction,
  ZOOM,
  SELECT_ALL,
  DELETE_SELECTION,
  SET_TOOL,
  SetToolAction,
  DeleteSelectionAction,
  SelectAllAction,
} from "sf-front-end/actions";
import { KeyBinding } from "sf-front-end/key-bindings";
import { ParallelBus } from "mesh";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Editor {

  private _zoom: number = 1;

  private  _actors: Array<IActor>;

  private _bus: IActor;

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