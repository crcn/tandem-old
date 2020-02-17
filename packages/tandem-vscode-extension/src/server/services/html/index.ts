import { BaseEngineLanguageService, ASTInfo } from "../base";
import {
  EngineEvent,
  Engine,
  EngineEventKind,
  Node,
  Element,
  Sheet,
  NodeParsedEvent,
  getStyleElements,
  Rule,
  RuleKind,
  getImports,
  getAttributeValue,
  AttributeValueKind,
  EvaluatedEvent,
  getVisibleChildNodes,
  NodeKind,
  getImportIds,
  getAttributeStringValue,
  getParts
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

type HandleContext = {
  root: Node;
  uri: string;
  importIds: string[];
  info: ASTInfo;
};

export class PCHTMLLanguageService extends BaseEngineLanguageService<Node> {
  supports(uri: string) {
    return /\.pc$/.test(uri);
  }
  protected _handleEngineEvent(event: EngineEvent) {
    if (event.kind === EngineEventKind.NodeParsed) {
      this._handleNodeParsedEvent(event);
    } else if (event.kind === EngineEventKind.Evaluated) {
      this._handleEvaluatedEvent(event);
    }
  }

  private _handleNodeParsedEvent({ node, uri }: NodeParsedEvent) {
    this._addAST(node, uri);
  }
  protected _createASTInfo(root: Node, uri: string) {
    const context: HandleContext = {
      root,
      uri,
      importIds: getImportIds(root),
      info: {
        colors: [],
        links: [],
        definitions: []
      }
    };

    this._handleStyles(context);
    this._handleDocument(context);

    return context.info;
  }

  private _handleEvaluatedEvent(event: EvaluatedEvent) {}

  private _handleStyles(context: HandleContext) {
    const styleElements = getStyleElements(context.root);
    for (const { sheet } of styleElements) {
      this._handleSheet(sheet, context);
    }
  }
  private _handleSheet(sheet: Sheet, context: HandleContext) {
    this._handleRules(sheet.rules, context);
  }

  private _handleRules(rules: Rule[], context: HandleContext) {
    for (const rule of rules) {
      if (rule.kind === RuleKind.Style) {
        this._handleRule(rule, context);
      }
    }
  }
  private _handleRule(rule: Rule, context: HandleContext) {
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

        context.info.colors.push({
          color,
          location: { start: colorStart, end: colorStart + color.length }
        });
      }
    }
  }

  private _handleDocument(context: HandleContext) {
    this._handleImports(context);
    this._handleMainTemplate(context);
  }
  private _handleImports(context: HandleContext) {
    const { root: node, uri } = context;
    const imports = getImports(node);
    for (const imp of imports) {
      const srcAttr = getAttributeValue("src", imp);
      if (srcAttr.attrKind === AttributeValueKind.String) {
        context.info.links.push({
          uri: resolveUri(uri, srcAttr.value),
          location: srcAttr.location
        });
      }
    }
  }
  private _handleMainTemplate(context: HandleContext) {
    for (const child of getVisibleChildNodes(context.root)) {
      this._handleVisibleNode(child, context);
    }
  }
  private _handleVisibleNode(node: Node, context: HandleContext) {
    if (node.kind === NodeKind.Element) {
      this._handleElement(node, context);
    }
    for (const child of getVisibleChildNodes(node)) {
      this._handleVisibleNode(child, context);
    }
  }
  private _handleElement(element: Element, context: HandleContext) {
    const tagParts = element.tagName.split(":");
    const namespace = tagParts[0];
    const name = tagParts[tagParts.length - 1];
    if (context.importIds.indexOf(namespace) !== -1) {
      const imp = getImports(context.root).find(imp => {
        return getAttributeStringValue("id", imp) === namespace;
      });

      const impUri = resolveUri(
        context.uri,
        getAttributeStringValue("src", imp)
      );

      const impAst = this._getAST(impUri);

      if (impAst) {
        if (tagParts.length === 2) {
          const part = getParts(impAst).find(part => {
            return getAttributeStringValue("id", part) === name;
          });

          if (part) {
            context.info.definitions.push({
              sourceUri: impUri,
              sourceLocation: part.openTagLocation,
              instanceLocation: element.tagNameLocation
            });
          }
        } else {
          const firstVisibleNode = getVisibleChildNodes(impAst)[0];

          context.info.definitions.push({
            sourceUri: impUri,
            sourceLocation: (firstVisibleNode &&
              firstVisibleNode.kind === NodeKind.Element &&
              firstVisibleNode.openTagLocation) || { start: 0, end: 0 },
            instanceLocation: element.tagNameLocation
          });
        }
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
