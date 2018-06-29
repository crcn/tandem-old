import { fork, select, take, call, put } from "redux-saga/effects";
import * as fs from "fs";
import * as fsa from "fs-extra";
import * as path from "path";
import { ipcSaga } from "./ipc";
import {
  addProtocol,
  stripProtocol,
  Directory,
  FILE_PROTOCOL,
  FSItemTagNames
} from "tandem-common";
import { findPaperclipSourceFiles, openPCConfig, pcSourceFileUrisReceived } from "paperclip";
import {
  RootState,
  FILE_NAVIGATOR_ITEM_CLICKED,
  PROJECT_DIRECTORY_LOADED,
  OPEN_FILE_ITEM_CLICKED,
  PAPERCLIP_DEFAULT_EXTENSIONS,
  FILE_NAVIGATOR_NEW_FILE_ENTERED,
  loadEntry,
  SHORTCUT_SAVE_KEY_DOWN,
  savedFile,
  getOpenFile,
  FileNavigatorNewFileEntered,
  getNestedTreeNodeById,
  newFileAdded,
  InsertFileType,
  FILE_NAVIGATOR_DROPPED_ITEM,
  getActiveEditorWindow
} from "tandem-front-end";

export function* rootSaga() {
  yield fork(ipcSaga);
  yield fork(handleSaveShortcut);
  // yield fork(handleActivePaperclipFile);
  yield fork(handleNewFileEntered);
  yield fork(handleDroppedFile);
  yield fork(handleProjectDirectory);
}

function* handleProjectDirectory() {
  while(1) {
    yield take(PROJECT_DIRECTORY_LOADED);
    yield call(loadPCFiles);
  }
}

function* loadPCFiles() {
  const state: RootState = yield select();
  if (!state.projectDirectory) {
    return [];
  }

  // TODO - need to hit back-end API for this since CWD could be different
  const sourceFiles = findPaperclipSourceFiles(
    openPCConfig(stripProtocol(state.projectDirectory.uri)).config,
    stripProtocol(state.projectDirectory.uri)
  ).map(path => addProtocol(FILE_PROTOCOL, path));

  yield put(pcSourceFileUrisReceived(sourceFiles));
}

// function* handleActivePaperclipFile() {
//   let oldState: RootState;

//   while (1) {
//     yield take();
//     const state: RootState = yield select();
//     const { editors, browser } = state;

//     const newPCEditors = editors.filter(editor => {
//       return (
//         !getEditorWithActiveFileUri(editor.activeFilePath, oldState) &&
//         editor.activeFilePath.indexOf(PAPERCLIP_DEFAULT_EXTENSIONS) !== -1
//       );
//     });

//     oldState = state;

//     for (const editor of newPCEditors) {
//       yield call(openDependencyEntry, editor.activeFilePath);
//     }
//   }
// }

// function* openDependencyEntry(activeFilePath: string) {
//   const { browser } = yield select();
//   let graph: DependencyGraph = browser.graph;
//   let entry: Dependency = graph && graph[activeFilePath];

//   if (!entry) {
//     const result = yield call(loadEntry, activeFilePath, {
//       graph: browser.graph,
//       openFile: uri => fs.readFileSync(uri.substr("file://".length), "utf8")
//     });
//     entry = result.entry;
//     graph = result.graph;
//   }

//   yield put(dependencyEntryLoaded(entry, graph));
// }

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
