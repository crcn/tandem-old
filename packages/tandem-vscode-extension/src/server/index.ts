// ref: https://github.com/microsoft/vscode-css-languageservice

import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializedParams,
  Connection,
  ColorInformation,
  Diagnostic,
  TextDocumentSyncKind,
  TextDocumentPositionParams,
  DiagnosticSeverity,
  DocumentColorRequest,
  ColorPresentationRequest
} from "vscode-languageserver";

import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Engine,
  EngineEvent,
  EngineEventKind,
  SourceLocation,
  EngineErrorEvent,
  EngineErrorKind,
  GraphErrorEvent,
  RuntimeErrorEvent
} from "paperclip";
import {
  LoadParams,
  NotificationType,
  EngineEventNotification
} from "../common/notifications";
import * as parseColor from "color";
import { createFacade as createServiceFacade } from "./services/facade";
import {
  LanguageServiceEvent,
  LanguageServiceEventType,
  ColorInfoEvent
} from "./services/base";
import { VSCServiceBridge, getColorPresentations } from "./services/bridge";

const PAPERCLIP_RENDER_PART = "preview";

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<any> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client that the server supports code completion
      completionProvider: {
        resolveProvider: true
      },
      colorProvider: true
    }
  };
});

const initService = (
  engine: Engine,
  connection: Connection,
  documents: TextDocuments<TextDocument>
) => {
  const service = createServiceFacade(engine);
  new VSCServiceBridge(engine, service, connection, documents);
  let _colorInfo = {};
};

const initEngine = async (
  connection: Connection,
  documents: TextDocuments<TextDocument>
) => {
  const engine = new Engine({
    renderPart: PAPERCLIP_RENDER_PART
  });

  initService(engine, connection, documents);

  const handleGraphError = ({ uri, info }: GraphErrorEvent) => {
    sendError(uri, info.message, info.location);
  };

  const handleRuntimeError = ({
    uri,
    message,
    location
  }: RuntimeErrorEvent) => {
    sendError(uri, message, location);
  };

  const sendError = (
    uri: string,
    message: string,
    location: SourceLocation
  ) => {
    const textDocument = documents.get(uri);
    if (!textDocument) {
      return;
    }

    const diagnostics: Diagnostic[] = [
      createErrorDiagnostic(message, textDocument, location)
    ];

    connection.sendDiagnostics({
      uri: textDocument.uri,
      diagnostics
    });
  };

  const createErrorDiagnostic = (
    message: string,
    textDocument: TextDocument,
    location: SourceLocation
  ) => {
    return {
      severity: DiagnosticSeverity.Error,
      range: {
        start: textDocument.positionAt(location.start),
        end: textDocument.positionAt(location.end)
      },
      message: `${message}`,
      source: "ex"
    };
  };

  const handleEngineError = (event: EngineErrorEvent) => {
    switch (event.errorKind) {
      case EngineErrorKind.Graph:
        return handleGraphError(event);
      case EngineErrorKind.Runtime:
        return handleRuntimeError(event);
    }
  };

  engine.onEvent((event: EngineEvent) => {
    if (event.kind == EngineEventKind.Error) {
      handleEngineError(event);
    } else {
      // reset diagnostics
      if (event.kind === EngineEventKind.Evaluated) {
        connection.sendDiagnostics({
          uri: event.uri,
          diagnostics: []
        });
      }
      connection.sendNotification(
        ...new EngineEventNotification(event).getArgs()
      );
    }
  });
  connection.onNotification(NotificationType.LOAD, ({ uri }: LoadParams) => {
    engine.load(uri);
  });

  connection.onNotification(NotificationType.UNLOAD, ({ uri }: LoadParams) => {
    // TODO
    // engine.unload(uri);
  });

  documents.onDidChangeContent(event => {
    const doc: TextDocument = event.document;
    engine.updateVirtualFileContent(doc.uri, doc.getText());
  });
};

connection.onInitialized((_params: InitializedParams) => {
  initEngine(connection, documents);
});

documents.listen(connection);
connection.listen();

connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams) => {
  return [];
});
