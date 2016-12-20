
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
import { FileEditorProvider } from "@tandem/sandbox";
import { pointerToolProvider } from "@tandem/editor/browser/stores/pointer-tool";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { EditorStore, Workspace } from "@tandem/editor/browser/stores";
import { CoreApplicationService } from "@tandem/common";
import { WorkspaceToolFactoryProvider, EditorStoreProvider } from "@tandem/editor/browser/providers";
import { SetToolRequest, ZoomRequest, ZoomOutRequest, ZoomInRequest, SetZoomRequest } from "@tandem/editor/browser/messages";

import {
  tween,
  CoreEvent,
  Logger,
  inject,
  loggable,
  Kernel,
  IDisposable,
  easeOutCubic,
  flattenTree,
  BoundingRect,
  watchProperty,
  InitializeApplicationRequest,
  KernelProvider,
  ApplicationServiceProvider,
} from "@tandem/common";


import { SelectSourceRequest } from "@tandem/editor/common";

// TODO - defer various messages to project file controller.

const normalizeZoom = (zoom) => {
  return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
}

@loggable()
export class WorkspaceService extends CoreApplicationService<IEditorBrowserConfig> {

  readonly logger: Logger;

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

  private _tweener: IDisposable;
  private _zoomTimeout: any;
  
  [ZoomRequest.ZOOM](message: ZoomRequest) {
    if (this._tweener) this._tweener.dispose();
    const delta = message.delta * this._store.workspace.zoom;

    if (!message.ease) {
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

  [ZoomRequest.ZOOM](message: ZoomRequest) {
    if (this._tweener) this._tweener.dispose();
    const delta = message.delta * this._store.workspace.zoom;

    if (!message.ease) {
      this._store.workspace.zoom += delta;
      return;
    }

    this._tweener = tween(this._store.workspace.zoom, this._store.workspace.zoom + delta, 200, (value) => {
      this._store.workspace.zoom = value;
    }, easeOutCubic);
  }

  [SetZoomRequest.SET_ZOOM](message: SetZoomRequest) {
    this._store.workspace.zoom = message.value;
  }

  [SetToolRequest.SET_TOOL](message: SetToolRequest) {
    // this._store.workspace.currentTool = message.toolFactory.create(this._store.workspace);
  }

  [SelectSourceRequest.SELECT_SOURCE]({ ranges, uri }: SelectSourceRequest) {
    const selection = [];

    flattenTree(this._store.workspace.document).forEach((item) => {
      const { source } = item;
      if (!source || source.uri !== uri || !source.start) return;

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