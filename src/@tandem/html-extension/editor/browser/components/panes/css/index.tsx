
import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { kebabCase, camelCase } from "lodash";
import { Workspace } from "@tandem/editor/browser/models";
import { DOMElements } from "@tandem/html-extension/collections";
import { GutterComponent } from "@tandem/editor/browser/components";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import {
  parseCSS,
  evaluateCSS,
  SyntheticWindow,
  SyntheticHTMLElement,
  SyntheticCSSStyleRule,
  isValidCSSDeclarationProperty,
} from "@tandem/synthetic-browser";


// TODO - add some color for the CSS rules
class MatchedCSSStyleRuleComponent extends BaseApplicationComponent<{ rule: SyntheticCSSStyleRule }, any> {
  setDeclaration = (name: string, value: string, oldName?: string) => {
    this.props.rule.style.setProperty(name, value, undefined, oldName);
  }
  render() {
    const { rule } = this.props;
    const items = [];

    for (const key of rule.style) {
      const value = rule.style[key];
      items.push({ name: kebabCase(key), value: rule.style[key] });
    }

    return <div>
      <div className="td-section-header color-green-10">
        { rule.selector }
        <div className="controls">
          <span onClick={() => this.setDeclaration("", "")}>+</span>
        </div>
      </div>
      <HashInputComponent items={items} setKeyValue={this.setDeclaration} />
    </div>
  }
}

@reactEditorPreview(() => {
  const { document } = new SyntheticWindow(null);

  document.styleSheets.push(evaluateCSS(parseCSS(`
    .container {
      color: red;
      background: rgba(255, 255, 255, 0);
      box-sizing: border-box;
      padding-right: border-box;
    }

    div {
      color: red;
    }

    #something {

    }
  `)));

  (document.body as SyntheticHTMLElement).innerHTML = `
    <div id="something" class="container">hello</div>;
  `;

  const workspace = new Workspace();
  workspace.select(document.querySelector(".container"));

  return <GutterComponent>
    <ElementCSSPaneComponent workspace={workspace} />
  </GutterComponent>
})
export class ElementCSSPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { selection } = this.props.workspace;
    const elements = DOMElements.fromArray(selection);
    return <div className="td-pane">
      { elements.matchedCSSStyleRules.map((matchedRule, index) => {
        return <MatchedCSSStyleRuleComponent rule={matchedRule} key={index} />
      }) }
    </div>
  }
}