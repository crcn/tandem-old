import "./target-rule-hint.scss";
import * as cx from "classnames";
import * as React from "react";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticCSSStyleRule, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { MergedCSSStyleRule  } from "@tandem/html-extension/editor/browser/models";

export class CSSHighlightTargetRuleHintComponent extends React.Component<{ rule: MergedCSSStyleRule, propertyName: string }, any> {

  private _focused: boolean;
  private _entered: boolean;

  get sourceRule() {
    return this.props.rule.getDeclarationMainSourceRule(this.props.propertyName);
  }

  onFocus = () => {
    this._entered = true;
    this.props.rule.selectedStyleProperty = this.props.propertyName;
  }

  onBlur = () => {
    this._entered = false;
    this.props.rule.selectedStyleProperty = undefined;
  }

  onMouseEnter = () => {
    const sourceRule = this.sourceRule;
    if (sourceRule) sourceRule.metadata.set(MetadataKeys.REVEAL, true);
  }

  onMouseLeave = () => {
    const sourceRule = this.sourceRule;
    if (sourceRule) sourceRule.metadata.set(MetadataKeys.REVEAL, false);
  }

  render() {
    const sourceRule = this.sourceRule;
    const hovering = !this._entered && sourceRule && sourceRule.metadata.get(MetadataKeys.HOVERING);
    return <div className={cx({ highlight: hovering, "target-rule-hint": true })} onFocus={this.onFocus} onBlur={this.onBlur} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      {this.props.children}
    </div>;
  }
}