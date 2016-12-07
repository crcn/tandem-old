import "./index.scss";
import React = require("react");
import { HTMLDOMElements } from "@tandem/html-extension/collections";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import {  SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { CSSStyleHashInputComponent, CSSStylePropertyComponent } from "../../css";
import { IKeyValueNameComponentProps, IKeyValueInputComponentProps } from "@tandem/html-extension/editor/browser/components/common";
import { BaseApplicationComponent, Mutation } from "@tandem/common";
import { SyntheticCSSElementStyleRule, SyntheticHTMLElement} from "@tandem/synthetic-browser";
import { CSSMergedRuleLinkComponent, CSSHighlightTargetRuleHintComponent } from "../common";

import { MergedCSSStyleRule } from "@tandem/html-extension/editor/browser/stores";


export class ComputedPropertiesPaneComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {

  setDeclaration = (name: string, value: string, oldName?: string) => {
    const mergedRule = this.props.rule;
    
    if (name && value === "") return;

    const main = mergedRule.getDeclarationMainSourceRule(name);
    const mutations: Mutation<any>[] = [];

    this.props.rule.setSelectedStyleProperty(name, value);
  }

  render() {
    const rule = this.props.rule;
    if (!rule) return null;

    const renderName = (props: IKeyValueNameComponentProps) => {
      return <CSSMergedRuleLinkComponent rule={rule} propertyName={props.item.name}>
        { props.children }
      </CSSMergedRuleLinkComponent>
    }

    const renderValue = (props: IKeyValueInputComponentProps) => {
      return <CSSHighlightTargetRuleHintComponent rule={rule} propertyName={props.item.name}>
        { props.children }
      </CSSHighlightTargetRuleHintComponent>
    }
    
    return <div className="container section">
      <div className="row title">
        Computed
      </div>
      <CSSStyleHashInputComponent renderName={renderName} renderValue={renderValue} style={rule.style} setDeclaration={this.setDeclaration} />
    </div>;
  }
}

