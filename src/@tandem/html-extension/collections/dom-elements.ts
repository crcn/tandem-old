import { flatten } from "lodash";
import { IWalkable, ITreeWalker, TreeWalker } from "@tandem/common";
import {
  DOMNodeType,
  SyntheticDOMNode,
  getSelectorTester,
  SyntheticDOMElement,
  SyntheticCSSStyleRule,
  SyntheticDOMAttributes,
} from "@tandem/synthetic-browser";

export class DOMElements extends Array<SyntheticDOMElement>  implements IWalkable {

  setAttribute(name: string, value: string) {
    for (const element of this) {
      if (value == null) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value);
      }
    }
  }

  removeAttribute(name: string) {
    for (const element of this) {
      element.removeAttribute(name);
    }
  }

  visitWalker(walker: ITreeWalker) {
    this.forEach(element => element.visitWalker(walker));
  }

  get matchedCSSStyleRules(): SyntheticCSSStyleRule[] {

    const visited = {};
    const matched = [];

    this.forEach(element => {
      element.ownerDocument.styleSheets.forEach(styleSheet => {
        styleSheet.rules.forEach(rule => {
          if (!(rule instanceof SyntheticCSSStyleRule) || visited[rule.uid]) return;
          visited[rule.uid] = rule;

          const mismatch = this.find(element => !rule.matchesElement(element));
          if (!mismatch) {
            matched.push(rule);
          }
        });
      });
    });

    return matched;
  }

  get attributes(): SyntheticDOMAttributes {
    const attributes = new SyntheticDOMAttributes();
    for (const element of this) {
      for (const attribute of element.attributes) {
        if (!attributes.hasOwnProperty(attribute.name)) {
          attributes.push(attribute.clone());
        } else {
          attributes[attribute.name].value = "";
        }
      }
    }
    return attributes;
  }

  static fromArray(items: Array<any>) {
    return new DOMElements(...items.filter((element) => element && element.nodeType === DOMNodeType.ELEMENT) as any);
  }
}