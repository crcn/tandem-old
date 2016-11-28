import "./target-rule-hint.scss";
import * as cx from "classnames";
import * as React from "react";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticCSSStyleRule, SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class CSSHighlightTargetRuleHintComponent extends React.Component<{ target: SyntheticCSSStyleRule|SyntheticHTMLElement }, any> {

  private _focused: boolean;
  private _entered: boolean;

  onFocus = () => {
    this._entered = true;
    this.props.target.metadata.set(MetadataKeys.REVEAL, this._focused = true);
  }

  onBlur = () => {
    this._entered = false;
    this.props.target.metadata.set(MetadataKeys.REVEAL, this._focused = false);
  }

  onMouseEnter = () => {
    if (this._focused) return;
    this._entered = true;
    this.props.target.metadata.set(MetadataKeys.REVEAL, true);

  }

  onMouseLeave = () => {
    if (this._focused) return;
    this._entered = false;
    this.props.target.metadata.set(MetadataKeys.REVEAL, false);
  }

  render() {
    const hovering = !this._entered && this.props.target && this.props.target.metadata.get(MetadataKeys.HOVERING);
    return <div className={cx({ highlight: hovering, "target-rule-hint": true })} onFocus={this.onFocus} onBlur={this.onBlur} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      {this.props.children}
    </div>;
  }
}