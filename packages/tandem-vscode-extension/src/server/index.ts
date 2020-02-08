import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializedParams,
  Connection,
  Diagnostic,
  TextDocumentSyncKind,
  TextDocumentPositionParams,
  CompletionParams,
  DiagnosticSeverity
} from "vscode-languageserver";

import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Engine,
  EngineEvent,
  EngineEventType,
  ParseErrorEvent
} from "paperclip";
import {
  NotificationType,
  LoadParams,
  UpdateVirtualFileContentsParams,
  EngineEventNotification
} from "../common/notifications";
import { TextDocumentChangeEvent, workspace, Range } from "vscode";

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

  const handleParseErrorEvent = ({
    file_path: filePath,
    error
  }: ParseErrorEvent) => {
    const textDocument = documents.get(`file://${filePath}`);

    const diagnostics: Diagnostic[] = [
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: textDocument.positionAt(error.pos),
          end: textDocument.positionAt(error.pos + 1)
        },
        message: `${error.message}`,
        source: "ex"
      }
    ];

    connection.sendDiagnostics({
      uri: textDocument.uri,
      diagnostics
    });
  };

  engine.onEvent((event: EngineEvent) => {
    if (event.type == EngineEventType.ParseError) {
      handleParseErrorEvent(event);
    } else {
      connection.sendNotification(
        ...new EngineEventNotification(event).getArgs()
      );
    }
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
    engine.updateVirtualFileContent(doc.uri, doc.getText());
  });
};

connection.onInitialized((params: InitializedParams) => {
  initEngine(connection, documents);
});

documents.listen(connection);
connection.listen();

connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams) => {
  return [];
});
