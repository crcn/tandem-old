
import { WrapBus } from "mesh";
import { MetadataKeys } from "@tandem/editor/constants";
import { SyntheticBrowser } from "@tandem/synthetic-browser";
import { FrontEndApplication } from "@tandem/editor/application";
import { pointerToolDependency } from "@tandem/editor/models/pointer-tool";
import { EditorToolFactoryDependency } from "@tandem/editor/dependencies";
import { Workspace, DocumentFile, Editor } from "@tandem/editor/models";
import { SetToolAction, ZoomAction, DocumentFileAction } from "@tandem/editor/actions";

import {
  File,
  tween,
  Action,
  Logger,
  inject,
  loggable,
  IDisposable,
  easeOutCubic,
  DSFindAction,
  watchProperty,
  Dependencies,
  DEPENDENCIES_NS,
  InitializeAction,
  OpenProjectAction,
  BaseApplicationService,
  ApplicationServiceDependency,
  GetPrimaryProjectFilePathAction,
} from "@tandem/common";

@loggable()
export class WorkspaceService extends BaseApplicationService<FrontEndApplication> {
  public logger: Logger;

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;
  private _tweener: IDisposable;
  private _zoomTimeout: any;

  async [InitializeAction.INITIALIZE](action: Action) {
    await this._loadWorkspaces();
  }

  async _loadWorkspaces() {

    const filePath = await GetPrimaryProjectFilePathAction.execute(this.bus);

    if (this.app.editor && this.app.editor.browser.location.toString() === filePath) return;

    this.logger.info("loading project file %s", filePath);

    const browser = new SyntheticBrowser(this._dependencies);
    browser.observe({ execute: (action) => this.bus.execute(action) });
    await browser.open(filePath);

    this.app.editor = new Editor(browser);
    this.bus.register(this.app.editor);

    await this.bus.execute(new SetToolAction(this._dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns)));
  }

  async [OpenProjectAction.OPEN_PROJECT_FILE](action: OpenProjectAction) {
    await this._loadWorkspaces();

    // if the document is hidden, then notify the back-end
    // that there is no visible tandem window, so it should open another
    // browser tab
    return !document.hidden;
  }


  [ZoomAction.ZOOM](action: ZoomAction) {
    if (this._tweener) this._tweener.dispose();
    const delta = action.delta * this.app.editor.zoom;

    if (!action.ease) {
      this.app.editor.zoom += delta;
      this._zooming();
      return;
    }

    this._tweener = tween(this.app.editor.zoom, this.app.editor.zoom + delta, 200, (value) => {
      this.app.editor.zoom = value;
      this._zooming();
    }, easeOutCubic);
  }


  private _zooming() {
    clearTimeout(this._zoomTimeout);
    this.app.metadata.set(MetadataKeys.ZOOMING, true);
    this.app.bus.execute(new Action("zooming"));
    this._zoomTimeout = setTimeout(() => {
      this.app.metadata.set(MetadataKeys.ZOOMING, false);
      this.app.bus.execute(new Action("zoomingComplete"));
    }, 100);
  }

  [SetToolAction.SET_TOOL](action: SetToolAction) {
    this.app.editor.currentTool = action.toolFactory.create(this.app.editor);
  }
}

export const workspaceDependency = new ApplicationServiceDependency("workspace", WorkspaceService);

