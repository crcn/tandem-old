import * as fs from "fs";

import {
  File,
  inject,
  loggable,
  document,
  filterAction,
  Dependencies,
  IApplication,
  OpenProjectAction,
  DependenciesDependency,
  BaseApplicationService,
  ApplicationServiceDependency,
  GetPrimaryProjectFilePathAction,
} from "@tandem/common";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/editor/core";

const tmpProjectFile = "/tmp/project.tdm";

export class ProjectService extends CoreApplicationService<IEdtorServerConfig> {
  private _primaryProjectPath: string;

  async [OpenProjectAction.OPEN_PROJECT_FILE](action: OpenProjectAction) {
    console.log("opening project file", action.filePath);
    if (/\.tdm$/.test(action.filePath)) {
      this._primaryProjectPath = action.filePath;
    } else if (!this._primaryProjectPath) {
      fs.writeFileSync(tmpProjectFile, `<tdproject xmlns="tandem"><frame src="${action.filePath}" inherit-css /></tdproject>`);
      this._primaryProjectPath = tmpProjectFile;
    }
  }

  async [GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH](action: GetPrimaryProjectFilePathAction) {
    return this._primaryProjectPath;
  }
};
