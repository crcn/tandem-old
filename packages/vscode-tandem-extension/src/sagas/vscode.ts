import * as vscode from "vscode";
import * as fs from "fs";
import * as request from "request";
import { eventChannel, delay } from "redux-saga";
import { select, take, put, fork, call, spawn } from "redux-saga/effects";
import { Alert, ALERT, AlertLevel, FILE_CONTENT_CHANGED, FileContentChanged, startDevServerRequest, START_DEV_SERVER_REQUESTED, OPEN_TANDEM_EXECUTED, OPEN_EXTERNAL_WINDOW_EXECUTED, CHILD_DEV_SERVER_STARTED, textContentChanged, TEXT_CONTENT_CHANGED, openTandemExecuted, openExternalWindowExecuted, FileAction, OPEN_FILE_REQUESTED, OpenFileRequested, activeTextEditorChange, ACTIVE_TEXT_EDITOR_CHANGED, ActiveTextEditorChanged, openCurrentFileInTandemExecuted, OPEN_CURRENT_FILE_IN_TANDEM_EXECUTED, openTandemWindowsRequested, insertNewComponentExecuted, CREATE_INSERT_NEW_COMPONENT_EXECUTED, MODULE_CREATED, OPEN_TANDEM_IF_DISCONNECTED_REQUESTED, openTandemIfDisconnectedRequested, OPENING_TANDEM_APP, TANDEM_FE_CONNECTIVITY, openingTandemApp } from "../actions";
import { parseModuleSource, loadModuleAST, Module } from "paperclip";
import { NEW_COMPONENT_SNIPPET } from "../constants";
import { ExtensionState, getFileCacheContent, FileCache, getFileCacheMtime, TandemEditorReadyStatus } from "../state";
import { isPaperclipFile, waitForFEConnected, requestOpenTandemIfDisconnected } from "../utils";
import { TextEditor, DecorationOptions, workspace, languages, DecorationRangeBehavior, window, StatusBarAlignment } from "vscode";

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
  yield fork(handleInsertComponent);
  yield fork(handleOpenCurrentFileInTandem);
  yield fork(handleModuleCreated);
  yield fork(handleOpenTandemWindowIfDisconnected);
  yield fork(handleTandemFEStatus);
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
      yield take([TEXT_CONTENT_CHANGED]);
      prevState = yield select();
    }
  });

  while(true) {
    const { filePath, content, mtime }: FileContentChanged = yield take(FILE_CONTENT_CHANGED);

    const state: ExtensionState = yield select();
    if (getFileCacheMtime(filePath, prevState) && getFileCacheMtime(filePath, prevState).getTime() >= new Date(mtime).getTime() || getFileCacheContent(filePath, prevState) === content) {
      console.info(`No change in store -- skipping file open`);
      continue;
    }    

    prevState = state;

    console.log(`Opening file ${filePath}`);

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
    const action = yield take(chan);
    const state: ExtensionState = yield select();

    // Covers cases where change events are emitted when the content
    // hasn't changed. 
    if (getFileCacheContent(action.filePath, state) && getFileCacheContent(action.filePath, state).toString("utf8") === action.content.toString("utf8")) {
      continue;
    }

    yield put(action);
  }
}

