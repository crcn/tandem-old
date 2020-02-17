import {
  TextDocuments,
  Connection,
  ColorPresentationRequest,
  ColorPresentationParams,
  DocumentColorRequest,
  DocumentColorParams
} from "vscode-languageserver";
import {
  BaseLanguageService,
  LanguageServiceEvent,
  LanguageServiceEventType,
  ColorInfo
} from "./base";
import { Engine, EngineEvent, EngineEventKind } from "paperclip";

import * as parseColor from "color";
import {
  TextDocument,
  Color,
  Range,
  ColorPresentation,
  ColorInformation,
  TextEdit
} from "vscode-languageserver";
import { Deferred } from "./utils";

export class VSCServiceBridge {
  private _textDocumentInfo: TextDocumentInfoDictionary;

  constructor(
    engine: Engine,
    service: BaseLanguageService,
    readonly connection: Connection,
    readonly documents: TextDocuments<TextDocument>
  ) {
    this._textDocumentInfo = new TextDocumentInfoDictionary(engine, service);
    connection.onRequest(
      ColorPresentationRequest.type,
      this._onColorPresentationRequest
    );
    connection.onRequest(
      DocumentColorRequest.type,
      this._onDocumentColorRequest
    );
  }

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

  constructor(readonly uri: string) {
    this.clear();
  }
  clear() {
    this._colorInfo = new Deferred();
  }

  $$handleServiceEvent(event: LanguageServiceEvent) {
    if (event.type === LanguageServiceEventType.ColorInformation) {
      this._colorInfo.resolve(event.payload);
    }
  }

  getColorInfo() {
    return this._colorInfo.promise;
  }
}

// from https://github.com/microsoft/vscode-css-languageservice/blob/a652e5da7ebb86677bff750c9ca0cf4740adacee/src/services/cssNavigation.ts#L196
export function getColorPresentations(
  { red, green, blue, alpha }: Color,
  range: Range
): ColorPresentation[] {
  const info = parseColor.rgb(
    Math.round(red * 255),
    Math.round(green * 255),
    Math.round(blue * 255),
    alpha
  );
  const label = info.toString();
  return [{ label, textEdit: TextEdit.replace(range, label) }];
}
