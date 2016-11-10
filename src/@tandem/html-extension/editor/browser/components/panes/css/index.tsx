import "./index.scss";

import * as React from "react";
import { kebabCase, camelCase } from "lodash";
import { Workspace } from "@tandem/editor/browser/models";
import { DOMElements, MatchedStyleRule } from "@tandem/html-extension/collections";
import { GutterComponent } from "@tandem/editor/browser/components";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { ApplyFileEditAction } from "@tandem/sandbox";
import { CSSPrettyPaneComponent } from "./pretty";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticCSSStyleRule, SyntheticCSSStyleDeclaration, SyntheticDOMElement } from "@tandem/synthetic-browser";

interface ICSSStylePaneComponentProps {
  title?: string;
  titleClassName?: string;
  style: SyntheticCSSStyleDeclaration;
  setDeclaration: (key, value, oldKey?) => any;
  pretty?: boolean;
  overriden?: any;
  renderTitle?(props?: ICSSStylePaneComponentProps): any;
}

export class CSSStylePaneComponent extends BaseApplicationComponent<ICSSStylePaneComponentProps, any> {
  render() {
    const { setDeclaration, renderTitle, title, style, titleClassName, pretty, overriden } = this.props;
    const items = [];

    for (const key of style) {
      const value = style[key];
      items.push({ name: kebabCase(key), value: style[key], overriden: overriden && overriden[key] });
    }

    return <div>
      <div className={["td-section-header", titleClassName].join(" ")}>
        { renderTitle ? renderTitle(this.props) : title }
        <div className="controls">
          <span onClick={() => setDeclaration("", "")}>+</span>
        </div>
      </div>
      { pretty ? <CSSPrettyPaneComponent style={style} /> : <HashInputComponent items={items} setKeyValue={setDeclaration} /> }
    </div>
  }
}


// TODO - add some color for the CSS rules
class MatchedCSSStyleRuleComponent extends BaseApplicationComponent<{ rule: MatchedStyleRule, workspace: Workspace }, any> {

  private _highlightedElements: SyntheticDOMElement[];

  setDeclaration = (name: string, value: string, oldName?: string) => {
    this.props.rule.value.style.setProperty(name, value, undefined, oldName);
    const edit = this.props.rule.value.createEdit();
    if (value !== "") {
      edit.setDeclaration(name, value, oldName);
    }
    this.bus.execute(new ApplyFileEditAction(edit.actions));
  }
  render() {
    const { rule } = this.props;

    return <CSSStylePaneComponent
    style={rule.value.style}
    titleClassName="color-green-10"
    setDeclaration={this.setDeclaration}
    renderTitle={this.renderTitle}
    overriden={rule.overridedDeclarations}
    />
  }

  onTitleMouseEnter = () => {
    this._highlightedElements = this.props.workspace.document.querySelectorAll(this.props.rule.value.selector);
    for (const element of this._highlightedElements) {
      element.metadata.set(MetadataKeys.HOVERING, true);
    }
  }

  onTitleMouseLeave = () => {
    for (const element of this._highlightedElements) {
      element.metadata.set(MetadataKeys.HOVERING, false);
    }
  }

  onTitleClick = () => {
    this.props.workspace.select(this._highlightedElements);
  }

  renderTitle = () => {
    return <div className="css-pane-title" onMouseEnter={this.onTitleMouseEnter} onMouseLeave={this.onTitleMouseLeave} onClick={this.onTitleClick}>
      { this.props.rule.value.selector }
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
        return <MatchedCSSStyleRuleComponent rule={matchedRule} key={index} workspace={this.props.workspace} />
      }) }
    </div>
  }
}