import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { ParallelBus, WrapBus } from "mesh";
import { IWorkspace, IWorkspaceTool } from "./base";

import {
  IActor,
  Action,
  inject,
  IPoint,
  bindable,
  bubble,
  watchProperty,
  Metadata,
  Observable,
  Transform,
  PropertyChangeAction,
  IInjectable,
} from "@tandem/common";

import { ISyntheticObject } from "@tandem/sandbox";
import { ISyntheticBrowser, SyntheticBrowser, SyntheticElementQuerier } from "@tandem/synthetic-browser";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Workspace extends Observable implements IWorkspace {

  readonly metadata = new Metadata(this);

  private _zoom: number = 1;
  public translate: IPoint = { left: 0, top: 0 };
  private _currentTool: IWorkspaceTool;
  private _browserObserver: IActor;

  /**
   * workspace canvas transform. TODO - may need to move this to WorkspaceCanvas object, or similar
   *
   * @type {Transform}
   */

  public transform: Transform = new Transform();

  /**
   * Selected objects by the user -- allows them to perform mutations
   * on synthetic objects.
   *
   * @type {ISyntheticObject[]}
   */

  public selection: ISyntheticObject[] = [];

  /**
   * The currently active synthetic browser of this workspace
   *
   * @type {ISyntheticBrowser}
   */

  @bindable(true)
  @bubble()
  public browser: ISyntheticBrowser;

  /**
   * singleton document querier for the editor so that view components
   * aren't calling the expensive querySelector function individually
   */

  readonly documentQuerier: SyntheticElementQuerier<any>;

  readonly type = "display";
  public cursor = null;

  constructor() {
    super();
    this._browserObserver = new WrapBus(this.onBrowserAction.bind(this));
    this.documentQuerier  = new SyntheticElementQuerier(undefined, "*");

    watchProperty(this, "browser", this.onBrowserChange.bind(this));
  }

  get document() {
    return this.browser && this.browser.document;
  }

  get visibleEntities() {

    // TODO
    return null;
  }

  get zoom() { return this.transform.scale; }
  set zoom(value: number) {
    const oldZoom = this.transform.scale;

    this.transform.scale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, value)
    );

    this.notify(new PropertyChangeAction("zoom", this.zoom, oldZoom, true));
  }

  // TODO - remove this
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

  private onBrowserChange(newBrowser: ISyntheticBrowser) {
    if (this.browser) this.browser.unobserve(this._browserObserver);
    newBrowser.observe(this._browserObserver);
    this.updatePropertiesFromBrowser();
  }

  private onBrowserAction(action: Action) {
    this.updatePropertiesFromBrowser();
  }

  private updatePropertiesFromBrowser() {
    this.documentQuerier.target = this.browser && this.browser.document;
  }
}