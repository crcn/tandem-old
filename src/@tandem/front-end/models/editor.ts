import { Workspace } from "./workspace";
import { KeyBinding } from "@tandem/front-end/key-bindings";
import { ParallelBus } from "mesh";
import { IEditor, IEditorTool } from "./base";

import {
  SyntheticBrowser,
  IActor,
  Action,
  inject,
  IEntity,
  Metadata ,
  IInjectable,
  IPoint,
  Transform
} from "@tandem/common";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Editor implements IEditor {

  readonly metadata = new Metadata(this);

  private _zoom: number = 1;
  public translate: IPoint = { left: 0, top: 0 };
  private _currentTool: IEditorTool;
  public transform: Transform = new Transform();
  public selection: any[] = [];

  // TODO - this may change dependening on the editor type
  readonly type = "display";
  public cursor = null;

  constructor(readonly browser: SyntheticBrowser) {}

  get activeEntity(): IEntity {
    return null;
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