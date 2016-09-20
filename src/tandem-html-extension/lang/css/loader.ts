import { parseCSS } from "./parser";

import {
  Action,
  getChunk,
  spliceChunk,
  TreeNodeAction,
  PropertyChangeAction,
  BaseASTNodeLoader,
} from "tandem-common";

import {
  CSSExpression,
  CSSRootExpression,
  CSSRuleExpression,
  CSSATRuleExpression,
  CSSCommentExpression,
  CSSDeclarationExpression,
} from "./ast";

export class CSSExpressionLoader extends BaseASTNodeLoader {
  parseContent(content: string): CSSRootExpression {
    return parseCSS(content);
  }
  createFormattedSourceContent(action: Action) {

    let content = <string>this.source.content;

    if (action.type === TreeNodeAction.NODE_ADDED) {

    } else if (action.type === TreeNodeAction.NODE_REMOVED) {

    } else if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
      const { property, newValue, oldValue } = <PropertyChangeAction>action;
      if (action.target instanceof CSSDeclarationExpression) {
        const declaration = <CSSDeclarationExpression>action.target;
        if (property === "value") {
          const newDeclaration = getChunk(content, declaration.position).replace(/(:\s*)[^;]*/, `$1${newValue}`);
          content = spliceChunk(content, newDeclaration, declaration.position);
        }
      }
    }


    return content;
  }
}