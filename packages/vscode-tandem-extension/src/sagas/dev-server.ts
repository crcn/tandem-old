import { ExtensionState } from "../state";
import * as path from "path";
import * as fs from "fs";
import * as io from "socket.io-client";
import * as getPort from "get-port";
import { start as startPCDevServer } from "tandem-paperclip-dev-tools";
import { workspace, languages, ExtensionContext, IndentAction } from "vscode";
import * as request from "request";
import { take, fork, select, put, call, spawn } from "redux-saga/effects";
import { delay, eventChannel } from "redux-saga";
import { VISUAL_TOOLS_CONFIG_FILE_NAME, DEV_SERVER_BIN_PATH, TANDEM_APP_MODULE_NAME } from "../constants";
import { alert, AlertLevel, childDevServerStarted, FileContentChanged, TEXT_CONTENT_CHANGED, CHILD_DEV_SERVER_STARTED, ChildDevServerStarted, EXPRESS_SERVER_STARTED, ExpressServerStarted } from "../actions";
import { isPaperclipFile } from "../utils";

export function* devServerSaga() {
  yield fork(handleDevConfigLoaded);
  yield fork(handleTextEditorChanges);
}

const TAG = "$$" + Date.now();

const SAVE_DELAY = 250;

function* handleDevConfigLoaded() {
  const { 
    rootPath,
    context
  }: ExtensionState = yield select();

  const config =  workspace.getConfiguration("tandem.paperclip");

  const childServerPort = yield call(getPort);

  console.log(`spawning Paperclip dev server with env PORT ${childServerPort}`);

  let proc;

  const chan = eventChannel(emit => {
    proc = startPCDevServer({
      cwd: rootPath,
      pipeStdio: true,
      projectConfig: config.devServer,
      port: childServerPort
    }, emit);
    return () => {
      proc.dispose();
    };
  });

  yield spawn(function*() {
    while(1) {
      const action = yield take(chan);
      action[TAG] = 1;
      yield spawn(function*() {
        yield put(action);
      });
    }
  });

  yield spawn(function*() {
    while(1) {
      const action = yield take();
      if (action[TAG] || !action.$public) continue;
      proc.send(action);
    }
  });

  yield put(childDevServerStarted(childServerPort));
}

function* handleTextEditorChanges() {

  let nextActions: {
    [identifier: string]: FileContentChanged
  } = {};

  let posting: boolean = false;
  
  while(true) {
    const currentAction: FileContentChanged = yield take(TEXT_CONTENT_CHANGED);

    const config =  workspace.getConfiguration();
    

    if (!config.tandem.liveEditing.enable) {
      continue;
    }

    // ignore any file that is not a paperclip file. This may 
    // need to eventually change to something like `isPaperclipAcceptedFile` for files such as CSS that may be imported
    if (!isPaperclipFile(currentAction.filePath)) {
      continue;
    }

    nextActions[currentAction.filePath] = currentAction;

    if (posting) {
      continue;
    }

    posting = true;
    yield spawn(function*() {
      const state: ExtensionState = yield select();

      // may happen on rare occasions, but it's possible that
      // text changes may
      if (!state.childDevServerInfo) {
        yield take(CHILD_DEV_SERVER_STARTED);
      }
      while(Object.keys(nextActions).length) {
        
        // some breathing room in case the user is typing
        // really fast. Don't want to clobber the dev tools server
        yield call(delay, SAVE_DELAY);

        const batchActions = nextActions;
        nextActions = {};
        for (const filePath in batchActions) {
          console.log("Saving " + filePath);
          const { content, mtime } = batchActions[filePath];
          const state: ExtensionState = yield select();
          yield call(() => {
            return new Promise((resolve, reject) => {
              request.post(`http://localhost:${state.childDevServerInfo.port}/file`, {
                json: {
                  filePath,
                  content: content,
                  mtime
                }
              }, (err, response, body) => {
                if (err) {
                  console.error(err);
                }
                resolve();
              });
            });
          });
        }
      }

      posting = false;
    });
    
  }
}
