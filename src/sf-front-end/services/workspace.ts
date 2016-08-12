import { Action, FindAction } from "sf-core/actions";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { loggable } from "sf-core/decorators";
import { FrontEndApplication } from "sf-front-end/application";
import { Logger } from "sf-core/logger";
import { Workspace, EntityFile } from "sf-front-end/models";
import { SetToolAction, ZoomAction } from "sf-front-end/actions";
import { File } from "sf-common/models";
import { inject } from "sf-core/decorators";

const FILES_COLLECTION = "files";

@loggable()
export class WorkspaceService extends BaseApplicationService<FrontEndApplication> {

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  async initialize(action: Action) {
    await this._loadWorkspaces();
  }

  async _loadWorkspaces() {

    // TODO - File.findAll(this._dependencies).sync().observe(updateWorkspaces);
    for (const file of (await File.findAll(this._dependencies)).map((file) => file.sync())) {
      // TODO - this.app.workspaces = new Workspaces(files.map())
      this.bus.register(this.app.workspace = new Workspace(<EntityFile>file));
      file.observe(this.app.bus);
    }

  }

  zoom(action: ZoomAction) {
    this.app.workspace.editor.zoom += action.delta;
  }

  setTool(action: SetToolAction) {
    this.app.workspace.editor.currentTool = action.toolDependency.create(this.app.workspace.editor);
  }
}

export const dependency = new ApplicationServiceDependency("workspace", WorkspaceService);

