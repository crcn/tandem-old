import { fork, call, take, select, put, cancel, spawn as sspawn, ForkEffect, cancelled, CallEffectFactory } from "redux-saga/effects";
import { eventChannel, Channel } from "redux-saga";

import { electronSaga } from "./electron";
import { BrowserWindow, dialog } from "electron";
import {
  APP_READY,
  mainWindowOpened,
  tdProjectLoaded,
  TD_PROJECT_LOADED,
  previewServerStarted,
  OPEN_PROJECT_MENU_ITEM_CLICKED,
  // projectDirectoryLoaded,
  tdProjectFilePicked,
  TD_PROJECT_FILE_PICKED,
  componentControllerPicked,
  NEW_PROJECT_MENU_ITEM_CLICKED
} from "../actions";
import { debounce } from "lodash";
import * as chokidar from "chokidar";
import { FRONT_END_ENTRY_FILE_PATH } from "../constants";
import { ipcSaga, pid } from "./ipc";
import * as getPort from "get-port";
import * as qs from "querystring";
import { spawn } from "child_process";
import { walkPCRootDirectory, createPCModule, createPCComponent, PCVisibleNodeMetadataKey, createPCTextNode } from "paperclip";
import { DesktopState, TDProject } from "../state";
import {
  isPublicAction,
  convertFlatFilesToNested,
  createDirectory,
  addProtocol,
  FILE_PROTOCOL,
  EMPTY_ARRAY,
  createBounds
} from "tandem-common";
import { shortcutsSaga } from "./menu";
import * as fs from "fs";
import * as fsa from "fs-extra";
import * as path from "path";
import { ConfirmCloseWindow } from "tandem-front-end";

const DEFAULT_TD_PROJECT: TDProject = {
  scripts: {},
  rootDir: ".",
  exclude: ["node_modules"],
  mainFilePath: "./src/main.pc"
};

const DEFAULT_TD_PROJECT_FILES = {
  "./src/main.pc": () => {
    return JSON.stringify(createPCModule([
      createPCComponent("Application", null, null, null, [
        createPCTextNode("App content")
      ], {
        [PCVisibleNodeMetadataKey.BOUNDS]: createBounds(0, 600, 0, 400)
      })
    ]), null, 2)
  }
};

const DEFAULT_TD_PROJECT_NAME = "app.tdproject";

export function* rootSaga() {
  // yield fork(watchProjectDirectory); 
  yield fork(openMainWindow);
  yield fork(electronSaga);
  yield fork(ipcSaga);  
  // yield fork(handleLoadProject);
  yield fork(shortcutsSaga);
  yield fork(previewServer);
  yield fork(handleOpenProject);
  yield fork(handleCreateProject);
  yield fork(initProjectDirectory);
  yield fork(handleOpenedWorkspaceDirectory);
  yield fork(handleAddControllerClick);
  yield fork(handleChrome);
}

function* initProjectDirectory() {
  const state: DesktopState = yield select();
  if (!state.tdProjectPath) {
    return;
  }
  yield call(loadTDConfig);
  // yield call(initPCConfig);
  // yield call(loadProjectDirectory);
}

function* loadTDConfig() {
  const state: DesktopState = yield select();
  if (!fs.existsSync(state.tdProjectPath)) {
    console.warn(`Tandem config file not found`);
    return;
  }

  const project = JSON.parse(fs.readFileSync(state.tdProjectPath, "utf8"));

  // TODO - validate config here
  yield put(tdProjectLoaded(project, state.tdProjectPath));
}

function* openMainWindow() {
  yield take(APP_READY);
  const state: DesktopState = yield select();
  const withFrame = false;

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: withFrame
  });

  mainWindow.webContents.on

  let url = FRONT_END_ENTRY_FILE_PATH;

  const query: any = {
    // react_perf: true
  };

  if (state.info.previewServer) {
    query.previewHost = `localhost:${state.info.previewServer.port}`;
  }

  if (!withFrame) {
    query.customChrome = true;
  }

  mainWindow.loadURL(
    url + (Object.keys(query).length ? "?" + qs.stringify(query) : "")
  );

  yield fork(function*() {
    while (1) {
      const message = yield take();
      if (isPublicAction(message) && !message["@@" + pid]) {
        mainWindow.webContents.send("message", message);
      }
    }
  });

  yield put(mainWindowOpened());
}

// function* handleLoadProject() {
//   while (1) {
//     yield take("APP_LOADED");
//     yield call(loadProjectDirectory);
//   }
// }

// function* loadProjectDirectory() {
//   const { tdProject, tdProjectPath }: DesktopState = yield select();

//   if (!tdProject || !tdProjectPath) {
//     yield put(projectDirectoryLoaded(null));
//     return;
//   }

//   const directory = path.join(
//     path.dirname(tdProjectPath),
//     tdProject.rootDir || "."
//   );

//   const files: [string, boolean][] = [];
//   walkPCRootDirectory(tdProject, directory, (filePath, isDirectory) => {
//     if (filePath === directory) {
//       return;
//     }
//     files.push([filePath, isDirectory]);
//   });

