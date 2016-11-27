import * as React from "react";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticCSSStyleRule, SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class CSSHighlightTargetRuleHintComponent extends React.Component<{ target: SyntheticCSSStyleRule|SyntheticHTMLElement }, any> {

  onFocus = () => {
    this.props.target.style.metadata.set(MetadataKeys.HOVERING, true);
  }

  onBlur = () => {
    this.props.target.style.metadata.set(MetadataKeys.HOVERING, false);
  }

  render() {
    return <div onFocus={this.onFocus} onBlur={this.onBlur}>
      {this.props.children}
    </div>;
  }
}