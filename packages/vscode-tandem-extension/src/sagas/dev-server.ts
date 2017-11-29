import { ExtensionState } from "../state";
import * as path from "path";
import * as fs from "fs";
import * as io from "socket.io-client";
import * as getPort from "get-port";
import * as request from "request";
import { createSocketIOSaga } from "aerial-common2";
import { spawn, ChildProcess } from "child_process";
import { take, fork, select, put, call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { VISUAL_TOOLS_CONFIG_FILE_NAME, DEV_SERVER_BIN_PATH, TANDEM_APP_MODULE_NAME } from "../constants";
import { alert, AlertLevel, visualDevConfigLoaded, VISUAL_DEV_CONFIG_LOADED, childDevServerStarted, FileContentChanged, TEXT_CONTENT_CHANGED, CHILD_DEV_SERVER_STARTED, ChildDevServerStarted } from "../actions";

export function* devServerSaga() {
  // yield fork(startDevServer);
  // yield fork(handleDevConfigLoaded);
  // yield fork(handleTextEditorChanges);
  // yield fork(handleDevServerStarted);
}

function* startDevServer() {
  const { rootPath }: ExtensionState = yield select();
  const configFilePath = path.join(rootPath, VISUAL_TOOLS_CONFIG_FILE_NAME);

  if (!fs.existsSync(configFilePath)) {
    return yield put(alert(`${VISUAL_TOOLS_CONFIG_FILE_NAME} not found in project directory`, AlertLevel.ERROR))
  }

  yield put(visualDevConfigLoaded(require(configFilePath)));
}

function* handleDevConfigLoaded() {
  let devServerProcess: ChildProcess;

  while(true) {
    yield take(VISUAL_DEV_CONFIG_LOADED);

    if (devServerProcess) {
      devServerProcess.kill();
    }

    const { 
      visualDevConfig: { vscode },
      rootPath
    }: ExtensionState = yield select();

    const devServerScript = path.join(vscode.tandemcodeDirectory || path.dirname(require.resolve(TANDEM_APP_MODULE_NAME)), DEV_SERVER_BIN_PATH);

    if (!devServerScript) {
      yield put(alert(`vscode.devServerScript not found in ${VISUAL_TOOLS_CONFIG_FILE_NAME}`));
      continue;
    }

    const childServerPort = yield call(getPort);

    console.log(`spawning dev server "${devServerScript}" with env PORT ${childServerPort}`);

    devServerProcess = spawn(devServerScript, [], {
      cwd: rootPath,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        PORT: childServerPort
      }
    });

    devServerProcess.on("close", () => {
      console.warn("Dev server closed");
    })

    // wait for the server to start
    yield call(delay, 1000);

    yield put(childDevServerStarted(childServerPort));
  }
}

function* handleTextEditorChanges() {
  while(true) {
    const { filePath, content,  }: FileContentChanged = yield take(TEXT_CONTENT_CHANGED);
    const state: ExtensionState = yield select();
    yield call(request.post as any, `http://localhost:${state.visualDevConfig.port}/file`, {
      json: {
        filePath,
        content,
        timestamp: Date.now()
      }
    });
  }
}

function* handleDevServerStarted() {
  while(true) {
    const { port }: ChildDevServerStarted = yield take(CHILD_DEV_SERVER_STARTED);
    yield fork(createSocketIOSaga(io(`http://127.0.0.1:${port}`)));
  }
}