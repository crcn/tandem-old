
import { CallbackDispatcher } from "@tandem/mesh";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import {
  DOMNodeType,
  BaseRenderer,
  SyntheticDOMNode,
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticDOMRenderer,
  isDOMMutationAction,
  BaseDecoratorRenderer,
  RemoteSyntheticBrowser,
  SyntheticRendererAction,
  RemoteBrowserDocumentAction,
} from "@tandem/synthetic-browser";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { pointerToolProvider } from "@tandem/editor/browser/models/pointer-tool";
import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ApplyFileEditAction, FileEditorProvider } from "@tandem/sandbox";
import { WorkspaceToolFactoryProvider, StoreProvider } from "@tandem/editor/browser/providers";
import { SetToolAction, ZoomAction, SetZoomAction, DocumentFileAction } from "@tandem/editor/browser/actions";

import {
  File,
  tween,
  Action,
  Logger,
  inject,
  loggable,
  Injector,
  IDisposable,
  easeOutCubic,
  flattenTree,
  BoundingRect,
  DSFindAction,
  watchProperty,
  InitializeAction,
  InjectorProvider,
  ApplicationServiceProvider,
  GetPrimaryProjectFilePathAction,
} from "@tandem/common";


import { OpenProjectAction, SelectSourceAction } from "@tandem/editor/common";

// TODO - defer various actions to project file controller.

@loggable()
export class WorkspaceService extends CoreApplicationService<IEditorBrowserConfig> {

  readonly logger: Logger;

  @inject(StoreProvider.ID)
  private _store: Store;

  private _tweener: IDisposable;
  private _zoomTimeout: any;

  async [InitializeAction.INITIALIZE](action: Action) {
    await this._loadWorkspaces();
  }

  async _loadWorkspaces() {

    const filePath = await GetPrimaryProjectFilePathAction.dispatch(this.bus);

    if (this._store.workspace && this._store.workspace.browser.location.toString() === filePath) return;

    this.logger.info("loading project file %s", filePath);
    const workspace = this.injector.inject(new Workspace());
    const browser = workspace.browser = new RemoteSyntheticBrowser(this.injector, new CanvasRenderer(workspace, this.injector.inject(new SyntheticDOMRenderer())));
    await browser.open({ url: filePath });
    this._store.workspace = workspace;
  }

  async [OpenProjectAction.OPEN_PROJECT_FILE](action: OpenProjectAction) {

    // const path = action.filePath;

    // const syntheticDocument = this._store.workspace.document;

    // const root = <SyntheticDOMElement>syntheticDocument.body.firstChild;
    // const artboard = syntheticDocument.createElement("artboard");
    // artboard.setAttribute("src", path);

    // const edit = root.createEdit();

    // edit.appendChild(artboard);

    // this.bus.execute(new ApplyFileEditAction(edit));

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

  [SetToolAction.SET_TOOL](action: SetToolAction) {
    // this._store.workspace.currentTool = action.toolFactory.create(this._store.workspace);
  }

  [SelectSourceAction.SELECT_SOURCE]({ ranges, filePath }: SelectSourceAction) {
    const selection = [];

    flattenTree(this._store.workspace.document).forEach((item) => {
      const { source } = item;
      if (!source || source.filePath !== filePath || !source.start) return;

      for (const range of ranges) {
        if (
          (range.start.line < source.start.line || (range.start.line <= source.start.line &&
          range.start.column <= source.start.column)) &&

          (range.end.line > source.start.line || (range.end.line == source.start.line &&
          range.end.column >= source.start.column))) {
            selection.push(item);
            break;
          }
      }
    });

    this._store.workspace.select(selection);
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
    const rects = (<BaseRenderer>this._renderer).$rects;
    for (const uid in rects) {
      offsetRects[uid] = (<BoundingRect>rects[uid]).move({
        left: -transform.left,
        top: -transform.top
      }).zoom(1 / transform.scale);
    }
    this._rects = offsetRects;
  }
}