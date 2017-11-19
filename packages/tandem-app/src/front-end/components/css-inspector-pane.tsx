import * as React from "react";
import { compose, pure } from "recompose";
import {  } from "./pane";
import { TdCssInspectorPaneProps, hydrateTdCssInspectorPane } from "./css-inspector-pane.pc";

import { 
  AppliedCSSRuleResult,
  cssPropNameToKebabCase,
  toggleCSSDeclarationProperty,
  getSyntheticAppliedCSSRules,
  getSyntheticMatchingCSSRules, 
} from "aerial-browser-sandbox";


const enhanceCSSInspectorPane = compose<any, any>(
  pure
);

export const CSSInpectorPane = hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
  TdPane: null,
  TdStyleRule: null,
});