function* handleCommands() {
  const chan = eventChannel((emit) => {

    // TODO - vscode styling is foobar, so this command is not available in package.json for now. Need to open a GH ticket for styling issues.
    vscode.commands.registerCommand("tandem.openTandem", () => {
      emit(openTandemExecuted());
    });

    vscode.commands.registerCommand("tandem.openExternalWindow", () => {
      emit(openExternalWindowExecuted());
    });

    vscode.commands.registerCommand("tandem.openCurrentFileInTandem", () => {
      emit(openCurrentFileInTandemExecuted());
    });

    vscode.commands.registerCommand("tandem.insertNewComponent", () => {
      emit(insertNewComponentExecuted());
    });

    vscode.commands.registerCommand("tandem.openTandemIfDisconnectedRequested", () => {
      emit(openTandemIfDisconnectedRequested());
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

function* handleModuleCreated() {
  while(1) {
    const { filePath }: FileContentChanged = yield take(MODULE_CREATED);
    console.log("Module created, opening doc", filePath);
    vscode.workspace.openTextDocument(filePath).then(doc => {
      vscode.window.showTextDocument(doc);
    });
  }
}

function* handleInsertComponent() {
  while(1) {
    yield take(CREATE_INSERT_NEW_COMPONENT_EXECUTED);
    if (!(yield call(checkCurrentFileIsPaperclip))) {
      continue;
    }

    if (!(yield call(insertSnippet, NEW_COMPONENT_SNIPPET))) {
      vscode.window.showErrorMessage(`Cannot insert component in this part of the document. Please more your caret somewhere else.`);
      continue;
    }
  }
}

function* insertSnippet(insertText) {
  const editor = vscode.window.activeTextEditor;
  const doc = editor.document;
  const carretOffset = insertText.indexOf("%|");
  insertText = insertText.replace("%|", "");
  const docText = doc.getText();
  const selection = editor.selection.active || doc.positionAt(docText.length);

  const offset = doc.offsetAt(selection);

  // smoke test first to make sure that the 
  const { diagnostics } = parseModuleSource(docText.substr(0, offset) + insertText + docText.substr(offset));

  // We COULD just insert the snippet to the end of the document, but
  // but it's probably better to fail here and notify the user so that they can correct _their_ mistake.
  if (diagnostics.length) {
    return false;
  }

  yield call(async () => {
    return editor.edit((edit) => {
      edit.insert(
        selection,
        insertText
      );
    });
  });

  if (carretOffset > -1) {
    const newPos = doc.positionAt(offset + carretOffset);
    editor.selection = new vscode.Selection(newPos, newPos);
  }

  return true;
}

function* checkCurrentFileIsPaperclip() {
  const activeTextEditor = vscode.window.activeTextEditor;

  if (!activeTextEditor) {
    vscode.window.showErrorMessage("Please open a Paperclip file to edit it visually in Tandem.");
    return false;
  }
  const filePath = activeTextEditor.document.uri.fsPath;
  if (!isPaperclipFile(filePath)) {
    vscode.window.showErrorMessage("Only Paperclip (*.pc) files can be opened in Tandem.");
    return false;
  }

  return true;
}


function* handleTextDocumentClose() {
  const chan = eventChannel((emit) => {
    vscode.workspace.onDidCloseTextDocument(() => {
      if (!vscode.window.activeTextEditor) return;
      const doc = vscode.window.activeTextEditor.document;
      emit(textContentChanged(doc.uri.fsPath.replace(".git", ""), fs.readFileSync(doc.uri.fsPath.replace(".git", ""))))
    });
    return () => {};
  });

  while(1) {
    const action = yield take(chan);
    yield put(action);
  }
}

function* handleOpenExternalWindow() {
  while(1) {
    yield take(OPEN_EXTERNAL_WINDOW_EXECUTED);
    yield openTandemApp();
  }
}

function* openTandemApp() {
  const state: ExtensionState = yield select();
  yield put(openingTandemApp());
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(getIndexUrl(state)));
  yield call(waitForFEConnected);
}

function* handleOpenTandemWindowIfDisconnected() {
  while(1) {
    yield take(OPEN_TANDEM_IF_DISCONNECTED_REQUESTED);
    const state: ExtensionState = yield select();
    if (state.tandemEditorStatus === TandemEditorReadyStatus.DISCONNECTED) {
      yield openTandemApp();
    }
  }
}

function* handleOpenCurrentFileInTandem() {
  while(true) {
    yield take(OPEN_CURRENT_FILE_IN_TANDEM_EXECUTED);
    const state: ExtensionState = yield select();
    if (!(yield call(checkCurrentFileIsPaperclip))) {
      continue;
    }
    const activeTextEditor = vscode.window.activeTextEditor;
    const filePath = activeTextEditor.document.uri.fsPath;
    const { diagnostics, root } = parseModuleSource(activeTextEditor.document.getText(), filePath);

    // just show one error for now
    if (diagnostics.length) {
      vscode.window.showErrorMessage(`Paperclip syntax error: ${diagnostics[0].message}`);
      continue;
    }

    const module = loadModuleAST(root, filePath);
    
    if (!module.components.length) {
      const pick = yield call(async () => {
        return await vscode.window.showInformationMessage("Could not find a component to open with in Tandem. Would you like to create one?", "Yes", "No");
      });

      if (pick === "Yes") {
        yield put(insertNewComponentExecuted());
      }

      continue;
    }

    const componentIds = yield call(pickComponentIds, module);

    if (!componentIds.length) {
      continue;
    }

    const uris = componentIds.map((id) => `/components/${id}/preview`);

    yield call(requestOpenTandemIfDisconnected);

    yield put(openTandemWindowsRequested(uris));    
  }
}
const ALL_COMPONENTS_LABEL = "All components in this file";
function* pickComponentIds(module: Module) {
  const componentIds = module.components.map(component => component.id);
  if (componentIds.length === 1) {
    return componentIds;
  }
  const pick = yield call(async () => {
    return await vscode.window.showQuickPick([ALL_COMPONENTS_LABEL, ...componentIds]);
  });

  if (!pick) return [];

  if (pick === ALL_COMPONENTS_LABEL) {
    return componentIds;
  }

  return [pick];
}

function* handleOpenFileRequested() {
  while(true) {
    const { source }: OpenFileRequested = yield take(OPEN_FILE_REQUESTED);

    const { uri, start, end }  = typeof source === "object" ? source : { uri: source, start: null, end: null };
    
    vscode.workspace.openTextDocument(uri.replace("file://", "")).then(doc => {
      vscode.window.showTextDocument(doc).then(() => {
        const activeTextEditor = vscode.window.activeTextEditor;
        
        if (start && end) {
          activeTextEditor.document.positionAt(start.pos);
          const range = new vscode.Range(activeTextEditor.document.positionAt(start.pos), activeTextEditor.document.positionAt(end.pos));
          activeTextEditor.selection = new vscode.Selection(range.start, range.end);
          activeTextEditor.revealRange(range);
        }
      });
    });
  }
}

function* handleTandemFEStatus() {
  const state: ExtensionState = yield select();
  const status = window.createStatusBarItem(StatusBarAlignment.Left);
  status.command = "tandem.openTandemIfDisconnectedRequested";
  state.context.subscriptions.push(status);
  status.text = "Tandem";
  status.show();

  yield fork(function*() {
    while(1) {
      yield take([OPENING_TANDEM_APP, TANDEM_FE_CONNECTIVITY]);
      const state: ExtensionState = yield select();
      if (state.tandemEditorStatus === TandemEditorReadyStatus.CONNECTED) {
        status.text = "$(check) Tandem";
        status.tooltip = "Connected to Tandem";
      } else if (state.tandemEditorStatus === TandemEditorReadyStatus.CONNECTING) {
        status.text = "$(zap) Tandem";
        status.tooltip = "Connecting to Tandem";
      } else if (state.tandemEditorStatus === TandemEditorReadyStatus.DISCONNECTED) {
        status.text = "$(alert) Tandem";
        status.tooltip = "Disconnected from Tandem";
      }
      status.show();
    }
  });
}