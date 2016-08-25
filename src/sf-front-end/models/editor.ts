import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import { inject } from "sf-core/decorators";
import { Workspace } from "./workspace";
import { KeyBinding } from "sf-front-end/key-bindings";
import { IInjectable } from "sf-core/dependencies";
import { ParallelBus } from "mesh";
import { IPoint, Transform } from "sf-core/geom";
import { IEditor, IEditorTool } from "./base";
import { IEntity, IEntityDocument } from "sf-core/entities";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Editor implements IEditor {

  private _zoom: number = 1;
  public translate: IPoint = { left: 0, top: 0 };
  private _currentTool: IEditorTool;
  public transform: Transform = new Transform();

  // TODO - this may change dependening on the editor type
  readonly type = "display";
  public cursor = null;

  constructor(readonly workspace: Workspace) { }

  get activeEntity(): IEntity {
    return this.workspace.file.document.root;
  }

  get zoom() { return this.transform.scale; }
  set zoom(value: number) {
    this.transform.scale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, value)
    );
  }

  get currentTool(): IEditorTool {
    return this._currentTool;
  }

  set currentTool(value: IEditorTool) {
    if (this._currentTool) {
      this._currentTool.dispose();
    }
    this._currentTool = value;
    if (!value) return;
    this.cursor = value.cursor;
  }

  execute(action: Action) {
    if (this.currentTool) {
      this.currentTool.execute(action);
    }
  }
}