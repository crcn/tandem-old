import {
  ColorInfo,
  BaseEngineLanguageService,
  LanguageServiceEventType
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
  RuleKind
} from "paperclip";
import CSS_COLOR_NAMES from "./css-color-names";
const CSS_COLOR_NAME_LIST = Object.keys(CSS_COLOR_NAMES);
const CSS_COLOR_NAME_REGEXP = new RegExp(
  `\\b(${CSS_COLOR_NAME_LIST.join("|")})\\b`,
  "g"
);
console.log(CSS_COLOR_NAME_REGEXP);

export class PCHTMLLanguageService extends BaseEngineLanguageService {
  constructor(engine: Engine) {
    super(engine);
  }
  protected _handleEngineEvent(event: EngineEvent) {
    if (event.kind === EngineEventKind.NodeParsed) {
      this._handleNodeParsedEvent(event);
    }
  }
  private _handleNodeParsedEvent({ node, uri }: NodeParsedEvent) {
    this._handleStyles(node, uri);
  }
  private _handleStyles(node: Node, uri: string) {
    const styleElements = getStyleElements(node);
    for (const { sheet } of styleElements) {
      this._handleSheet(sheet, uri);
    }
  }
  private _handleSheet(sheet: Sheet, uri: string) {
    this._handleRules(sheet.rules, uri);
  }

  private _handleRules(rules: Rule[], uri: string) {
    for (const rule of rules) {
      if (rule.kind === RuleKind.Style) {
        this._handleRule(rule, uri);
      }
    }
  }
  private _handleRule(rule: Rule, uri: string) {
    const colorInfo: ColorInfo[] = [];
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

        colorInfo.push({
          color,
          location: { start: colorStart, end: colorStart + color.length }
        });
      }
    }

    this.dispatch({
      type: LanguageServiceEventType.ColorInformation,
      uri,
      payload: colorInfo
    });
  }
}