//   const root = createDirectory(
//     addProtocol(FILE_PROTOCOL, directory),
//     files.length ? convertFlatFilesToNested(files) : []
//   );

//   yield put(projectDirectoryLoaded(root));
// }

function* previewServer() {
  yield take(TD_PROJECT_LOADED);
  const state: DesktopState = yield select();

  if (
    !state.tdProject ||
    !state.tdProject.scripts ||
    !state.tdProject.scripts.previewServer
  ) {
    return;
  }
  const port = yield call(getPort);
  let [bin, ...args] = state.tdProject.scripts.previewServer.split(" ");
  const proc = spawn(bin, args, {
    cwd: path.dirname(state.tdProjectPath),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: true,
      PORT: port
    } as any
  });
  proc.stderr.pipe(process.stderr);
  proc.stdout.pipe(process.stdout);

  yield put(previewServerStarted(port));
}

function* handleOpenProject() {
  while (1) {
    yield take([OPEN_PROJECT_MENU_ITEM_CLICKED, "OPEN_PROJECT_BUTTON_CLICKED"]);
    const [filePath] = dialog.showOpenDialog({
      filters: [
        {
          name: "Tandem Project File",
          extensions: ["tdproject"]
        }
      ],
      properties: ["openFile"]
    }) || [undefined];
    if (!filePath) {
      continue;
    }

    yield put(tdProjectFilePicked(filePath));
  }
}

function* handleCreateProject() {
  while (1) {
    yield take(["CREATE_PROJECT_BUTTON_CLICKED", NEW_PROJECT_MENU_ITEM_CLICKED]);
    const [directory] = dialog.showOpenDialog({
      title: "Choose project directory",
      properties: ["openDirectory"]
    }) || [undefined];
    if (!directory) {
      continue;
    }

    const filePath = path.join(directory, DEFAULT_TD_PROJECT_NAME);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        JSON.stringify(DEFAULT_TD_PROJECT, null, 2),
        "utf8"
      );

      for (const relativePath in DEFAULT_TD_PROJECT_FILES) {
        const fullPath = path.join(directory, relativePath);
        try {
          fsa.mkdirpSync(path.dirname(fullPath));
        } catch(e) {

        }
        fs.writeFileSync(fullPath, DEFAULT_TD_PROJECT_FILES[relativePath](), "utf8");
      }
    }
    yield put(tdProjectFilePicked(filePath));
  }
}

function* handleChrome() {
 
  yield fork(function* handleCloseClick() {
    while(1) {
      const {unsaved, origin} = yield take("CHROME_CLOSE_BUTTON_CLICKED");
      const sender: BrowserWindow = origin.sender;
      if (!unsaved) {
        yield put({ type: "CONFIRM_CLOSE_WINDOW", "@@public": true, closeWithoutSaving: true, cancel: false, save: false } as ConfirmCloseWindow);
        continue;
      }

      const option = dialog.showMessageBox({
        message: "Do you want to save changes?",
        buttons: ["Save", "Cancel", "Don't save"]
      });
      yield put({ type: "CONFIRM_CLOSE_WINDOW", "@@public": true, closeWithoutSaving: option === 2, cancel: option === 1, save: option === 0 } as ConfirmCloseWindow);
    }
  });
}

function* handleOpenedWorkspaceDirectory() {
  while (1) {
    yield take(TD_PROJECT_FILE_PICKED);
    yield call(initProjectDirectory);
  }
}

function* handleAddControllerClick() {
  while (1) {
    const { defaultPath } = yield take(
      "ADD_COMPONENT_CONTROLLER_BUTTON_CLICKED"
    );
    const [controllerFilePath] = dialog.showOpenDialog({
      defaultPath,
      properties: ["openFile"]
    }) || [undefined];
    if (!controllerFilePath) {
      continue;
    }

    yield put(componentControllerPicked(controllerFilePath));
  }
}

// function* watchProjectDirectory() {
//   let chan: Channel<any>;
//   let fork: any;
  
  
//   while(1) {
//     yield take("PROJECT_DIRECTORY_LOADED");
//     const { tdProjectPath, tdProject }: DesktopState = yield select();
//     const tdProjectDir = path.dirname(tdProjectPath);
//     console.log(`watching ${tdProjectDir}`);
//     if (chan) {
//       chan.close();
//       yield cancel(fork);
//     }
//     chan = eventChannel((emit) => {
//       const watcher = chokidar.watch(tdProjectDir, { ignored: tdProject.exclude ? new RegExp(tdProject.exclude.join("|")) : [] });
//       const startTime = Date.now();
//       watcher.on("ready", () => {
//         watcher.on("all", debounce(() => {
//           emit({});
//         }, 100)); 
//       });
//       return () => {
//         watcher.close();
//       };
//     });
      
//     fork = yield sspawn(function*(){
//       while(!(yield cancelled())) {
//         yield take(chan);
//         console.log(`${tdProjectPath} has changed`);
//         yield call(loadProjectDirectory);
//       }
//     });
//   }
// }