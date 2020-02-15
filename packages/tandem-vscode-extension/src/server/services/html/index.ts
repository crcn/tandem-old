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
  Rule
} from "paperclip";
import { PCCSSLanguageService } from "../css";
import * as Color from "color";

export class PCHTMLLanguageService extends BaseEngineLanguageService {
  // TODO - use language handler for style elements
  private _cssLanguageService: PCCSSLanguageService;
  constructor(engine: Engine) {
    super(engine);
  }
  protected _handleEngineEvent(event: EngineEvent) {
    if (event.kind === EngineEventKind.NodeParsed) {
      this._handleNodeParsedEvent(event);
    }
  }
  private _handleNodeParsedEvent({ node, filePath }: NodeParsedEvent) {
    this._handleStyles(node, filePath);
  }
  private _handleStyles(node: Node, filePath: string) {
    const styleElements = getStyleElements(node);
    for (const { sheet } of styleElements) {
      this._handleSheet(sheet, filePath);
    }
  }
  private _handleSheet(sheet: Sheet, filePath: string) {
    this._handleRules(sheet.rules, filePath);
  }

  private _handleRules(rules: Rule[], filePath: string) {
    for (const rule of rules) {
      this._handleRule(rule, filePath);
    }
  }
  private _handleRule(rule: Rule, filePath: string) {
    const colorInfo: ColorInfo[] = [];
    for (const declaration of rule.declarations) {
      for (const color of declaration.value.match(
        /\#[^\s]+|(rgba|rgb|hsl|hsla)\(.*?\)/g
      ) || []) {
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
      filePath,
      payload: colorInfo
    });
  }
}
