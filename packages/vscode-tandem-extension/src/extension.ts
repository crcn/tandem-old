import vscode = require("vscode");
import { mainSaga } from "./sagas";
import { mainReducer } from "./reducers";
import createSagaMiddleware from "redux-saga";
import { TandemEditorReadyStatus } from "./state";
import {extensionActivated } from "./actions";
import { createStore, applyMiddleware } from "redux";

export async function activate(context: vscode.ExtensionContext) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    mainReducer,
    {
      context: context,
      tandemEditorStatus: TandemEditorReadyStatus.DISCONNECTED,
      rootPath: vscode.workspace.rootPath,
      fileCache: {}
    },
    applyMiddleware(sagaMiddleware)
  );
  
  sagaMiddleware.run(mainSaga);
  store.dispatch(extensionActivated());
}
