import {
  ColorInfo,
  BaseEngineLanguageService,
  LanguageServiceEventType,
  DocumentLinkInfo
} from "../base";
import {
  EngineEvent,
  Engine,
  EngineEventKind,
  Node,
  Sheet,
  NodeParsedEvent,
  getStyleElements,
  Rule,
  RuleKind,
  getImports,
  getAttributeValue,
  AttributeValueKind
} from "paperclip";
import * as path from "path";

import CSS_COLOR_NAMES from "./css-color-names";
const CSS_COLOR_NAME_LIST = Object.keys(CSS_COLOR_NAMES);
const CSS_COLOR_NAME_REGEXP = new RegExp(
  `\\b(${CSS_COLOR_NAME_LIST.join("|")})\\b`,
  "g"
);

/**
 * Main HTML language service. Contains everything for now.
 */

export class PCHTMLLanguageService extends BaseEngineLanguageService {
  private _colorInfo: ColorInfo[];
  private _documentLinkInfo: DocumentLinkInfo[];
  constructor(engine: Engine) {
    super(engine);
  }
  protected _handleEngineEvent(event: EngineEvent) {
    if (event.kind === EngineEventKind.NodeParsed) {
      this._handleNodeParsedEvent(event);
    }
  }
  private _handleNodeParsedEvent({ node, uri }: NodeParsedEvent) {
    this._colorInfo = [];
    this._documentLinkInfo = [];
    this._handleStyles(node);
    this._handleDocument(node, uri);

    this.dispatch({
      type: LanguageServiceEventType.Information,
      uri,
      colors: this._colorInfo,
      links: this._documentLinkInfo
    });
  }
  private _handleStyles(node: Node) {
    const styleElements = getStyleElements(node);
    for (const { sheet } of styleElements) {
      this._handleSheet(sheet);
    }
  }
  private _handleSheet(sheet: Sheet) {
    this._handleRules(sheet.rules);
  }

  private _handleRules(rules: Rule[]) {
    for (const rule of rules) {
      if (rule.kind === RuleKind.Style) {
        this._handleRule(rule);
      }
    }
  }
  private _handleRule(rule: Rule) {
    for (const declaration of rule.declarations) {
      const colors =
        declaration.value.match(/\#[^\s]+|(rgba|rgb|hsl|hsla)\(.*?\)/g) ||
        declaration.value.match(CSS_COLOR_NAME_REGEXP) ||
        [];

      for (const color of colors) {
        const colorIndex = declaration.value.indexOf(color);

        // Color(color)
        // const {color: [r, g, b], valpha: a } = Color(color);
        const colorStart = declaration.valueLocation.start + colorIndex;

        this._colorInfo.push({
          color,
          location: { start: colorStart, end: colorStart + color.length }
        });
      }
    }
  }

  private _handleDocument(node: Node, uri: string) {
    this._handleImports(node, uri);
  }
  private _handleImports(node: Node, uri: string) {
    const imports = getImports(node);
    for (const imp of imports) {
      const srcAttr = getAttributeValue("src", imp);
      if (srcAttr.attrKind === AttributeValueKind.String) {
        this._documentLinkInfo.push({
          uri: resolveUri(uri, srcAttr.value),
          location: srcAttr.location
        });
      }
    }
  }
}

const resolveUri = (fromUri: string, relativePath: string) => {
  return (
    "file://" +
    path.normalize(
      path.join(path.dirname(fromUri.replace("file://", "")), relativePath)
    )
  );
};
