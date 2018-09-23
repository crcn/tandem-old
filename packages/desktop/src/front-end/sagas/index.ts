import { cancelled, cancel, fork, select, take, call, put, spawn as spawn2, throttle } from "redux-saga/effects";
import { delay } from "redux-saga";
import * as fs from "fs";
import * as chokidar from "chokidar";
import * as fsa from "fs-extra";
import { debounce } from "lodash";
import { exec } from "child_process";
import * as path from "path";
import { ipcSaga } from "./ipc";
import { eventChannel } from "redux-saga";
import {
  RootState,
  // PROJECT_DIRECTORY_LOADED,
  FILE_NAVIGATOR_NEW_FILE_ENTERED,
  SHORTCUT_SAVE_KEY_DOWN,
  savedFile,
  FileNavigatorNewFileEntered,
  newFileAdded,
  FILE_NAVIGATOR_DROPPED_ITEM,
  getActiveEditorWindow,
  ADD_COMPONENT_CONTROLLER_BUTTON_CLICKED,
  componentControllerPicked,
  OPEN_CONTROLLER_BUTTON_CLCIKED,
  ComponentPickerItemClick,
  ComponentControllerItemClicked,
  FileNavigatorBasenameChanged,
  FILE_NAVIGATOR_BASENAME_CHANGED,
  PROJECT_INFO_LOADED,
  PROJECT_DIRECTORY_DIR_LOADED,
  fileChanged,
  FileChanged,
  FILE_CHANGED,
  FileChangedEventType,
  ProjectInfoLoaded,
  QUICK_SEARCH_FILTER_CHANGED,
  QuickSearchUriResult,
  quickSearchFilterResultLoaded,
  QuickSearchResultType
} from "tandem-front-end";
import {
  findPaperclipSourceFiles,
  pcSourceFileUrisReceived,
  getSyntheticSourceUri,
  getSyntheticNodeById,
  getSyntheticSourceNode,
  isPaperclipUri,
  walkPCRootDirectory
} from "paperclip";
import {
  getNestedTreeNodeById,
  addProtocol,
  stripProtocol,
  Directory,
  FILE_PROTOCOL,
  FSItemTagNames,
  flattenTreeNode,
  getFileFromUri
} from "tandem-common";
// import { serverStateLoaded } from "../actions";
import { DesktopRootState } from "../state";
import { Action } from "redux";

export function* rootSaga() {
  yield fork(ipcSaga);
  yield fork(handleSaveShortcut);
  // yield fork(handleActivePaperclipFile);
  yield fork(handleNewFileEntered);
  yield fork(handleBasenameChanged);
  yield fork(handleDroppedFile);
  yield fork(handleProjectDirectory);
  // yield fork(receiveServerState);
  yield fork(handleOpenController);
  yield fork(watchProjectDirectory);
  yield fork(handleQuickSearch);
}


function* handleProjectDirectory() {
  let task;
  while(1) {
    const action = yield take((action: ProjectInfoLoaded | FileChanged) => {
      return action.type === PROJECT_INFO_LOADED || (action.type === FILE_CHANGED && /add|unlink/.test((action as FileChanged).eventType) && isPaperclipUri((action as FileChanged).uri));
    });

    if (task) {
      yield cancel(task);
    }

    task = yield fork(function*() {
      yield delay(10);
      yield call(loadPCFiles);
    });
  }
}

function* loadPCFiles() {
  const { projectInfo }: DesktopRootState = yield select();
  if (!projectInfo) {
    return;
  }

  const sourceFiles = findPaperclipSourceFiles(
    projectInfo.config,
    stripProtocol(path.dirname(projectInfo.path))
  ).map(path => addProtocol(FILE_PROTOCOL, path));
  yield put(pcSourceFileUrisReceived(sourceFiles));
}

function* handleBasenameChanged() {
  while (1) {
    const { basename, item }: FileNavigatorBasenameChanged = yield take(
      FILE_NAVIGATOR_BASENAME_CHANGED
    );
    const filePath = stripProtocol(item.uri);
    const newFilePath = path.join(path.dirname(filePath), basename);

    // TODO - this needs to be a prompt
    if (fsa.existsSync(newFilePath)) {
      console.error(
        `Cannot rename file to ${basename} since the file already exists.`
      );
      continue;
    }

    fsa.renameSync(filePath, newFilePath);
  }
}

function* handleNewFileEntered() {
  while (1) {
    const {
      basename,
      directoryId,
      insertType
    }: FileNavigatorNewFileEntered = yield take(
      FILE_NAVIGATOR_NEW_FILE_ENTERED
    );
    const { projectDirectory }: RootState = yield select();
    const directory: Directory = getNestedTreeNodeById(
      directoryId,
      projectDirectory
    );
    const uri = directory.uri;
    const filePath = path.join(stripProtocol(uri), basename);

    if (fs.existsSync(filePath)) {
      continue;
    }

    if (insertType === FSItemTagNames.FILE) {
      fs.writeFileSync(filePath, "");
    } else {
      fs.mkdirSync(filePath);
    }

    yield put(newFileAdded(addProtocol(FILE_PROTOCOL, filePath), insertType));
  }
}

