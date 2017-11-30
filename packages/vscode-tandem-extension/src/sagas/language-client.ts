import { fork, spawn, take, put, select } from "redux-saga/effects";
import { workspace, languages, ExtensionContext, IndentAction } from "vscode";
import { EXTENSION_ACTIVATED } from "../actions";
import { ExtensionState } from "../state";
import { LanguageClient, ServerOptions, LanguageClientOptions, TransportKind } from "vscode-languageclient";
const SERVER_MODULE_PATH = require.resolve("paperclip-language-server");

export function* languageClientSaga() {
  yield fork(handleServer);
}

function* handleServer() {

  const { context }: ExtensionState = yield select();

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
      config
    }
  }


  const client = new LanguageClient("paperclip", "Paperclip Language Server", serverOptions, clientOptions);

  context.subscriptions.push(client.start());

}