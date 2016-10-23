import { KeyBinding } from "@tandem/editor/key-bindings";
import { ParallelBus } from "mesh";
import { IWorkspace, IWorkspaceTool } from "./base";

import {
  IActor,
  Action,
  inject,
  IPoint,
  Metadata,
  Transform,
  IInjectable,
} from "@tandem/common";

import { ISyntheticObject } from "@tandem/sandbox";
import { ISyntheticBrowser, SyntheticBrowser } from "@tandem/synthetic-browser";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

// TODO - change to Workspace
export class Workspace implements IWorkspace {

  readonly metadata = new Metadata(this);

  private _zoom: number = 1;
  public translate: IPoint = { left: 0, top: 0 };
  private _currentTool: IWorkspaceTool;
  public transform: Transform = new Transform();
  public selection: ISyntheticObject[] = [];
  public browser: ISyntheticBrowser;

  // TODO - this may change dependening on the editor type
  readonly type = "display";
  public cursor = null;

  constructor() {}

  get document() {
    return this.browser && this.browser.document;
  }

  get visibleEntities() {

    // TODO
    return null;
  }

  get zoom() { return this.transform.scale; }
  set zoom(value: number) {
    this.transform.scale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, value)
    );
  }

  get currentTool(): IWorkspaceTool {
    return this._currentTool;
  }

  set currentTool(value: IWorkspaceTool) {
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