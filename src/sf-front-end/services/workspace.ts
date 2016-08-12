import { Action, FindAction } from "sf-core/actions";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { loggable } from "sf-core/decorators";
import { FrontEndApplication } from "sf-front-end/application";
import { Logger } from "sf-core/logger";
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
      this.app.editor.file = <any>file;
      file.observe(this.app.bus);
    }
  }
}

export const dependency = new ApplicationServiceDependency("workspace", WorkspaceService);

