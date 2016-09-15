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
} from "tandem-common";

@loggable()
export default class ProjectService extends BaseApplicationService<IApplication> {
  private _primaryProjectPath: string;

  async [OpenProjectAction.OPEN_PROJECT_FILE](action: OpenProjectAction) {
    this._primaryProjectPath = action.path;
  }

  async [GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH](action: GetPrimaryProjectFilePathAction) {
    return this._primaryProjectPath;
  }
};

export const dependency = new ApplicationServiceDependency("projectService", ProjectService);