function* handleDroppedFile() {
  while (1) {
    const { node, targetNode, offset } = yield take(
      FILE_NAVIGATOR_DROPPED_ITEM
    );
    const root: RootState = yield select();
    const newNode = getNestedTreeNodeById(node.id, root.projectDirectory);
    const newUri = newNode.uri;
    const oldUri = node.uri;
    fsa.moveSync(stripProtocol(oldUri), stripProtocol(newUri));
  }
}

function* handleSaveShortcut() {
  while (1) {
    yield take(SHORTCUT_SAVE_KEY_DOWN);
    const state: RootState = yield select();
    const activeEditor = getActiveEditorWindow(state);
    for (const openFile of state.openFiles) {
      if (openFile.newContent) {
        yield call(saveFile, openFile.uri, openFile.newContent);
        yield put(savedFile(openFile.uri));
      }
    }
  }
}

const saveFile = (uri: string, content: Buffer) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(stripProtocol(uri), content, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};


function* watchProjectDirectory() {

  let watcher;
  let watching: string[] = [];

  yield fork(function* startWatcher() {


    const chan = eventChannel((emit) => {
      watcher = chokidar.watch([], {
        depth: 0,
        ignoreInitial: true,
        persistent: true
      });

      let actions: FileChanged[] = [];

      // batch to prevent flickering
      const batch = debounce(() => {
        const _actions = actions;
        actions = [];
        _actions.forEach(emit);
      }, 10);
      watcher.once("ready", () => {
        watcher.on("all", (event, path) => {
          console.log(event, path);
          if (/\.DS_Store/.test(path)) {
            return;
          }
          actions.push(fileChanged(event, addProtocol(FILE_PROTOCOL, path)));
          batch();
        });
      });
      return () => {
        watcher.close();
      }
    }); 
    while(1) {
      const action: FileChanged = yield take(chan);
      yield put(action);
    }
  }) 

  yield fork(function* handleDirsLoaded() {
    while(1) {
      yield take(PROJECT_DIRECTORY_DIR_LOADED);
      const { projectDirectory }: RootState = yield select();
      const expandedFilePaths = flattenTreeNode(projectDirectory).map(item => stripProtocol(item.uri));
      watching.push(...expandedFilePaths);
      watcher.add(expandedFilePaths);
    }
  });

  yield fork(function* handleChangedFiles() {
    while(1) {
      const { eventType, uri }: FileChanged = yield take(FILE_CHANGED);
      const filePath = stripProtocol(uri);
      switch(eventType) {
        case FileChangedEventType.ADD_DIR: 
        case FileChangedEventType.ADD: {
          if (watching.indexOf(filePath) === -1) { 
            watching.push(filePath);
            watcher.add(filePath);
          }
          break;
        }
        case FileChangedEventType.UNLINK_DIR:
        case FileChangedEventType.UNLINK: {
          const i = watching.indexOf(filePath);
          if (i !== -1) {
            watching.splice(i, 1);
          }
          break;
        }
      }
    }
  });
}

// function* 
// () {
//   const chan = eventChannel(emit => {
//     ipcRenderer.on("serverState", (event, arg) => emit(arg));
//     return () => {};
//   });

//   yield fork(function*() {
//     while (1) {
//       const state = yield take(chan);
//       yield put(serverStateLoaded(state));
//     }
//   });

//   // while (1) {
//   //   yield take(PROJECT_DIRECTORY_LOADED);
//   //   ipcRenderer.send("getServerState");
//   // }
// }

function* handleOpenController() {
  while (1) {
    const { relativePath }: ComponentControllerItemClicked = yield take(
      OPEN_CONTROLLER_BUTTON_CLCIKED
    );
    const state: DesktopRootState = yield select();
    const node = getSyntheticNodeById(
      state.selectedSyntheticNodeIds[0],
      state.documents
    );
    const sourceNodeUri = getSyntheticSourceUri(node, state.graph);
    const controllerPath = path.join(
      path.dirname(stripProtocol(sourceNodeUri)),
      relativePath
    );
    console.log("opening controller %s", controllerPath);
    exec(`open "${controllerPath}"`, error => {
      if (error) {
        alert(error.message);
      }
    });
  }
}

function* handleQuickSearch() {
  yield throttle(10, QUICK_SEARCH_FILTER_CHANGED, function*() {
    
    const {quickSearch, projectInfo}: RootState = yield select();
    if (!projectInfo) {
      return;
    }
    if (!quickSearch.filter) {
      return;
    }

    const pattern = new RegExp(quickSearch.filter.split(" ").join(".*?"));

    const projectDir = path.dirname(projectInfo.path);

    let results: QuickSearchUriResult[] = [];

    walkPCRootDirectory(projectInfo.config, projectDir, (filePath) => {
      if (pattern.test(filePath)) {
        results.push({
          uri: addProtocol(FILE_PROTOCOL, filePath),
          label: path.basename(filePath),
          description: path.dirname(filePath),
          type: QuickSearchResultType.URI
        });
      }
    });
    yield put(quickSearchFilterResultLoaded(results.slice(0, 50)));

  });
}