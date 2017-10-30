import * as vscode from "vscode";
import * as fs from "fs";
import { editString, StringMutation } from "aerial-common2";
import { eventChannel, delay } from "redux-saga";
import { select, take, put, fork, call } from "redux-saga/effects";
import { Alert, ALERT, AlertLevel, MUTATE_SOURCE_CONTENT, FILE_CONTENT_CHANGED, MutateSourceContentRequest, fileContentChanged, FileContentChanged, startDevServerExecuted, START_DEV_SERVER_EXECUTED, CHILD_DEV_SERVER_STARTED } from "../actions";
import { ExtensionState, getFileCacheContent } from "../state";

export function* vscodeSaga() {
  yield fork(handleAlerts);
  yield fork(handleMutateSourceContent);
  yield fork(handleFileContentChanged);
  yield fork(handleCommands);
  yield fork(handleStarted);
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

function* handleMutateSourceContent() {

  // TODO -- this code is copy pasted from dev tools server. Need
  // to use from common config.
  while(true) {
    const { filePath, mutations }: MutateSourceContentRequest = yield take(MUTATE_SOURCE_CONTENT);

    const state: ExtensionState = yield select();

    const editSourceContent = state.visualDevConfig.editSourceContent;

    let content = getFileCacheContent(filePath, state) || fs.readFileSync(filePath, "utf8");
    
    let stringMutations: StringMutation[] = [];
    
    for (const mutation of mutations) {
      if (!editSourceContent) {
        console.warn(`Cannot apply "${mutation.$type}" since "editSourceContent" does not exist in config`);
        continue;
      }

      const result = editSourceContent(content, mutation, filePath);
      stringMutations.push(...(Array.isArray(result) ? result : [result]));
    }  

    content = editString(content, stringMutations);

    yield put(fileContentChanged(filePath, content));
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
  yield call(delay, 1000);

  
  const state: ExtensionState = yield select();
  const { getEntryHTML } = require(state.visualDevConfig.vscode.tandemcodeDirectory || "tandemcode");
  ;
  
  var textDocumentContentProvider = {
    provideTextDocumentContent(uri) {
      return getEntryHTML({
        apiHost: `http://localhost:${state.visualDevConfig.port}`,
        proxy: `http://localhost:${state.visualDevConfig.port}/proxy/`,
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