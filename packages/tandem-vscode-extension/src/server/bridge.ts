import {
  TextDocuments,
  Connection,
  ColorPresentationRequest,
  ColorPresentationParams,
  DocumentColorRequest,
  DocumentColorParams,
  DocumentLinkRequest,
  DocumentLinkParams
} from "vscode-languageserver";
import {
  BaseLanguageService,
  LanguageServiceEvent,
  LanguageServiceEventType,
  ColorInfo,
  DocumentLinkInfo
} from "./services/base";
import {
  Engine,
  EngineEvent,
  EngineEventKind,
  EngineErrorEvent,
  EngineErrorKind,
  GraphErrorEvent,
  SourceLocation,
  RuntimeErrorEvent,
  EvaluatedEvent
} from "paperclip";

import * as parseColor from "color";
import {
  TextDocument,
  Color,
  Range,
  ColorPresentation,
  ColorInformation,
  DiagnosticSeverity,
  TextEdit,
  Diagnostic
} from "vscode-languageserver";
import { Deferred } from "./services/utils";
import {
  EngineEventNotification,
  NotificationType,
  LoadParams
} from "../common/notifications";
import { DocumentLink } from "vscode";

export class VSCServiceBridge {
  private _textDocumentInfo: TextDocumentInfoDictionary;

  constructor(
    engine: Engine,
    service: BaseLanguageService,
    readonly connection: Connection,
    readonly documents: TextDocuments<TextDocument>
  ) {
    this._textDocumentInfo = new TextDocumentInfoDictionary(engine, service);
    engine.onEvent(this._onEngineEvent);
    connection.onRequest(
      ColorPresentationRequest.type,
      this._onColorPresentationRequest
    );
    connection.onRequest(
      DocumentColorRequest.type,
      this._onDocumentColorRequest
    );
    connection.onRequest(DocumentLinkRequest.type, this._onDocumentLinkRequest);

    connection.onNotification(NotificationType.LOAD, ({ uri }: LoadParams) => {
      engine.load(uri);
    });

    connection.onNotification(
      NotificationType.UNLOAD,
      ({ uri }: LoadParams) => {
        // TODO
        // engine.unload(uri);
      }
    );

    documents.onDidChangeContent(event => {
      const doc: TextDocument = event.document;
      engine.updateVirtualFileContent(doc.uri, doc.getText());
    });
  }

  private _onDocumentLinkRequest = (params: DocumentLinkParams) => {
    const document = this.documents.get(params.textDocument.uri);
    return this._textDocumentInfo
      .getTextDocumentInfo(document.uri)
      .getDocumentLinkInfo()
      .then(links => {
        return links.map(({ uri, location: { start, end } }) => ({
          target: uri,
          range: {
            start: document.positionAt(start),
            end: document.positionAt(end)
          }
        }));
      });
  };

  private _onDocumentColorRequest = (params: DocumentColorParams) => {
    const document = this.documents.get(params.textDocument.uri);
    return this._textDocumentInfo
      .getTextDocumentInfo(params.textDocument.uri)
      .getColorInfo()
      .then(info => {
        return info
          .map(({ color, location }) => {
            try {
              const {
                color: [red, green, blue],
                valpha: alpha
              } = parseColor(color);
              return {
                range: {
                  start: document.positionAt(location.start),
                  end: document.positionAt(location.end)
                },
                color: {
                  red: red / 255,
                  green: green / 255,
                  blue: blue / 255,
                  alpha
                }
              };
            } catch (e) {
              console.error(e.stack);
            }
          })
          .filter(Boolean) as ColorInformation[];
      });
  };

  private _onColorPresentationRequest = (params: ColorPresentationParams) => {
    return getColorPresentations(params.color, params.range);
  };

  private _onEngineEvent = (event: EngineEvent) => {
    switch (event.kind) {
      case EngineEventKind.Error: {
        return this._onEngineErrorEvent(event);
      }
      case EngineEventKind.Evaluated: {
        return this._onEngineEvaluatedEvent(event);
      }
    }
  };

  private _onEngineEvaluatedEvent(event: EvaluatedEvent) {
    // reset error diagnostics
    this.connection.sendDiagnostics({
      uri: event.uri,
      diagnostics: []
    });

    this.connection.sendNotification(
      ...new EngineEventNotification(event).getArgs()
    );
  }

  private _onEngineErrorEvent(event: EngineErrorEvent) {
    try {
      switch (event.errorKind) {
        case EngineErrorKind.Graph: {
          return this._handleGraphError(event);
        }
        case EngineErrorKind.Runtime: {
          return this._handleRuntimeError(event);
        }
      }
    } catch (e) {
      console.error(e.stack);
    }
  }

  private _handleGraphError({
    uri,
    info: { message, location }
  }: GraphErrorEvent) {
    this._sendError(uri, message, location);
  }
  private _handleRuntimeError({ uri, message, location }: RuntimeErrorEvent) {
    this._sendError(uri, message, location);
  }

  private _sendError(uri: string, message: string, location: SourceLocation) {
    const textDocument = this.documents.get(uri);
    if (!textDocument) {
      return;
    }

    const diagnostics: Diagnostic[] = [
      createErrorDiagnostic(message, textDocument, location)
    ];

    this.connection.sendDiagnostics({
      uri: textDocument.uri,
      diagnostics
    });
  }
}

class TextDocumentInfoDictionary {
  private _documents: {
    [identifier: string]: TextDocumentInfo;
  } = {};
  constructor(private _engine: Engine, private _service: BaseLanguageService) {
    _engine.onEvent(this._onEngineEvent);
    _service.onEvent(this._onServiceEvent);
  }

  private _onEngineEvent = (event: EngineEvent) => {
    if (
      event.kind === EngineEventKind.Loading ||
      event.kind === EngineEventKind.Updating
    ) {
      this.getTextDocumentInfo(event.uri).clear();
    }
  };

  private _onServiceEvent = (event: LanguageServiceEvent) => {
    this.getTextDocumentInfo(event.uri).$$handleServiceEvent(event);
  };

  getTextDocumentInfo(uri: string) {
    return (
      this._documents[uri] || (this._documents[uri] = new TextDocumentInfo(uri))
    );
  }
}

class TextDocumentInfo {
  private _colorInfo: Deferred<ColorInfo[]>;
  private _documentLinkInfo: Deferred<DocumentLinkInfo[]>;

  constructor(readonly uri: string) {
    this.clear();
  }
  clear() {
    this._colorInfo = new Deferred();
    this._documentLinkInfo = new Deferred();
  }

  $$handleServiceEvent(event: LanguageServiceEvent) {
    if (event.type === LanguageServiceEventType.Information) {
      this._colorInfo.resolve(event.colors);
      this._documentLinkInfo.resolve(event.links);
    }
  }

  getColorInfo() {
    return this._colorInfo.promise;
  }
  getDocumentLinkInfo() {
    return this._documentLinkInfo.promise;
  }
}

// from https://github.com/microsoft/vscode-css-languageservice/blob/a652e5da7ebb86677bff750c9ca0cf4740adacee/src/services/cssNavigation.ts#L196
const getColorPresentations = (
  { red, green, blue, alpha }: Color,
  range: Range
): ColorPresentation[] => {
  const info = parseColor.rgb(
    Math.round(red * 255),
    Math.round(green * 255),
    Math.round(blue * 255),
    alpha
  );
  const label = info.toString();
  return [{ label, textEdit: TextEdit.replace(range, label) }];
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
