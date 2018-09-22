import { fork, put, call, take, select } from "redux-saga/effects";
import * as path from "path";
import {
  projectDirectoryLoaded,
  PROJECT_DIRECTORY_LOADED,
  FILE_NAVIGATOR_ITEM_CLICKED,
  fileNavigatorItemClicked,
  FileNavigatorItemClicked,
  OpenFilesItemClick,
  OPEN_FILE_ITEM_CLICKED,
  SHORTCUT_SAVE_KEY_DOWN,
  savedFile,
  projectInfoLoaded,
  PROJECT_INFO_LOADED,
  projectDirectoryDirLoaded
} from "../actions";
import {
  File,
  Directory,
  getFilesWithExtension,
  getFilePath,
  addProtocol,
  FILE_PROTOCOL,
  getTreeNodePath,
  getTreeNodeFromPath,
  getFilePathFromNodePath,
  FSItem,
  FSItemTagNames
} from "tandem-common";
import { ProjectConfig, ProjectInfo, RootState } from "../state";


export type ProjectSagaOptions = {
  loadProjectInfo(): IterableIterator<ProjectInfo>;
  readDirectory(path: string): IterableIterator<FSItem>;
}

export function projectSaga({ loadProjectInfo, readDirectory }: ProjectSagaOptions) {
  return function*() {
    yield fork(init);
    yield fork(handleProjectLoaded);
    yield fork(handleFileNavigatorItemClick);
  }
  
  function* init() {
    yield put(projectInfoLoaded(yield call(loadProjectInfo)));
  }


  function* handleProjectLoaded() {
    while(1) {
      yield take(PROJECT_INFO_LOADED);
      const { projectInfo }: RootState = yield select();

      // may not have loaded if tandem was opened without pointing to project
      if (!projectInfo) {
        continue;
      }
      
      yield call(loadDirectory, path.dirname(projectInfo.path));
    }
  }

  function* loadDirectory(path: string) {
    const items = (yield call(readDirectory, path));
    yield put(projectDirectoryDirLoaded(items));
  }

  function* handleFileNavigatorItemClick() {
    while(1) {
      const { node }: FileNavigatorItemClicked = yield take(FILE_NAVIGATOR_ITEM_CLICKED,);
      if (node.name !== FSItemTagNames.DIRECTORY) {
        continue;
      }
      yield call(loadDirectory, node.uri);
    }
  }
};
