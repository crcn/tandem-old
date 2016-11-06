import * as ts from "typescript";
import {
  BaseContentEditor,
  ISyntheticObject,
  SetKeyValueEditAction,
} from "@tandem/sandbox";
import {
  SyntheticDOMElement,
  SyntheticDOMNode,
  DOMNodeType,
  SyntheticDOMElementEdit,
  SyntheticDOMContainerEdit,
} from "@tandem/synthetic-browser";


interface ITSReplacement {
  start: number;
  end: number;
  value: string;
}

export class TSEditor extends BaseContentEditor<ts.Node> {

  private _replacements: ITSReplacement[] = [];

  [SyntheticDOMElementEdit.SET_ELEMENT_ATTRIBUTE_EDIT](target: ts.JsxElement, action: SetKeyValueEditAction) {

    function alternativeName(name) {
      return {
        class: "className"
      }[name];
    }

    for (const attribute of target.openingElement.attributes) {

      // TODO - need to consider spreads
      const attr = attribute as ts.JsxAttribute;
      console.log(attr.name.text, action.name);
      if (attr.name.text === action.name || attr.name.text === alternativeName(action.name)) {
        this._replacements.push({
          start: attr.initializer.getStart(),
          end: attr.initializer.getEnd(),
          value: `"${action.newValue}"`
        });
      }
    }
  }

  parseContent(content: string) {
    return ts.createSourceFile(this.fileName, content, ts.ScriptTarget.ES6, true);;
  }

  findTargetASTNode(root: ts.SourceFile, target: SyntheticDOMNode) {
    let found: ts.Node;

    const find = (node: ts.Node)  => {
      const pos = ts.getLineAndCharacterOfPosition(root, node.getFullStart());
      if (pos.line === target.$source.start.line - 1 && pos.character === target.$source.start.column) {
        if (target.nodeType === DOMNodeType.ELEMENT) {
          if (node.kind === ts.SyntaxKind.JsxElement || node.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            found = node;
          }
        }
      }
      if (!found) ts.forEachChild(node, find);
    };

    ts.forEachChild(root, find);

    return found;
  }

  getFormattedContent(root: ts.SourceFile) {
    let text = this.content;
    for (const { start, end, value } of this._replacements) {
      text = text.substr(0, start) + value + text.substr(end);
    }
    return text;
  }
}