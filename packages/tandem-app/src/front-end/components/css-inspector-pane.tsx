import * as React from "react";
import { compose } from "recompose";
let components: any = {};
// import { components } from "./css-inspector-pane.pc";


import { 
  AppliedCSSRuleResult,
  cssPropNameToKebabCase,
  toggleCSSDeclarationProperty,
  getSyntheticAppliedCSSRules,
  getSyntheticMatchingCSSRules, 
} from "aerial-browser-sandbox";

export const CSSInpectorPane = () => {
  return <components.tdCssInspectorPane />;
}

