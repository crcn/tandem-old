import * as React from "react";
import { Pane } from "./pane";
import { identity } from "lodash";
import { compose, pure } from "recompose";
import { parseDeclarationValue } from "./utils/css";
import { TdCssInspectorPaneInnerProps, hydrateTdCssInspectorPane, hydrateTdStyleRule, TdStyleRuleInnerProps, TdCssInspectorPaneBaseInnerProps, hydrateCssInspectorMultipleItemsSelected } from "./css-inspector-pane.pc";

import { Dispatcher } from "aerial-common2";
import { SyntheticBrowser, Workspace } from "front-end/state";

import { 
  AppliedCSSRuleResult,
  cssPropNameToKebabCase,
  toggleCSSDeclarationProperty,
  getSyntheticAppliedCSSRules,
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  SyntheticElement,
  SYNTHETIC_ELEMENT,
  getSyntheticMatchingCSSRules, 
} from "aerial-browser-sandbox";

export type CSSInspectorOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export type CSSStyleRuleOuterProps = AppliedCSSRuleResult

const enhanceCSSStyleRule = compose<TdStyleRuleInnerProps, CSSStyleRuleOuterProps>(
  pure,
  (Base: React.ComponentClass<TdStyleRuleInnerProps>) => ({ rule, inherited }: CSSStyleRuleOuterProps) => {
    // const properties = [];
    
    //   const declaration = appliedRule.rule.style;
      
    //   for (let i = 0, n = declaration.length; i < n; i++) {
    //     const name = declaration[i];
    //     const value = declaration[name];
    //     const origValue = appliedRule.rule.style.disabledPropertyNames && appliedRule.rule.style.disabledPropertyNames[name];
    //     const disabled = Boolean(origValue);
    //     const ignored = Boolean(appliedRule.ignoredPropertyNames && appliedRule.ignoredPropertyNames[name]);
    //     const overridden = Boolean(appliedRule.overriddenPropertyNames && appliedRule.overriddenPropertyNames[name]);
    
    //     properties.push(
    //       <StyleProperty onValueBlur={onValueBlur} windowId={window.$id} key={name} name={name} value={value} dispatch={dispatch} declarationId={appliedRule.rule.style.$id} ignored={ignored} disabled={disabled} overridden={overridden} origValue={origValue} />
    //     );
    //   }
    // console.log(inherited);
    // return <span>RULE</span>;/
    // return <Base declarations={rule.style} />;
    // return <Base selectorText=".test" />;

    return <Base selectorText={rule.selectorText} source={null} declarations={[]} />;
  }
);

const CSSStyleRule = hydrateTdStyleRule(enhanceCSSStyleRule, {
  TdGutterSubheader: null,
  TdStyleDeclaration: null,
  TdList: null,
  TdListItem: null
});

const CSSPaneMultipleSelectedError = hydrateCssInspectorMultipleItemsSelected(identity, {
  TdPane: Pane,
});

const enhanceCSSInspectorPane = compose<TdCssInspectorPaneInnerProps, CSSInspectorOuterProps>(
  pure,
  (Base: React.ComponentClass<TdCssInspectorPaneInnerProps>) => ({ workspace, browser }: CSSInspectorOuterProps) => {

    const selectedElementRefs = workspace.selectionRefs.filter(([type]) => type === SYNTHETIC_ELEMENT);

    if (!selectedElementRefs.length) {
      return null;
    }

    if (selectedElementRefs.length > 1) {
      return <CSSPaneMultipleSelectedError />;
    }

    const [type, targetElementId] = selectedElementRefs[0];
    

    const element = getSyntheticNodeById(browser, targetElementId) as SyntheticElement;
    const window = getSyntheticNodeWindow(browser, targetElementId);
    if (!element || !window) {
      return null;
    }
  

    const rules = getSyntheticAppliedCSSRules(window, targetElementId);

    return <Base styleRules={rules} />;
  }
);

export const CSSInpectorPane = hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
  TdPane: Pane,
  TdStyleRule: CSSStyleRule
});

