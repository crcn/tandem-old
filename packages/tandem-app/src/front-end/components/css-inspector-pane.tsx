import * as React from "react";
import { compose, pure } from "recompose";
import { TdCssInspectorPaneProps, hydrateTdCssInspectorPane, hydrateTdStyleRule, TdStyleRuleProps } from "./css-inspector-pane.pc";

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
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

const enhanceCSSStyleRule = compose<TdStyleRuleProps, CSSStyleRuleOuterProps>(
  pure,
  (Base: React.ComponentClass<TdCssInspectorPaneProps>) => (props: TdCssInspectorPaneProps) => {
    return <span>A</span>;
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

