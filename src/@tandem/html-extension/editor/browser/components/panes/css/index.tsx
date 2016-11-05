import * as React from "react";
import { kebabCase, camelCase } from "lodash";
import { Workspace } from "@tandem/editor/browser/models";
import { DOMElements } from "@tandem/html-extension/collections";
import { GutterComponent } from "@tandem/editor/browser/components";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import { ApplyFileEditAction } from "@tandem/sandbox";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticCSSStyleRule } from "@tandem/synthetic-browser";


// TODO - add some color for the CSS rules
class MatchedCSSStyleRuleComponent extends BaseApplicationComponent<{ rule: SyntheticCSSStyleRule }, any> {
  setDeclaration = (name: string, value: string, oldName?: string) => {
    this.props.rule.style.setProperty(name, value, undefined, oldName);
    const edit = this.props.rule.createEdit();
    edit.setDeclaration(name, value, oldName);
    this.bus.execute(new ApplyFileEditAction(edit.actions));
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

export class ElementCSSPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    if (!this.props.workspace) return null;
    const { selection } = this.props.workspace;
    const elements = DOMElements.fromArray(selection);
    return <div className="td-pane">
      { elements.matchedCSSStyleRules.map((matchedRule, index) => {
        return <MatchedCSSStyleRuleComponent rule={matchedRule} key={index} />
      }) }
    </div>
  }
}