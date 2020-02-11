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
  EngineEventKind,
  SyntaxGraphErrorInfo,
  EngineErrorEvent,
  EngineErrorKind,
  GraphErrorEvent
} from "paperclip";
import {
  LoadParams,
  NotificationType,
  EngineEventNotification,
  UpdateVirtualFileContentsParams
} from "../common/notifications";

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

  const handleGraphError = ({ file_path: filePath, info }: GraphErrorEvent) => {
    const textDocument = documents.get(`file://${filePath}`);

    const diagnostics: Diagnostic[] = [
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: textDocument.positionAt(info.location.start),
          end: textDocument.positionAt(info.location.end)
        },
        message: `${info.message}`,
        source: "ex"
      }
    ];

    connection.sendDiagnostics({
      uri: textDocument.uri,
      diagnostics
    });
  };

  const handleEngineError = (event: EngineErrorEvent) => {
    switch (event.error_kind) {
      case EngineErrorKind.Graph:
        return handleGraphError(event);
    }
  };

  engine.onEvent((event: EngineEvent) => {
    console.log(event);
    if (event.kind == EngineEventKind.Error) {
      handleEngineError(event);
    } else {
      // reset diagnostics
      if (event.kind === EngineEventKind.Evaluated) {
        const textDocument = documents.get(`file://${event.file_path}`);
        connection.sendDiagnostics({
          uri: textDocument.uri,
          diagnostics: []
        });
      }

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
