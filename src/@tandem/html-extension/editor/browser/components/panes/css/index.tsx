import "./index.scss";


import * as React from "react";
import { kebabCase, camelCase } from "lodash";
import { Workspace } from "@tandem/editor/browser/models";
import { DOMElements, MatchedStyleRule } from "@tandem/html-extension/collections";
import { GutterComponent } from "@tandem/editor/browser/components";
import { HashInputComponent, KeyValueInputComponent, IKeyValueInputComponentProps } from "@tandem/html-extension/editor/browser/components/common";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { ApplyFileEditAction } from "@tandem/sandbox";
import { CSSPrettyPaneComponent } from "./pretty";
import { BaseApplicationComponent } from "@tandem/common";
import {
  MatchedCSSStyleRule,
  SyntheticDOMElement,
  SyntheticCSSStyleRule,
  findMatchingStyleRules,
  isInheritedCSSStyleProperty,
  SyntheticCSSStyleDeclaration,
} from "@tandem/synthetic-browser";

export interface ICSSStylePaneComponentProps {
  title?: string;
  titleClassName?: string;
  style: SyntheticCSSStyleDeclaration;
  setDeclaration: (key, value, oldKey?) => any;
  pretty?: boolean;
  overriden?: any;
  inherited?: boolean;
  renderTitle?(props?: ICSSStylePaneComponentProps): any;
}

export class CSSStylePropertyComponent extends BaseApplicationComponent<IKeyValueInputComponentProps, { showPrettyInput: boolean }> {
  state = { showPrettyInput: false };
  togglePrettyInput = () => {
    this.setState({ showPrettyInput: !this.state.showPrettyInput });
  }
  render() {
    const props = this.props;
    return <div className="css-property-input">
      <div className="css-property-input-line">
        <KeyValueInputComponent {...props} style={props.item["dim"] ? { color: 0.4 } : {}} />
        <i className={[this.state.showPrettyInput ? "ion-close" : "ion-edit", "edit-button", "dim"].join(" ")} onClick={this.togglePrettyInput} />
      </div>
      {this.state.showPrettyInput ? this.renderPrettyInput(props) : null}
    </div>
  }
  renderPrettyInput(props: IKeyValueInputComponentProps) {
    return <div className="css-property-pretty-input">
    </div>
  }
}

export class CSSStylePaneComponent extends BaseApplicationComponent<ICSSStylePaneComponentProps, any> {

  state = { showPrettyInput: false };


  render() {
    const { setDeclaration, renderTitle, title, style, titleClassName, pretty, overriden, inherited } = this.props;
    const items = [];

    for (const key of style) {
      const value = style[key];
      items.push({ name: kebabCase(key), value: style[key], overriden: overriden && overriden[key], dim: inherited && !isInheritedCSSStyleProperty(key) });
    }

    return <div>
      <div className={["td-section-header", titleClassName].join(" ")}>
        { renderTitle ? renderTitle(this.props) : title }
        <div className="controls">
          <span onClick={() => setDeclaration("", "")}>+</span>
        </div>
      </div>
      { pretty ? <CSSPrettyPaneComponent style={style} /> : <HashInputComponent items={items} setKeyValue={setDeclaration} renderItemComponent={this.renderItem} /> }
    </div>
  }

  renderItem = (props: IKeyValueInputComponentProps) => {
    return <CSSStylePropertyComponent {...props} />;
  }
}

// TODO - add some color for the CSS rules
class MatchedCSSStyleRuleComponent extends BaseApplicationComponent<{ result: MatchedCSSStyleRule, workspace: Workspace }, any> {

  private _highlightedElements: SyntheticDOMElement[];

  setDeclaration = (name: string, value: string, oldName?: string) => {
    this.props.result.rule.style.setProperty(name, value, undefined, oldName);
    const edit = this.props.result.rule.createEdit();
    if (value !== "") {
      edit.setDeclaration(name, value, oldName);
    }
    this.bus.execute(new ApplyFileEditAction(edit.actions));
  }
  render() {
    const { result } = this.props;

    return <CSSStylePaneComponent
    style={result.rule.style}
    inherited={result.inherited}
    titleClassName="color-green-10"
    setDeclaration={this.setDeclaration}
    renderTitle={this.renderTitle}
    overriden={result.overridenStyleProperties}
    />
  }

  onTitleMouseEnter = () => {
    this._highlightedElements = this.props.workspace.document.querySelectorAll(this.props.result.rule.selector);
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
    // this.props.workspace.select(this._highlightedElements);
  }

  renderTitle = () => {
    return <div className="css-pane-title" title={this.props.result.rule.source && this.props.result.rule.source.filePath} onMouseEnter={this.onTitleMouseEnter} onMouseLeave={this.onTitleMouseLeave} onClick={this.onTitleClick}>
      { this.props.result.rule.selector }
    </div>
  }
}

export class ElementCSSPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    if (!this.props.workspace) return null;
    const { selection } = this.props.workspace;

    // CSS Selection pane only works with *one* element.
    if (selection.length !== 1) return null;

    const elements = DOMElements.fromArray(selection);
    return <div className="td-pane">
      { findMatchingStyleRules(elements[0]).map((matchResult, index) => {
        return <MatchedCSSStyleRuleComponent result={matchResult} key={matchResult.rule.uid} workspace={this.props.workspace} />
      }) }
    </div>
  }
}