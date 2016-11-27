import * as React from "react";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticCSSStyleRule, SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class CSSHighlightTargetRuleHintComponent extends React.Component<{ target: SyntheticCSSStyleRule|SyntheticHTMLElement }, any> {

  private _focused: boolean;

  onFocus = () => {
    this.props.target.style.metadata.set(MetadataKeys.HOVERING, this._focused = true);
  }

  onBlur = () => {
    this.props.target.style.metadata.set(MetadataKeys.HOVERING, this._focused = false);
  }

  onMouseEnter = () => {
    if (this._focused) return;
    this.props.target.style.metadata.set(MetadataKeys.HOVERING, true);

  }

  onMouseLeave = () => {
    if (this._focused) return;
    this.props.target.style.metadata.set(MetadataKeys.HOVERING, false);
  }

  render() {
    return <div onFocus={this.onFocus} onBlur={this.onBlur} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      {this.props.children}
    </div>;
  }
}