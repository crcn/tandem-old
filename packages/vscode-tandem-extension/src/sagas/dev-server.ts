import { ExtensionState } from "../state";
import * as path from "path";
import * as fs from "fs";
import * as io from "socket.io-client";
import * as getPort from "get-port";
import { start as startPCDevServer } from "tandem-paperclip-dev-tools";
import { workspace, languages, ExtensionContext, IndentAction } from "vscode";
import * as request from "request";
import { take, fork, select, put, call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { VISUAL_TOOLS_CONFIG_FILE_NAME, DEV_SERVER_BIN_PATH, TANDEM_APP_MODULE_NAME } from "../constants";
import { alert, AlertLevel, childDevServerStarted, FileContentChanged, TEXT_CONTENT_CHANGED, CHILD_DEV_SERVER_STARTED, ChildDevServerStarted } from "../actions";

export function* devServerSaga() {
  yield fork(handleDevConfigLoaded);
  yield fork(handleTextEditorChanges);
}

function* handleDevConfigLoaded() {
  const { 
    rootPath,
    context
  }: ExtensionState = yield select();

  const config =  workspace.getConfiguration("paperclip");

  const childServerPort = yield call(getPort);

  console.log(`spawning Paperclip dev server with env PORT ${childServerPort}`);

  const proc = startPCDevServer({
    cwd: rootPath,
    projectConfig: config.devServer,
    port: childServerPort
  });

  yield put(childDevServerStarted(childServerPort));
}

function* handleTextEditorChanges() {
  while(true) {
    const { filePath, content }: FileContentChanged = yield take(TEXT_CONTENT_CHANGED);
    const state: ExtensionState = yield select();
    const req: request.Request = yield call(request.post as any, `http://localhost:${state.childDevServerInfo.port}/file`, {
      json: {
        filePath,
        content,
        timestamp: Date.now()
      }
    });

    req.on("error", (e) => {
      console.error(e);
    });
    
  }
}