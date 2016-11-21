import "./index.scss";


import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { kebabCase, camelCase } from "lodash";
import { CallbackDispatcher } from "@tandem/mesh";
import { CSSPrettyPaneComponent } from "./pretty";
import { BaseApplicationComponent, Action } from "@tandem/common";
import { cssTokenizer } from "@tandem/html-extension/tokenizers";
import { DOMElements, MatchedStyleRule } from "@tandem/html-extension/collections";
import { GutterComponent, SyntheticSourceLink } from "@tandem/editor/browser/components";
import { HashInputComponent, KeyValueInputComponent, IKeyValueInputComponentProps } from "@tandem/html-extension/editor/browser/components/common";
import {
  MatchedCSSStyleRule,
  SyntheticDOMElement,
  isDOMMutationEvent,
  SyntheticCSSStyleRule,
  getMatchingStyleRules,
  isInheritedCSSStyleProperty,
  SyntheticCSSStyleDeclaration,
  CSSDeclarationValueChangeEvent,
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
        <KeyValueInputComponent {...props} style={props.item["dim"] ? { opacity: 0.4 } : {}} />
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
      <div className={["header", titleClassName].join(" ")}>
        { renderTitle ? renderTitle(this.props) : title }
        <div className="controls">
          <span onClick={() => setDeclaration("", "")}>+</span>
        </div>
      </div>
      { pretty ? <CSSPrettyPaneComponent style={style} /> : <HashInputComponent items={items} setKeyValue={setDeclaration} valueTokenizer={cssTokenizer} renderItemComponent={this.renderItem} /> }
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
    this.bus.dispatch(new ApplyFileEditRequest(edit.changes));
  }
  render() {
    const { result } = this.props;

    return <CSSStylePaneComponent
    style={result.rule.style}
    inherited={result.inherited}
    titleClassName="entity css selector"
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
      <SyntheticSourceLink target={this.props.result.rule}>{ this.props.result.rule.selector }</SyntheticSourceLink>
    </div>
  }
}

export class ElementCSSPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  private _rulesWatcher: MatchedCSSRulesCache;
  componentWillUnmount() {
    if (this._rulesWatcher) this._rulesWatcher.target = undefined;
  }
  render() {
    if (!this.props.workspace) return null;
    const { selection } = this.props.workspace;

    if (!this._rulesWatcher) {
      this._rulesWatcher = new MatchedCSSRulesCache();
    }

    // CSS Selection pane only works with *one* element.
    if (selection.length !== 1) return null;

    const elements = DOMElements.fromArray(selection);
    if (!elements.length) return null;
    this._rulesWatcher.target = elements[0];

    return <div className="td-pane">
      { this._rulesWatcher.rules.map((matchResult, index) => {
        return <MatchedCSSStyleRuleComponent result={matchResult} key={index} workspace={this.props.workspace} />
      }) }
    </div>
  }
}

class MatchedCSSRulesCache {
  private _target: SyntheticDOMElement;
  private _matchedRules: MatchedCSSStyleRule[];
  private _documentObserver: CallbackDispatcher<any, any>;
  constructor() {
    this._documentObserver = new CallbackDispatcher(this.onDocumentEvent.bind(this));
  }

  set target(value: SyntheticDOMElement){
    if (this._target === value) return;
    if (this._target) {
      this._target.ownerDocument.unobserve(this._documentObserver);
    }
    this._target = value;
    this.matchRules();
    this._target.ownerDocument.observe(this._documentObserver);
  }
  get target(): SyntheticDOMElement {
    return this._target;
  }

  get rules(): MatchedCSSStyleRule[] {
    return this._matchedRules;
  }

  private matchRules() {
    this._matchedRules = getMatchingStyleRules(this._target);
  }

  private onDocumentEvent(event: Action) {
    if (!isDOMMutationEvent(event) || event.type === CSSDeclarationValueChangeEvent.CSS_DECLARATION_VALUE_CHANGE) return;
    this.matchRules();
  }
}