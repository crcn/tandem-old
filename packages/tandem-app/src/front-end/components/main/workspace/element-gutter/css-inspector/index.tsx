import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { Pane } from "front-end/components/pane";
import { 
  Workspace,
  SyntheticWindow, 
  SyntheticBrowser, 
  SYNTHETIC_ELEMENT,
  getSyntheticNodeWindow,
  getSyntheticNodeById
} from "front-end/state";
import { getSyntheticMatchingCSSRules, MatchingCSSRuleResult } from "aerial-browser-sandbox";

export type CSSInspectorOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
}

export type MatchingCSSRuleResultProps = {
  matchingRule: MatchingCSSRuleResult;
};

const MatchingCSSRuleResult = ({ matchingRule }: MatchingCSSRuleResultProps) => {
  return <div>
      { matchingRule.rule.selectorText }
  </div>;
}

const CSSInspectorBase = ({ browser, workspace }: CSSInspectorOuterProps) => {
  if (!workspace.selectionRefs.length || workspace.selectionRefs[0][0] !== SYNTHETIC_ELEMENT)  return null;
  const targetElementId = workspace.selectionRefs[0][1];
  const element = getSyntheticNodeById(browser, targetElementId);
  const window = getSyntheticNodeWindow(browser, targetElementId);

  if (!element || !window) {
    return null;
  }

  const rules = getSyntheticMatchingCSSRules(window, targetElementId);

  return <Pane title="CSS">
    {
      rules.map((rule) => {
        return <MatchingCSSRuleResult key={rule.rule.$id}  matchingRule={rule} />
      })
    }
  </Pane>;
};

const enhanceeCSSInspector = compose<CSSInspectorOuterProps, CSSInspectorOuterProps>(pure);

export const CSSInspector = enhanceeCSSInspector(CSSInspectorBase);


