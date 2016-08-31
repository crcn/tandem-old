import { File } from "sf-common/models";
import { Logger } from "sf-core/logger";
import { inject } from "sf-core/decorators";
import { loggable } from "sf-core/decorators";
import { IDisposable } from "sf-core/object";
import { MetadataKeys } from "sf-front-end/constants";
import { tween, easeOutCubic } from "sf-core/animate";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { Workspace, DocumentFile } from "sf-front-end/models";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { Action, DSFindAction, INITIALIZE } from "sf-core/actions";
import { dependency as pointerToolDependency } from "sf-front-end/models/pointer-tool";
import { SetToolAction, ZoomAction, ZOOM, SET_TOOL } from "sf-front-end/actions";
import {
  Dependencies,
  DEPENDENCIES_NS,
  ApplicationServiceDependency,
} from "sf-core/dependencies";


export class WorkspaceService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;
  private _tweener: IDisposable;
  private _zoomTimeout: any;

  async [INITIALIZE](action: Action) {
    await this._loadWorkspaces();

    // set the pointer tool as default. TODO - this
    // will need to change if the editor differs depending on the file type
    await this.bus.execute(new SetToolAction(this._dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns)));
  }

  async _loadWorkspaces() {

    // TODO - File.findAll(this._dependencies).sync().observe(updateWorkspaces);
    for (const file of (await File.findAll(this._dependencies)).map((file) => file.sync() as DocumentFile<any>)) {
      console.log(file);

      // TODO - this.app.workspaces = new Workspaces(files.map())
      await file.load();
      this.bus.register(this.app.workspace = new Workspace(<DocumentFile<any>>file));
      file.observe(this.app.bus);
    }

  }

  [ZOOM](action: ZoomAction) {
    if (this._tweener) this._tweener.dispose();
    const delta = action.delta * this.app.workspace.editor.zoom;

    if (!action.ease) {
      this.app.workspace.editor.zoom += delta;
      this._zooming();
      return;
    }

    this._tweener = tween(this.app.workspace.editor.zoom, this.app.workspace.editor.zoom + delta, 200, (value) => {
      this.app.workspace.editor.zoom = value;
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
    }, 10);
  }

  [SET_TOOL](action: SetToolAction) {
    this.app.workspace.editor.currentTool = action.toolFactory.create(this.app.workspace.editor);
  }
}

export const dependency = new ApplicationServiceDependency("workspace", WorkspaceService);

