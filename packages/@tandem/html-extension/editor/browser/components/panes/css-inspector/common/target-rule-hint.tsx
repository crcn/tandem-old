import "./target-rule-hint.scss";
import cx =  require("classnames");
import React =  require("react");
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticCSSElementStyleRule, SyntheticHTMLElement, isInheritedCSSStyleProperty } from "@tandem/synthetic-browser";
import { MergedCSSStyleRule, MatchedCSSStyleRuleType } from "@tandem/html-extension/editor/browser/stores";

export class CSSHighlightTargetRuleHintComponent extends React.Component<{ rule: MergedCSSStyleRule, propertyName: string, block?: boolean }, any> {

  private _focused: boolean;

  get sourceRule() {
    return this.props.rule.getDeclarationMainSourceRule(this.props.propertyName);
  }

  onFocus = () => {
    this._focused = true;
    this.selectProperty();
  }

  componentWillReceiveProps(props) {
    if (this._focused) {
      this.selectProperty();
    }
  }

  selectProperty = () => {
    this.props.rule.selectedStyleProperty = this.props.propertyName || "";
  }


  onBlur = () => {
    this._focused = false;
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
    const pinnedRule = this.props.rule.pinnedRule;
    const hovering = !this._focused && sourceRule && sourceRule.metadata.get(MetadataKeys.HOVERING);
    
    return <div className={cx({ highlight: hovering, "target-rule-hint": true })} onClick={this.selectProperty} onFocus={this.onFocus} onBlur={this.onBlur} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      { pinnedRule && this.props.block && pinnedRule instanceof SyntheticCSSElementStyleRule && !pinnedRule.matchesElement(this.props.rule.target) && !isInheritedCSSStyleProperty(this.props.propertyName) ? this.renderBlocker() : undefined }
      {this.props.children}
    </div>;
  }

  renderBlocker() {
    return <div className="blocker">
    </div>;
  }
}