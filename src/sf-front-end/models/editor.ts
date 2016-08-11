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
import { TypeCallbackBus } from "sf-common/busses";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Editor implements IInjectable, IActor {

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

  didInject() {
    this._actors = [
      new TypeCallbackBus(ZOOM, this._onZoom.bind(this)),
      new TypeCallbackBus(SELECT_ALL, this._onSelectAll),
      new TypeCallbackBus(DELETE_SELECTION, this._onDeleteSelection),
      new TypeCallbackBus(SET_TOOL, this._onSetTool)
    ];
    this._bus = new ParallelBus(this._actors);
  }

  execute(action: Action) {
    return this._bus.execute(action);
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


  private _onZoom = (action: ZoomAction) => {
    this.zoom += action.delta;
  }

  private _onSelectAll = (action: SelectAllAction) => {
    console.log("SELECT ALL")
  }

  private _onDeleteSelection = (action: DeleteSelectionAction) => {
    console.log("SELECT")
  }

  private _onSetTool = (action: SetToolAction) => {
    this.currentTool = action.tool;
  }
}