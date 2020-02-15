import { BaseLanguageService, BaseEngineLanguageService } from "../base";
import { EngineEvent } from "paperclip";
import * as parseColor from "color";
import {
  TextDocument,
  Color,
  Range,
  ColorPresentation,
  TextEdit
} from "vscode-languageserver";

export class PCCSSLanguageService extends BaseEngineLanguageService {
  protected _handleEngineEvent(event: EngineEvent) {}
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
