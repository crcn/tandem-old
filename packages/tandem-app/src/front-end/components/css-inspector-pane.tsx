import * as React from "react";
import { compose, pure } from "recompose";
import { TdCssInspectorPaneInnerProps, hydrateTdCssInspectorPane, hydrateTdStyleRule, TdStyleRuleInnerProps } from "./css-inspector-pane.pc";

import { Dispatcher } from "aerial-common2";
import { SyntheticBrowser, Workspace } from "front-end/state";

import { 
  AppliedCSSRuleResult,
  cssPropNameToKebabCase,
  toggleCSSDeclarationProperty,
  getSyntheticAppliedCSSRules,
  getSyntheticMatchingCSSRules, 
} from "aerial-browser-sandbox";

export type CSSInspectorOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export type CSSStyleRuleOuterProps = {
  styleRule: any;
};

const enhanceCSSStyleRule = compose<TdStyleRuleInnerProps, CSSStyleRuleOuterProps>(
  pure,
  (Base: React.ComponentClass<TdStyleRuleInnerProps>) => (props: CSSStyleRuleOuterProps) => {
    return null;
    // return <Base selectorText=".test" />;
  }
);

const CSSStyleRule = hydrateTdStyleRule(enhanceCSSStyleRule, {
  TdGutterSubheader: null,
  TdStyleDeclaration: null,
  TdList: null,
  TdListItem: null
});

const enhanceCSSInspectorPane = compose<any, any>(
  pure,
  (Base) => (props) => {
    return <Base />;
  }
);

export const CSSInpectorPane = hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
  TdPane: null,
  TdStyleRule: CSSStyleRule 
});

