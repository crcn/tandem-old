import { fork, call, take, select, put } from "redux-saga/effects";
import { electronSaga } from "./electron";
import { BrowserWindow, dialog } from "electron";
import {
  APP_READY,
  mainWindowOpened,
  tdProjectLoaded,
  TD_PROJECT_LOADED,
  previewServerStarted,
  OPEN_PROJECT_MENU_ITEM_CLICKED,
  projectDirectoryLoaded,
  tdProjectFilePicked,
  TD_PROJECT_FILE_PICKED,
  componentControllerPicked
} from "../actions";
import { FRONT_END_ENTRY_FILE_PATH } from "../constants";
import { ipcSaga, pid } from "./ipc";
import * as getPort from "get-port";
import * as qs from "querystring";
import { spawn } from "child_process";
import { walkPCRootDirectory } from "paperclip";
import { DesktopState, TDProject } from "../state";
import {
  isPublicAction,
  convertFlatFilesToNested,
  createDirectory,
  addProtocol,
  FILE_PROTOCOL,
  stripProtocol
} from "tandem-common";
import { shortcutsSaga } from "./menu";
import * as fs from "fs";
import * as path from "path";

const DEFAULT_TD_PROJECT: TDProject = {
  scripts: {},
  rootDir: ".",
  exclude: ["node_modules"]
};

const DEFAULT_TD_PROJECT_NAME = "app.tdproject";

export function* rootSaga() {
  yield fork(openMainWindow);
  yield fork(electronSaga);
  yield fork(ipcSaga);
  yield fork(handleLoadProject);
  yield fork(shortcutsSaga);
  yield fork(previewServer);
  yield fork(handleOpenProject);
  yield fork(handleCreateProject);
  yield fork(initProjectDirectory);
  yield fork(handleOpenedWorkspaceDirectory);
  yield fork(handleAddControllerClick);
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

  const query: any = {
    react_perf: false
  };

  if (state.info.previewServer) {
    query.previewHost = `localhost:${state.info.previewServer.port}`;
  }

  if (state.tdProject.globalFilePath) {
    query.globalFileUri = "file://" + path.join(path.dirname(state.tdProjectPath), state.tdProject.globalFilePath);
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
    yield put(projectDirectoryLoaded(null));
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
    yield take(["CREATE_PROJECT_BUTTON_CLICKED"]);
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
    }
    yield put(tdProjectFilePicked(filePath));
  }
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
