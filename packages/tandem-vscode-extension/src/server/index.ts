import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializedParams,
  Connection,
  TextDocumentSyncKind
} from "vscode-languageserver";

import { TextDocument } from "vscode-languageserver-textdocument";
import { Engine, EngineEvent } from "paperclip";
import {
  NotificationType,
  LoadParams,
  UpdateVirtualFileContentsParams,
  EngineEventNotification
} from "../common/notifications";
import { TextDocumentChangeEvent } from "vscode";

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<any> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client that the server supports code completion
      completionProvider: {
        resolveProvider: true
      }
    }
  };
});

const initEngine = async (
  connection: Connection,
  documents: TextDocuments<TextDocument>
) => {
  const engine = new Engine();
  engine.onEvent((event: EngineEvent) => {
    connection.sendNotification(
      ...new EngineEventNotification(event).getArgs()
    );
  });
  connection.onNotification(
    NotificationType.LOAD,
    ({ filePath }: LoadParams) => {
      engine.load(filePath);
    }
  );
  connection.onNotification(
    NotificationType.UNLOAD,
    ({ filePath }: LoadParams) => {
      engine.unload(filePath);
    }
  );
  connection.onNotification(
    NotificationType.UPDATE_VIRTUAL_FILE_CONTENTS,
    ({ filePath, content }: UpdateVirtualFileContentsParams) => {
      engine.updateVirtualFileContent(filePath, content);
    }
  );

  documents.onDidChangeContent(event => {
    const doc: TextDocument = event.document;
    engine.load(doc.uri);
    engine.updateVirtualFileContent(doc.uri, doc.getText());
  });
};

connection.onInitialized((params: InitializedParams) => {
  initEngine(connection, documents);
});

documents.listen(connection);
connection.listen();
