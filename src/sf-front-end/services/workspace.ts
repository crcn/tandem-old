import { File } from "sf-common/models";
import { Logger } from "sf-core/logger";
import { inject } from "sf-core/decorators";
import { loggable } from "sf-core/decorators";
import { IDisposable } from "sf-core/object";
import { Action, FindAction } from "sf-core/actions";
import { tween, easeOutCubic } from "sf-core/animate";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { Workspace, DocumentFile } from "sf-front-end/models";
import { SetToolAction, ZoomAction } from "sf-front-end/actions";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { dependency as pointerToolDependency } from "sf-front-end/models/pointer-tool";
import {
  Dependencies,
  DEPENDENCIES_NS,
  ApplicationServiceDependency,
} from "sf-core/dependencies";

export class WorkspaceService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;
  private _tweener: IDisposable;

  async initialize(action: Action) {
    await this._loadWorkspaces();

    // set the pointer tool as default. TODO - this
    // will need to change if the editor differs depending on the file type
    await this.bus.execute(new SetToolAction(this._dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns)));
  }

  async _loadWorkspaces() {

    // TODO - File.findAll(this._dependencies).sync().observe(updateWorkspaces);
    for (const file of (await File.findAll(this._dependencies)).map((file) => file.sync())) {
      // TODO - this.app.workspaces = new Workspaces(files.map())
      this.bus.register(this.app.workspace = new Workspace(<DocumentFile>file));
      file.observe(this.app.bus);
    }

  }

  zoom(action: ZoomAction) {
    if (this._tweener) this._tweener.dispose();
    if (!action.ease) {
      this.app.workspace.editor.zoom += action.delta;
      return;
    }

    this._tweener = tween(this.app.workspace.editor.zoom, this.app.workspace.editor.zoom + action.delta, 200, (value) => {
      this.app.workspace.editor.zoom = value;
      this.app.bus.execute(new Action("zooming"));
    }, easeOutCubic);
  }

  setTool(action: SetToolAction) {
    this.app.workspace.editor.currentTool = action.textToolFactory.create(this.app.workspace.editor);
  }
}

export const dependency = new ApplicationServiceDependency("workspace", WorkspaceService);

