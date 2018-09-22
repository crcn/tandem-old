import { fork, put, call, take, select } from "redux-saga/effects";
import {
  projectDirectoryLoaded,
  PROJECT_DIRECTORY_LOADED,
  FILE_NAVIGATOR_ITEM_CLICKED,
  fileNavigatorItemClicked,
  FileNavigatorItemClicked,
  OpenFilesItemClick,
  OPEN_FILE_ITEM_CLICKED,
  SHORTCUT_SAVE_KEY_DOWN,
  savedFile
} from "../actions";
import { PAPERCLIP_DEFAULT_EXTENSIONS, loadEntry, PCConfig } from "paperclip";
import {
  File,
  Directory,
  getFilesWithExtension,
  getFilePath,
  getTreeNodePath,
  getTreeNodeFromPath,
  getFilePathFromNodePath
} from "tandem-common";
import { ProjectConfig, ProjectInfo } from "../state";


export type ProjectSagaOptions = {
  loadProjectInfo(): IterableIterator<ProjectInfo>;
}

export function projectSaga({ loadProjectInfo }: ProjectSagaOptions) {
  return function*() {
    yield fork(init);
  }
  
  function* init() {
    const config: ProjectConfig = yield call(loadProjectInfo);
    console.log("CONFIG", config);
  }
};
