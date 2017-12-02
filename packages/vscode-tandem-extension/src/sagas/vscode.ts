import * as vscode from "vscode";
import * as fs from "fs";
import * as request from "request";
import { eventChannel, delay } from "redux-saga";
import { select, take, put, fork, call, spawn } from "redux-saga/effects";
import { Alert, ALERT, AlertLevel, FILE_CONTENT_CHANGED, FileContentChanged, startDevServerRequest, START_DEV_SERVER_REQUESTED, OPEN_TANDEM_EXECUTED, OPEN_EXTERNAL_WINDOW_EXECUTED, CHILD_DEV_SERVER_STARTED, textContentChanged, TEXT_CONTENT_CHANGED, openTandemExecuted, openExternalWindowExecuted, FileAction, OPEN_FILE_REQUESTED, OpenFileRequested, fileChanged, activeTextEditorChange, ACTIVE_TEXT_EDITOR_CHANGED, ActiveTextEditorChanged } from "../actions";
import { ExtensionState, getFileCacheContent, FileCache, getFileCacheMtime } from "../state";
import { isPaperclipFile } from "../utils";
import { TextEditor, DecorationOptions, workspace, languages, DecorationRangeBehavior } from "vscode";

export function* vscodeSaga() {
  yield fork(handleAlerts);
  yield fork(handleFileContentChanged);
  yield fork(handleCommands);
  
  yield fork(handleTextDocumentChange);
  yield fork(handleActiveTextEditorChange);
  yield fork(handleOpenTandem);
  yield fork(handleOpenExternalWindow);
  yield fork(handleOpenFileRequested);
  yield fork(handleTextDocumentClose);
  // yield fork(handleDecorators);
  // yield fork(handleHoverProviders);
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
  let mtimes = {};
  let prevState: ExtensionState = yield select();

  yield fork(function*() {
    while(true) {
      yield take(TEXT_CONTENT_CHANGED);
      prevState = yield select();
    }
  });

  while(true) {
    const { filePath, content, mtime }: FileContentChanged = yield take(FILE_CONTENT_CHANGED);

    if (!content) {
      continue;
    }

    const state: ExtensionState = yield select();
    if (getFileCacheContent(filePath, prevState) && getFileCacheContent(filePath, prevState).toString("utf8") === content.toString("utf8")) {
      console.info(`No change in store -- skipping file open`);
      continue;
    }

    prevState = state;

    console.log(`Opening file ${filePath}`, content);

    if (!fs.existsSync(filePath)) {
      console.warn(`Cannot open file ${filePath} because it does not exist.`);
      continue;
    }

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
          content.toString("utf8")
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

function* handleTextDocumentChange() {
  const chan = eventChannel((emit) => {
    vscode.workspace.onDidChangeTextDocument((e) => {
      const document = e.document as vscode.TextDocument;
      emit(textContentChanged(document.uri.fsPath, new Buffer(document.getText())));
    })
    return () => {};
  });

  while(true) {
    yield put(yield take(chan));
  }
}

function* handleCommands() {
  const chan = eventChannel((emit) => {

    // TODO - vscode styling is foobar, so this command is not available in package.json for now. Need to open a GH ticket for styling issues.
    vscode.commands.registerCommand("extension.openTandem", () => {
      emit(openTandemExecuted());
    });
    vscode.commands.registerCommand("extension.openExternalWindow", () => {
      emit(openExternalWindowExecuted());
    });

    return () => {};
  });

  while(true) {
    yield put(yield take(chan));
  }
}

const PREVIEW_NAME = `tandem-preview`;
const PREVIEW_URI = vscode.Uri.parse(`${PREVIEW_NAME}://authority/${PREVIEW_NAME}`);

const getIndexUrl = (state: ExtensionState) => `http://localhost:${state.port}/index.html`;

function* handleOpenTandem() {
  yield take(OPEN_TANDEM_EXECUTED);

  let state: ExtensionState = yield select();
  var textDocumentContentProvider = {
    provideTextDocumentContent(uri) {
      return `
        <html>
          <head>
            <title>Tandem</title>
          </head>
          <body>
            <iframe src="${getIndexUrl(state)}" style="position:absolute;left:0;top:0;width:100vw; height: 100%; border: none;"></iframe>
          </body>
        </html>
      `;
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
    yield take(OPEN_TANDEM_EXECUTED);
  }
}

function* handleActiveTextEditorChange() {
  const chan = eventChannel((emit) => {
    vscode.window.onDidChangeActiveTextEditor(editor => {
      emit(activeTextEditorChange(editor));
    });
    return () => {};
  });
  while(1) {
    yield put(yield take(chan));
  }
}


function* handleTextDocumentClose() {
  const chan = eventChannel((emit) => {
    let _timeout;
    vscode.workspace.onDidCloseTextDocument(() => {
      clearTimeout(_timeout);
      _timeout = setTimeout(() => {
        if (!vscode.window.activeTextEditor) return;
        const doc = vscode.window.activeTextEditor.document;
        emit(textContentChanged(doc.uri.fsPath.replace(".git", ""), fs.readFileSync(doc.uri.fsPath.replace(".git", ""))))
      });
    });
    return () => {};
  });

  while(true) {
    yield put(yield take(chan));
  }
}

function* handleOpenExternalWindow() {
  while(true) {
    yield take(OPEN_EXTERNAL_WINDOW_EXECUTED);
    const state: ExtensionState = yield select();
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(getIndexUrl(state)));
  }
}

function* handleOpenFileRequested() {
  while(true) {
    const { source: { uri, location } }: OpenFileRequested = yield take(OPEN_FILE_REQUESTED);
    vscode.workspace.openTextDocument(uri.replace("file://", "")).then(doc => {
      vscode.window.showTextDocument(doc).then(() => {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (location) {
          const { start } = location;
          const range = activeTextEditor.document.lineAt(start.line - 1).range;
          activeTextEditor.selection = new vscode.Selection(range.start, range.end);
          activeTextEditor.revealRange(range);
        }
      });
    });
  }
}

function* handleHoverProviders() {
}

function* handleDecorators() {
  let editor: TextEditor;

  const state: ExtensionState = yield select();
  const componentDecoratorType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: state.context.asAbsolutePath("assets/paintbucket.svg"),
    gutterIconSize: "12px 12px"
  });
  
  while(1) {
    yield take([ACTIVE_TEXT_EDITOR_CHANGED, TEXT_CONTENT_CHANGED]);
    const state: ExtensionState = yield select();
    if (!state.activeTextEditor) {
      continue;
    }

    const editor = state.activeTextEditor;
    const document = editor.document;
    if (!isPaperclipFile(document.fileName)) {
      continue;
    }

    const text = document.getText();
    const componentRegex = /<component.*?>/g;
    let match: RegExpExecArray;


    const componentDecorations: DecorationOptions[] = [];
    while (match = componentRegex.exec(text)) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      componentDecorations.push({
        range: new vscode.Range(startPos.line, 0, endPos.line, 0),
        hoverMessage: "ABCDE"
      });
    }


    editor.setDecorations(componentDecoratorType, componentDecorations);
  }
}