import { parse } from "./parser.peg";
import { HTMLExpressionLoader } from "@tandem/html-extension";
import { PCBlockAttributeExpression, PCBlockNodeExpression  } from "./ast";
import { Action, PropertyChangeAction, TreeNodeAction } from "@tandem/common";

export class PCExpressionLoader extends HTMLExpressionLoader {
  parseContent(content: string) {
    return parse(content);
  }

  // createFormattedSourceContent(action: Action) {
  //   let content = super.createFormattedSourceContent(action);

  //   if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
  //     if (action.target instanceof PCBlockNodeExpression) {
  //       // TODO
  //     }
  //   }

  //   return content;
  // }

}