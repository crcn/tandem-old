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
    await this._loadInitialFile();
  }

  async _loadInitialFile() {
    const files = (await File.findAll(this._dependencies)).map((file) => {
      return file.sync();
    });

    window.files = files;
  }
}

export const dependency = new ApplicationServiceDependency("workspace", WorkspaceService);

