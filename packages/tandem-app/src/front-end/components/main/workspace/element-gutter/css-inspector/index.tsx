import "./index.scss";
import * as React from "react";
import { mapValues } from "lodash";
import { wrapEventToDispatch, Dispatcher } from "aerial-common2";
import { pure, compose, withHandlers } from "recompose";
import * as cx from "classnames";
import { Pane } from "front-end/components/pane";
import { 
  Workspace,
  SyntheticWindow, 
  SyntheticBrowser, 
  SYNTHETIC_ELEMENT,
  getSyntheticNodeWindow,
  getSyntheticNodeById
} from "front-end/state";

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

export type AppliedCSSRuleResultProps = {
  window: SyntheticWindow;
  appliedRule: AppliedCSSRuleResult;
  dispatch: Dispatcher<any>;
};

export type StylePropertyOuterProps = {
  appliedRule: AppliedCSSRuleResult;
  windowId: string;
  origValue: string;
  declarationId: string;
  disabled: boolean;
  ignored: boolean;
  overridden: boolean;
  name: string;
  value: string;
  dispatch: Dispatcher<any>;
};

const StylePropertyBase = ({ windowId, declarationId, name, value, dispatch, disabled, overridden, ignored, origValue }: StylePropertyOuterProps) => {

  return <div className={cx("property", { disabled, ignored, overridden })}>
      <div className="name">
        {cssPropNameToKebabCase(name)}:
      </div>
      <div className="value">
        {value || origValue}
      </div>
      <div className="controls">
        <i className={cx({ "ion-eye-disabled": disabled, "ion-eye": !disabled })} onClick={wrapEventToDispatch(dispatch, () => toggleCSSDeclarationProperty(name, declarationId, windowId))} />
      </div>
  </div>;
};

const StyleProperty = compose<StylePropertyOuterProps, StylePropertyOuterProps>(pure)(StylePropertyBase);

const AppliedCSSRuleInfo = ({ window, appliedRule, dispatch }: AppliedCSSRuleResultProps) => {

  const properties = [];

  const declaration = appliedRule.rule.style;
  
  for (let i = 0, n = declaration.length; i < n; i++) {
    const name = declaration[i];
    const value = declaration[name];
    const origValue = appliedRule.rule.style.disabledPropertyNames && appliedRule.rule.style.disabledPropertyNames[name];
    const disabled = Boolean(origValue);
    const ignored = Boolean(appliedRule.ignoredPropertyNames && appliedRule.ignoredPropertyNames[name]);
    const overridden = Boolean(appliedRule.overriddenPropertyNames && appliedRule.overriddenPropertyNames[name]);

    properties.push(
      <StyleProperty windowId={window.$id} key={name} name={name} value={value} appliedRule={appliedRule} dispatch={dispatch} declarationId={appliedRule.rule.style.$id} ignored={ignored} disabled={disabled} overridden={disabled} origValue={origValue} />
    );
  }

  return <div className="style-rule-info">
      <div className="title">
        { appliedRule.rule.selectorText }
        { appliedRule.inherited ? <span className="inherited">Inherited</span> : null }
      </div>
      <div className="declaration">
        { properties }
      </div>
  </div>;
};


const CSSInspectorBase = ({ browser, workspace, dispatch }: CSSInspectorOuterProps) => {
  if (!workspace.selectionRefs.length || workspace.selectionRefs[0][0] !== SYNTHETIC_ELEMENT)  return null;
  const targetElementId = workspace.selectionRefs[0][1];
  const element = getSyntheticNodeById(browser, targetElementId);
  const window = getSyntheticNodeWindow(browser, targetElementId);

  if (!element || !window) {
    return null;
  }

  const rules = getSyntheticAppliedCSSRules(window, targetElementId);

  return <Pane title="CSS" className="m-css-inspector">
    {
      rules.map((rule) => {
        return <AppliedCSSRuleInfo window={window} key={rule.rule.$id}  appliedRule={rule} dispatch={dispatch} />
      })
    }
  </Pane>;
};

const enhanceeCSSInspector = compose<CSSInspectorOuterProps, CSSInspectorOuterProps>(pure);

export const CSSInspector = enhanceeCSSInspector(CSSInspectorBase);


