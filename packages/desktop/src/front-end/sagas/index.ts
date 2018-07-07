import { fork, select, take, call, put } from "redux-saga/effects";
import * as fs from "fs";
import * as fsa from "fs-extra";
import * as path from "path";
import { ipcSaga } from "./ipc";
import { eventChannel } from "redux-saga";
import { ipcRenderer } from "electron";
import { dialog } from "electron";
import {
  RootState,
  PROJECT_DIRECTORY_LOADED,
  FILE_NAVIGATOR_NEW_FILE_ENTERED,
  SHORTCUT_SAVE_KEY_DOWN,
  savedFile,
  FileNavigatorNewFileEntered,
  newFileAdded,
  InsertFileType,
  FILE_NAVIGATOR_DROPPED_ITEM,
  getActiveEditorWindow,
  ADD_COMPONENT_CONTROLLER_BUTTON_CLICKED,
  componentControllerPicked
} from "tandem-front-end";
import { findPaperclipSourceFiles, pcSourceFileUrisReceived } from "paperclip";
import {
  getNestedTreeNodeById,
  addProtocol,
  stripProtocol,
  Directory,
  FILE_PROTOCOL,
  FSItemTagNames
} from "tandem-common";
import { serverStateLoaded, SERVER_STATE_LOADED } from "../actions";
import { DesktopRootState } from "../state";

export function* rootSaga() {
  yield fork(ipcSaga);
  yield fork(handleSaveShortcut);
  // yield fork(handleActivePaperclipFile);
  yield fork(handleNewFileEntered);
  yield fork(handleDroppedFile);
  yield fork(handleProjectDirectory);
  yield fork(receiveServerState);
}

function* handleProjectDirectory() {
  while (1) {
    yield take(SERVER_STATE_LOADED);
    yield call(loadPCFiles);
  }
}

function* loadPCFiles() {
  const { serverState }: DesktopRootState = yield select();
  if (!serverState || !serverState.tdProject) {
    return;
  }

  const sourceFiles = findPaperclipSourceFiles(
    serverState.tdProject,
    stripProtocol(path.dirname(serverState.tdProjectPath))
  ).map(path => addProtocol(FILE_PROTOCOL, path));
  yield put(pcSourceFileUrisReceived(sourceFiles));
}

function* handleNewFileEntered() {
  while (1) {
    const { basename }: FileNavigatorNewFileEntered = yield take(
      FILE_NAVIGATOR_NEW_FILE_ENTERED
    );
    const {
      insertFileInfo: { directoryId, type: insertType },
      projectDirectory
    }: RootState = yield select();
    const directory: Directory = getNestedTreeNodeById(
      directoryId,
      projectDirectory
    );
    const uri = directory.uri;
    const filePath = path.join(stripProtocol(uri), basename);

    if (fs.existsSync(filePath)) {
      continue;
    }

    if (insertType === InsertFileType.FILE) {
      fs.writeFileSync(filePath, "");
    } else {
      fs.mkdirSync(filePath);
    }

    yield put(
      newFileAdded(
        addProtocol(FILE_PROTOCOL, filePath),
        insertType === InsertFileType.FILE
          ? FSItemTagNames.FILE
          : FSItemTagNames.DIRECTORY
      )
    );
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

function* receiveServerState() {
  const chan = eventChannel(emit => {
    ipcRenderer.on("serverState", (event, arg) => emit(arg));
    return () => {};
  });

  yield fork(function*() {
    while (1) {
      const state = yield take(chan);
      yield put(serverStateLoaded(state));
    }
  });

  while (1) {
    yield take(PROJECT_DIRECTORY_LOADED);
    ipcRenderer.send("getServerState");
  }
}
