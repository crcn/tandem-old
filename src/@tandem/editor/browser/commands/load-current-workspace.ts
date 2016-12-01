import { IMessage } from "@tandem/mesh";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { GetPrimaryProjectFilePathRequest } from "@tandem/editor/common/messages";
import { 
  BaseRenderer, 
  SyntheticDOMRenderer,
  BaseDecoratorRenderer, 
  RemoteSyntheticBrowser, 
} from "@tandem/synthetic-browser";
import { 
  inject, 
  BrokerBus, 
  BaseCommand, 
  BoundingRect, 
  InjectorProvider, 
  PrivateBusProvider, 
} from "@tandem/common";

export class LoadCurrentWorkspaceCommand extends BaseCommand {

  @inject(EditorStoreProvider.ID)
  private _store: Store;

  async execute(message: IMessage) {
    const filePath = await GetPrimaryProjectFilePathRequest.dispatch(this.bus);
    if (this._store.workspace && this._store.workspace.browser.location.toString() === filePath) return;
    if (!filePath) return;

    const workspace = this.injector.inject(new Workspace());
    const browser = workspace.browser = new RemoteSyntheticBrowser(this.injector, new CanvasRenderer(workspace, this.injector.inject(new SyntheticDOMRenderer())));
    await browser.open({ url: filePath });
    this._store.workspace = workspace;
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