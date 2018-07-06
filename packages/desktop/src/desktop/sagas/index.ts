import { fork, call, take, select, put } from "redux-saga/effects";
import { electronSaga } from "./electron";
import { BrowserWindow, dialog } from "electron";
import {
  APP_READY,
  mainWindowOpened,
  tdProjectLoaded,
  TD_PROJECT_LOADED,
  previewServerStarted,
  OPEN_WORKSPACE_MENU_ITEM_CLICKED,
  TD_PROJECT_FILE_PICKED,
  TDProjectFilePicked,
  projectDirectoryLoaded,
  tdProjectFilePicked
} from "../actions";
import { FRONT_END_ENTRY_FILE_PATH, TD_PROJECT_EXTENSION } from "../constants";
import { ipcSaga, pid } from "./ipc";
import * as getPort from "get-port";
import * as qs from "querystring";
import { spawn } from "child_process";
import { walkPCRootDirectory, DEFAULT_CONFIG } from "paperclip";
import { DesktopState } from "../state";
import {
  isPublicAction,
  convertFlatFilesToNested,
  createDirectory,
  addProtocol,
  FILE_PROTOCOL
} from "tandem-common";
import { shortcutsSaga } from "./menu";
import * as fs from "fs";
import * as path from "path";

export function* rootSaga() {
  yield fork(openMainWindow);
  yield fork(electronSaga);
  yield fork(ipcSaga);
  yield fork(handleLoadProject);
  yield fork(shortcutsSaga);
  yield fork(previewServer);
  yield fork(handleOpenWorkspace);
  yield fork(initProjectDirectory);
  yield fork(handleOpenedWorkspaceDirectory);
}

function* initProjectDirectory() {
  const state: DesktopState = yield select();
  if (!state.tdProjectPath) {
    return;
  }
  yield call(loadTDConfig);
  // yield call(initPCConfig);
  yield call(loadProjectDirectory);
}

function* loadTDConfig() {
  const state: DesktopState = yield select();
  if (!fs.existsSync(state.tdProjectPath)) {
    console.warn(`Tandem config file not found`);
    return;
  }

  const project = JSON.parse(fs.readFileSync(state.tdProjectPath, "utf8"));

  // TODO - validate config here
  yield put(tdProjectLoaded(project));
}

function* openMainWindow() {
  yield take(APP_READY);
  const state: DesktopState = yield select();

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  let url = FRONT_END_ENTRY_FILE_PATH;

  const query: any = {};

  if (state.info.previewServer) {
    query.previewHost = `localhost:${state.info.previewServer.port}`;
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

function* handleLoadProject() {
  while (1) {
    yield take("APP_LOADED");
    yield call(loadProjectDirectory);
  }
}

function* loadProjectDirectory() {
  const { tdProject, tdProjectPath }: DesktopState = yield select();

  if (!tdProject || !tdProjectPath) {
    return;
  }

  const directory = path.join(
    path.dirname(tdProjectPath),
    tdProject.rootDir || "."
  );

  const files: [string, boolean][] = [];
  walkPCRootDirectory(tdProject, directory, (filePath, isDirectory) => {
    if (filePath === directory) {
      return;
    }
    files.push([filePath, isDirectory]);
  });

  const root = createDirectory(
    addProtocol(FILE_PROTOCOL, directory),
    files.length ? convertFlatFilesToNested(files) : []
  );

  yield put(projectDirectoryLoaded(root));
}

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
    }
  });
  proc.stderr.pipe(process.stderr);
  proc.stdout.pipe(process.stdout);

  yield put(previewServerStarted(port));
}

function* handleOpenWorkspace() {
  while (1) {
    yield take(OPEN_WORKSPACE_MENU_ITEM_CLICKED);
    const [directory] = dialog.showOpenDialog({
      properties: ["openDirectory"]
    }) || [undefined];
    if (!directory) {
      continue;
    }

    yield put(tdProjectFilePicked(directory));
  }
}

function* handleOpenedWorkspaceDirectory() {
  while (1) {
    yield call(initProjectDirectory);
  }
}
