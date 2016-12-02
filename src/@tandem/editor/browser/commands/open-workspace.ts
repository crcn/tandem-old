import { Workspace } from "@tandem/editor/browser/stores";
import { BoundingRect } from "@tandem/common";
import { OpenWorkspaceRequest } from "@tandem/editor/common";
import { BaseEditorBrowserCommand } from "./base";
import { RouteNames } from "@tandem/editor/browser/constants";

import { 
  BaseRenderer, 
  SyntheticDOMRenderer, 
  BaseDecoratorRenderer, 
  RemoteSyntheticBrowser, 
} from "@tandem/synthetic-browser";

export class OpenWorkspaceCommand extends BaseEditorBrowserCommand {
  async execute({ filePath }: OpenWorkspaceRequest) {
    const workspace = this.injector.inject(new Workspace());
    const browser = workspace.browser = new RemoteSyntheticBrowser(this.injector, new CanvasRenderer(workspace, this.injector.inject(new SyntheticDOMRenderer())));
    await browser.open({ url: filePath });
    this.editorStore.workspace = workspace;
    await this.editorStore.router.redirect(RouteNames.WORKSPACE);
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