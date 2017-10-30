import * as vscode from "vscode";
import * as fs from "fs";
import * as request from "request";
import { editString, StringMutation } from "aerial-common2";
import { eventChannel, delay } from "redux-saga";
import { select, take, put, fork, call } from "redux-saga/effects";
import { Alert, ALERT, AlertLevel, FILE_CONTENT_CHANGED, fileContentChanged, FileContentChanged, startDevServerExecuted, START_DEV_SERVER_EXECUTED, CHILD_DEV_SERVER_STARTED, textContentChanged, TEXT_CONTENT_CHANGED } from "../actions";
import { ExtensionState, getFileCacheContent } from "../state";

export function* vscodeSaga() {
  yield fork(handleAlerts);
  yield fork(handleFileContentChanged);
  yield fork(handleCommands);
  yield fork(handleTextEditorChange);
  yield fork(handleStarted);
  yield fork(handleTextEditorChanges);
}

function* handleAlerts() {
  while(true) {
    const { level, text }: Alert = yield take(ALERT);
    switch(level) {
      case AlertLevel.ERROR: {
        vscode.window.showErrorMessage(text);
        break;
      }
      case AlertLevel.NOTICE: {
        vscode.window.showInformationMessage(text);
        break;
      }
      case AlertLevel.WARNING: {
        vscode.window.showWarningMessage(text);
        break;
      }
    }
  }
}

function* handleFileContentChanged() {
  while(true) {
    const { filePath, content }: FileContentChanged = yield take(FILE_CONTENT_CHANGED);

    const activeTextEditor = vscode.window.activeTextEditor;

    const textEditor = vscode.window.visibleTextEditors.find((textEditor) => {
      return textEditor.document.uri.path === filePath;
    });

    const onOpenTextEditor = async (editor: vscode.TextEditor) => {
      const doc = editor.document;
      await editor.edit((edit) => {
        edit.replace(
          new vscode.Range(
            doc.positionAt(0),
            doc.positionAt(doc.getText().length)
          ),
          content
        )
      });
    }

    if (textEditor) {
      onOpenTextEditor(textEditor);
    } else {
      vscode.workspace.openTextDocument(filePath).then(async (doc) => {
        await vscode.window.showTextDocument(doc);
        onOpenTextEditor(vscode.window.activeTextEditor);
      });
    }
  }
}

function* handleTextEditorChange() {
  const chan = eventChannel((emit) => {
    vscode.workspace.onDidChangeTextDocument((e) => {
      setTimeout(() => {
        if (e.document.isDirty) {
          const document = e.document as vscode.TextDocument;
          emit(textContentChanged(document.uri.fsPath, document.getText()));
        }
      });
    })
    return () => {};
  });
  
  let _ignoreChange: boolean;

  yield fork(function*() {
    while(true) {
      const action = yield take(chan);
      if (_ignoreChange) continue;
      yield put(action);
    }
  });

  yield fork(function*() {
    while(true) {

      // if incomming changes, then ignore text editor change for a sdecond
      yield take(FILE_CONTENT_CHANGED);
      _ignoreChange = true;
      yield call(delay, 100);
      _ignoreChange = false;
    }
  }); 


}

function* handleCommands() {
  const chan = eventChannel((emit) => {
    vscode.commands.registerCommand("extension.startVisualDevServer", () => {
      emit(startDevServerExecuted());
    });
    return () => {};
  });

  while(true) {
    yield put(yield take(chan));
  }
}

const PREVIEW_NAME = `tandem-preview`;
const PREVIEW_URI = vscode.Uri.parse(`${PREVIEW_NAME}://authority/${PREVIEW_NAME}`);

function* handleStarted() {

  // waiy for the first
  yield take(CHILD_DEV_SERVER_STARTED);

  // wait until dev server starts (TODO - this is just a bandaid and needs a real fix)
  yield call(delay, 1000);

  const state: ExtensionState = yield select();
  const { getEntryHTML } = require(state.visualDevConfig.vscode.tandemcodeDirectory || "tandemcode");
  
  var textDocumentContentProvider = {
    provideTextDocumentContent(uri) {
      return getEntryHTML({
        apiHost: `http://localhost:${state.visualDevConfig.port}`,
        proxy: `http://localhost:${state.visualDevConfig.port}/proxy/`,
        localStorageNamespace: state.rootPath
      });
    },
  };

  state.context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      PREVIEW_NAME,
      textDocumentContentProvider)
  );
  while(true) {
    yield call(vscode.commands.executeCommand,
      "vscode.previewHtml",
      PREVIEW_URI,
      vscode.ViewColumn.Two,
      "Tandem"
    );

    yield take(CHILD_DEV_SERVER_STARTED);
  }
}

function* handleTextEditorChanges() {
  while(true) {
    const { filePath, content }: FileContentChanged = yield take(TEXT_CONTENT_CHANGED);
    const state: ExtensionState = yield select();

    yield call(request.post as any, `http://localhost:${state.childDevServerInfo.port}/file`, {
      json: {
        filePath,
        content
      }
    });
  }
}