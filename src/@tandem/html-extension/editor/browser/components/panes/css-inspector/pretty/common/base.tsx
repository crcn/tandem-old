import * as React from "react";
import { ApplyFileEditRequest } from "@tandem/sandbox"
import { BaseApplicationComponent, Mutation } from "@tandem/common";
import { SyntheticHTMLElement, SyntheticCSSElementStyleRule } from "@tandem/synthetic-browser";
import { MergedCSSStyleRule,  } from "@tandem/html-extension/editor/browser/stores";

export abstract class BaseCSSInputComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule, propertyName: string }, any> {

  onChange = (newValue: any) => {
    const { rule, propertyName } = this.props;
    const target = rule.getDeclarationMainSourceRule(propertyName);
    target.style[propertyName] = newValue;
    const mutations: Mutation<any>[] = [];
    if (rule instanceof SyntheticHTMLElement) {
      const edit = rule.createEdit();
      mutations.push(...edit.mutations);
    } else if (rule instanceof SyntheticCSSElementStyleRule) {
      const edit = rule.createEdit();
      edit.setDeclaration(propertyName, newValue);
      mutations.push(...edit.mutations);
    }

    this.bus.dispatch(new ApplyFileEditRequest(mutations));
  }

  render() {
    const { rule, propertyName } = this.props;
    const value = rule.style[propertyName];
    return this.renderInput(value, this.onChange);
  }

  abstract renderInput(value: any, onChange: (newValue) => any);
}