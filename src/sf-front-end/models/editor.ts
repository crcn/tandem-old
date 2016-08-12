import { IEditor, IEditorTool } from "./base";
import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import { IInjectable } from "sf-core/dependencies";
import { Workspace } from "./workspace";
import { inject } from "sf-core/decorators";
import { KeyBinding } from "sf-front-end/key-bindings";
import { ParallelBus } from "mesh";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Editor implements IEditor {

  private _zoom: number = 1;

  // TODO - this may change dependening on the editor type
  readonly type = "display";

  constructor(readonly workspace: Workspace) { }

  get zoom() { return this._zoom; }
  set zoom(value: number) {
    this._zoom = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, value)
    );
  }

  /**
   * The current tool
   */

  public currentTool: IEditorTool;

  execute(action: Action) {
    if (this.currentTool) {
      this.currentTool.execute(action);
    }
  }
}