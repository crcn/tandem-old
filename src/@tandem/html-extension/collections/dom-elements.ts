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

export class MatchedStyleRule {
  public overridedDeclarations: any;
  constructor(readonly value: SyntheticCSSStyleRule) {
    this.overridedDeclarations = {};
  }
}

export class DOMElements<T extends SyntheticDOMElement> extends Array<T>  implements IWalkable {

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

  get matchedCSSStyleRules(): MatchedStyleRule[] {

    const visited = {};
    const matched: MatchedStyleRule[] = [];

    this.forEach(element => {
      element.ownerDocument.styleSheets.forEach(styleSheet => {
        styleSheet.rules.forEach(rule => {
          if (!(rule instanceof SyntheticCSSStyleRule) || visited[rule.uid]) {
            return;
          }
          visited[rule.uid] = rule;

          const mismatch = this.find(element => !rule.matchesElement(element));
          if (!mismatch) {

            // add rule to the beginning
            matched.unshift(new MatchedStyleRule(rule));
          }
        });
      });
    });

    const usedDeclarations: any = {};

    for (const matchedStyleRule of matched) {
      for (const name of matchedStyleRule.value.style) {
        if (usedDeclarations[name]) {
          matchedStyleRule.overridedDeclarations[name] = true
        }

        usedDeclarations[name] = true;
      }
    }

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