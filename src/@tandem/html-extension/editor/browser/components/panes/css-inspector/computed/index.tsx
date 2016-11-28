import "./index.scss";
import * as React from"react";
import { HTMLDOMElements } from "@tandem/html-extension/collections";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import {  SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { CSSStyleHashInputComponent, CSSStylePropertyComponent } from "../../css";
import { IKeyValueNameComponentProps, IKeyValueInputComponentProps } from "@tandem/html-extension/editor/browser/components/common";
import { BaseApplicationComponent, Mutation } from "@tandem/common";
import { SyntheticCSSStyleRule, SyntheticHTMLElement} from "@tandem/synthetic-browser";
import { CSSMergedRuleLinkComponent, CSSHighlightTargetRuleHintComponent } from "../common";

import { MergedCSSStyleRule } from "@tandem/html-extension/editor/browser/models";


export class ComputedPropertiesPaneComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {

  setDeclaration = (name: string, value: string, oldName?: string) => {
    const mergedRule = this.props.rule;

    if (value === "") return;

    const main = mergedRule.getDeclarationMainSourceRule(name);
    const mutations: Mutation<any>[] = [];

    if (main instanceof SyntheticCSSStyleRule) {
      const rule = main as SyntheticCSSStyleRule;
      main.style.setProperty(name, value, undefined, oldName);
      const edit = rule.createEdit();
      edit.setDeclaration(name, value, oldName);
      mutations.push(...edit.mutations);
    } else {
      const element = main as SyntheticHTMLElement;
      const edit = element.createEdit();
      element.style[name] = value;
      edit.setAttribute("style", element.getAttribute("style"));
      mutations.push(...edit.mutations);
    }

    this.bus.dispatch(new ApplyFileEditRequest(mutations));
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
      return <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule(props.item.name)}>
        { props.children }
      </CSSHighlightTargetRuleHintComponent>
    }
    
    return <div className="container">
      <div className="section">
        <div className="row title">
          Computed
        </div>
        <CSSStyleHashInputComponent renderName={renderName} renderValue={renderValue} style={rule.style} setDeclaration={this.setDeclaration} />
      </div>
    </div>;
  }
}

