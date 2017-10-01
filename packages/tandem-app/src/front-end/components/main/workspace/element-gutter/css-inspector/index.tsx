import "./index.scss";
import * as React from "react";
import { mapValues } from "lodash";
import { wrapEventToDispatch, Dispatcher } from "aerial-common2";
import { pure, compose, withHandlers, withState } from "recompose";
import * as cx from "classnames";
import { Pane } from "front-end/components/pane";
import { Autofocus } from "front-end/components/autofocus";
import { cssDeclarationNameChanged, cssDeclarationValueChanged } from "front-end/actions";
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
  onValueChange?: (value: string) => any;
  onNameChange?: (value: string) => any;
};

type TextInputOuterProps = {
  value: string;
  children: any;
  className?: string;
  onChange?: (value: string) => any;
};

type TextInputInnerProps = {
  value: string;
  children: any;
  className?: string;
  onClick?: () => any;
  onFocus?: () => any;
  onBlur?: () => any;
  onKeyPress?: () => any;
  showInput?: boolean;
} & TextInputOuterProps;

const TextInputBase = ({ value, children, showInput, className, onClick, onFocus, onBlur, onKeyPress }: TextInputInnerProps) => {
  return <div className={className} tabIndex={-1} onClick={onClick}>
    { showInput ? <Autofocus><input defaultValue={value} onFocus={onFocus} onBlur={onBlur} onKeyPress={onKeyPress} /></Autofocus> : children }
  </div>;
};

export const enhanceTextInput = compose<TextInputOuterProps, TextInputInnerProps>(
  pure,
  withState("showInput", "setShowInput", false),
  withHandlers({
    onClick: ({ setShowInput }) => (event: React.MouseEvent<any>) => {
      setShowInput(true);
    },
    onFocus: ({ setShowInput }) => (event: React.FocusEvent<any>) => {
      (event.target as HTMLInputElement).select();
    },
    onBlur: ({ setShowInput }) => () => {
      setShowInput(false);
    },
    onKeyPress: ({ setShowInput, onChange }) => (event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter") {
        if (onChange) {
          onChange((event.target as HTMLInputElement).value);
        }
        setShowInput(false);
      }
    }
  })
);

const TextInput = enhanceTextInput(TextInputBase);

const StylePropertyBase = ({ windowId, declarationId, name, value, dispatch, disabled, overridden, ignored, origValue, onValueChange, onNameChange }: StylePropertyOuterProps) => {
  return <div className={cx("property", { disabled, ignored, overridden })}>
      <TextInput className="name" value={name} onChange={onNameChange}>
        {cssPropNameToKebabCase(name)}:
      </TextInput>
      
      <TextInput className="value" value={value || origValue} onChange={onValueChange}>
        {value || origValue}
      </TextInput>
      <div className="controls">
        <i className={cx({ "ion-eye-disabled": disabled, "ion-eye": !disabled })} onClick={wrapEventToDispatch(dispatch, () => toggleCSSDeclarationProperty(name, declarationId, windowId))} />
      </div>
  </div>;
};

const StyleProperty = compose<StylePropertyOuterProps, StylePropertyOuterProps>(
  pure,
  withHandlers({
    onNameChange: ({ name, windowId, declarationId, dispatch }) => (value: string) => {
      dispatch(cssDeclarationNameChanged(name, value, declarationId, windowId));
    },
    onValueChange: ({ name, windowId, declarationId, dispatch }) => (value: string) => {
      dispatch(cssDeclarationValueChanged(name, value, declarationId, windowId));
    }
  })
)(StylePropertyBase);

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


