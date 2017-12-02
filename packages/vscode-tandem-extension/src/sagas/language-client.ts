import { fork, spawn, take, put, select } from "redux-saga/effects";
import { workspace, languages, ExtensionContext, IndentAction } from "vscode";
import { EXTENSION_ACTIVATED, EXPRESS_SERVER_STARTED, CHILD_DEV_SERVER_STARTED } from "../actions";
import { ExtensionState } from "../state";
import { merge } from "lodash";
import { LanguageClient, ServerOptions, LanguageClientOptions, TransportKind } from "vscode-languageclient";
const SERVER_MODULE_PATH = require.resolve("paperclip-language-server");

export function* languageClientSaga() {
  yield fork(handleServer);
}

function* handleServer() {
  yield take(EXPRESS_SERVER_STARTED);
  const { context, childDevServerInfo: { port } }: ExtensionState = yield select();

  const serverOptions: ServerOptions = {
    run: { module: SERVER_MODULE_PATH, transport: TransportKind.ipc },
    debug: { module: SERVER_MODULE_PATH, transport: TransportKind.ipc, options: { execArgv: ["--nolazy", "--inspect=6005"]}}
  };

  const documentSelector = ["paperclip"];
  const config = workspace.getConfiguration();
  
  const clientOptions: LanguageClientOptions = {
    documentSelector,
    synchronize: {
      configurationSection: ["html", "paperclip"]
    },
    initializationOptions: {
      devToolsPort: port
    }
  }

  const client = new LanguageClient("paperclip", "Paperclip Language Server", serverOptions, clientOptions);

  context.subscriptions.push(client.start());

}