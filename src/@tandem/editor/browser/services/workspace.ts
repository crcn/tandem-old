
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
  BaseDecoratorRenderer,
  RemoteSyntheticBrowser,
  SyntheticRendererEvent,
  RemoteBrowserDocumentMessage,
} from "@tandem/synthetic-browser";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { pointerToolProvider } from "@tandem/editor/browser/models/pointer-tool";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";
import { GetPrimaryProjectFilePathRequest } from "@tandem/editor/common/messages";
import { ApplyFileEditRequest, FileEditorProvider } from "@tandem/sandbox";
import { WorkspaceToolFactoryProvider, EditorStoreProvider } from "@tandem/editor/browser/providers";
import { SetToolRequest, ZoomRequest, ZoomOutRequest, ZoomInRequest, SetZoomRequest } from "@tandem/editor/browser/messages";

import {
  File,
  tween,
  CoreEvent,
  Logger,
  inject,
  loggable,
  Injector,
  IDisposable,
  easeOutCubic,
  flattenTree,
  BoundingRect,
  watchProperty,
  InitializeRequest,
  InjectorProvider,
  ApplicationServiceProvider,
} from "@tandem/common";


import { OpenProjectRequest, SelectSourceRequest } from "@tandem/editor/common";

// TODO - defer various actions to project file controller.

const normalizeZoom = (zoom) => {
  return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
}

@loggable()
export class WorkspaceService extends CoreApplicationService<IEditorBrowserConfig> {

  readonly logger: Logger;

  @inject(EditorStoreProvider.ID)
  private _store: Store;

  private _tweener: IDisposable;
  private _zoomTimeout: any;

  async [InitializeRequest.INITIALIZE](action: CoreEvent) {
    await this._loadWorkspaces();
  }

  async _loadWorkspaces() {
    const filePath = await GetPrimaryProjectFilePathRequest.dispatch(this.bus);

    if (this._store.workspace && this._store.workspace.browser.location.toString() === filePath) return;

    this.logger.info("loading project file ", filePath);
    const workspace = this.injector.inject(new Workspace());
    const browser = workspace.browser = new RemoteSyntheticBrowser(this.injector, new CanvasRenderer(workspace, this.injector.inject(new SyntheticDOMRenderer())));
    await browser.open({ url: filePath });
    this._store.workspace = workspace;
  }

  async [OpenProjectRequest.OPEN_PROJECT_FILE](action: OpenProjectRequest) {

    // const path = action.filePath;

    // const syntheticDocument = this._store.workspace.document;

    // const root = <SyntheticDOMElement>syntheticDocument.body.firstChild;
    // const artboard = syntheticDocument.createElement("artboard");
    // artboard.setAttribute("src", path);

    // const edit = root.createEdit();

    // edit.appendChild(artboard);

    // this.bus.execute(new ApplyFileEditRequest(edit));

    return !document.hidden;
  }

  [ZoomRequest.ZOOM](action: ZoomRequest) {
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

  [ZoomInRequest.ZOOM_IN]() {
    this._store.workspace.zoom = normalizeZoom(this._store.workspace.zoom) * 2;
  }

  [ZoomOutRequest.ZOOM_OUT]() {
    this._store.workspace.zoom = normalizeZoom(this._store.workspace.zoom) / 2;
  }

  [ZoomRequest.ZOOM](action: ZoomRequest) {
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

  [SetZoomRequest.SET_ZOOM](action: SetZoomRequest) {
    this._store.workspace.zoom = action.value;
  }

  [SetToolRequest.SET_TOOL](action: SetToolRequest) {
    // this._store.workspace.currentTool = action.toolFactory.create(this._store.workspace);
  }

  [SelectSourceRequest.SELECT_SOURCE]({ ranges, filePath }: SelectSourceRequest) {
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