import * as fs from "fs";

import {
  File,
  inject,
  loggable,
  document,
  filterAction,
  Dependencies,
  IApplication,
  OpenFileAction,
  DEPENDENCIES_NS,
  OpenProjectAction,
  BaseApplicationService,
  ApplicationServiceDependency,
  GetPrimaryProjectFilePathAction,
  UpdateTemporaryFileContentAction,
} from "@tandem/common";

const tmpProjectFile = "/tmp/project.tdproject";

@loggable()
export default class ProjectService extends BaseApplicationService<IApplication> {
  private _primaryProjectPath: string;

  async [OpenProjectAction.OPEN_PROJECT_FILE](action: OpenProjectAction) {
    if (/\.tdproject$/.test(action.path)) {
      this._primaryProjectPath = action.path;
    } else if (!this._primaryProjectPath) {
      fs.writeFileSync(tmpProjectFile, `<tdproject xmlns="tandem"><frame src="${action.path}" /></tdproject>`);
      this._primaryProjectPath = tmpProjectFile;
    }
  }

  async [GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH](action: GetPrimaryProjectFilePathAction) {
    return this._primaryProjectPath;
  }
};

export const projectServiceDependency = new ApplicationServiceDependency("projectService", ProjectService);