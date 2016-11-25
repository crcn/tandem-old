import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { MergedCSSStyleRule, SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class CSSMergedRuleLinkComponent  extends BaseApplicationComponent<{ rule: MergedCSSStyleRule, propertyName: string }, any> {
  render() {
    const { rule, propertyName, children } = this.props;
    const match = rule.getDeclarationMainSourceRule(propertyName);

    return <SyntheticSourceLink target={match}>
      <span title={match && (match["selector"] || "style attribute")}>{ children || propertyName }</span>
    </SyntheticSourceLink>
  }
}