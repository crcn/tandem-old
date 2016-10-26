
import { WrapBus } from "mesh";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import {
  BaseRenderer,
  SyntheticDOMNode,
  SyntheticBrowser,
  SyntheticDOMElement,
  SyntheticDOMRenderer,
  BaseDecoratorRenderer,
  RemoteSyntheticBrowser,
  SyntheticRendererAction,
} from "@tandem/synthetic-browser";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { pointerToolDependency } from "@tandem/editor/browser/models/pointer-tool";
import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ApplyEditAction, FileEditorDependency } from "@tandem/sandbox";
import { WorkspaceToolFactoryDependency, StoreDependency } from "@tandem/editor/browser/dependencies";
import { SetToolAction, ZoomAction, SetZoomAction, DocumentFileAction } from "@tandem/editor/browser/actions";

import {
  File,
  tween,
  Action,
  inject,
  loggable,
  IDisposable,
  easeOutCubic,
  BoundingRect,
  DSFindAction,
  watchProperty,
  Dependencies,
  InitializeAction,
  OpenProjectAction,
  DependenciesDependency,
  BaseApplicationService,
  ApplicationServiceDependency,
  GetPrimaryProjectFilePathAction,
} from "@tandem/common";

export class WorkspaceService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(StoreDependency.ID)
  private _store: Store;

  private _tweener: IDisposable;
  private _zoomTimeout: any;

  async [InitializeAction.INITIALIZE](action: Action) {
    await this._loadWorkspaces();
  }

  async _loadWorkspaces() {

    const filePath = await GetPrimaryProjectFilePathAction.execute(this.bus);

    if (this._store.workspace && this._store.workspace.browser.location.toString() === filePath) return;

    console.info("loading project file %s", filePath);

    const workspace = new Workspace();

    const browser = workspace.browser = new RemoteSyntheticBrowser(this.dependencies, new CanvasRenderer(workspace, new SyntheticDOMRenderer()));

    await browser.open(filePath);

    this._store.workspace = workspace;

    // await this.bus.execute(new SetToolAction(this.dependencies.query<WorkspaceToolFactoryDependency>(pointerToolDependency.id)));
  }

  async [OpenProjectAction.OPEN_PROJECT_FILE](action: OpenProjectAction) {

    const path = action.filePath;

    // if (!/\.tdm$/.test(path)) {
    //   const body = this.app.workspace.browser.document.body;
    //   const { editor } = body.firstChild.module;

    //   editor.edit((edit) => {
    //     const frame = this.app.workspace.browser.document.createElement("artboard");
    //     frame.setAttribute("src", path);
    //     edit.appendChildNode(frame);
    //   });
    // } else {
    //   await this._loadWorkspaces();
    // }

    // if the document is hidden, then notify the back-end
    // that there is no visible tandem window, so it should open another
    // browser tab
    return !document.hidden;
  }

  [ZoomAction.ZOOM](action: ZoomAction) {
    if (this._tweener) this._tweener.dispose();
    const delta = action.delta * this._store.workspace.zoom;

    if (!action.ease) {
      this._store.workspace.zoom += delta;
      return;
    }

    this._tweener = tween(this._store.workspace.zoom, this._store.workspace.zoom + delta, 200, (value) => {
      this._store.workspace.zoom = value;
    }, easeOutCubic);
  }

  [SetZoomAction.SET_ZOOM](action: SetZoomAction) {
    this._store.workspace.zoom = action.value;
  }

  [ApplyEditAction.APPLY_EDITS]({ edit }: ApplyEditAction) {
    return FileEditorDependency.getInstance(this.dependencies).applyEditActions(...edit.actions);
  }


  [SetToolAction.SET_TOOL](action: SetToolAction) {
    this._store.workspace.currentTool = action.toolFactory.create(this._store.workspace);
  }
}

/**
 * Offset the transform skewing that happens with the editor
 */

class CanvasRenderer extends BaseDecoratorRenderer {
  private _rects: any;

  constructor(readonly workspace: Workspace, _renderer: BaseRenderer) {
    super(_renderer);
    this._rects = {};
  }

  getBoundingRect(uid: string) {
    return this._rects[uid] || BoundingRect.zeros();
  }

  protected onTargetRendererSetRectangles() {
    const offsetRects = {};
    const { transform } = this.workspace;
    const rects = (<BaseRenderer>this._renderer).rects;
    for (const uid in rects) {
      offsetRects[uid] = (<BoundingRect>rects[uid]).move({
        left: -transform.left,
        top: -transform.top
      }).zoom(1 / transform.scale);
    }
    this._rects = offsetRects;
  }
}