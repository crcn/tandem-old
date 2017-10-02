// TODOS:
// - [ ] Tokenize declaration value to include BG colors and interactive props
// - [ ] highlight elements in stage when hovering over selectors
// - [ ] react dnd properties
// - [ ] autocomplete for css props
// - [ ] autocomplete value props based on name
// - [ ] warning when css properties are not applied (possibly use renderer)
// - [ ] autocomplete fonts (native vs loaded separators)
// - [ ] media props

import "./index.scss";
import * as cx from "classnames";
import { Pane } from "front-end/components/pane";
import * as React from "react";
import { Autofocus } from "front-end/components/autofocus";
import { mapValues } from "lodash";
import { wrapEventToDispatch, Dispatcher } from "aerial-common2";
import { pure, compose, withHandlers, withState } from "recompose";

import { 
  cssDeclarationNameChanged, 
  cssDeclarationValueChanged, 
  cssDeclarationCreated,
  cssDeclarationTitleMouseEnter,
  cssDeclarationTitleMouseLeave,
} from "front-end/actions";

import { 
  Workspace,
  SyntheticWindow, 
  SyntheticBrowser, 
  SYNTHETIC_ELEMENT,
  getSyntheticNodeWindow,
  getSyntheticNodeById,
} from "front-end/state";

import { 
  AppliedCSSRuleResult,
  cssPropNameToKebabCase,
  toggleCSSDeclarationProperty,
  getSyntheticAppliedCSSRules,
  getSyntheticMatchingCSSRules, 
} from "aerial-browser-sandbox";

const MIN_INPUT_WIDTH = 50;
const CHAR_WIDTH = 8;

export type CSSInspectorOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export type AppliedCSSRuleResultOuterProps = {
  window: SyntheticWindow;
  appliedRule: AppliedCSSRuleResult;
  dispatch: Dispatcher<any>;
};

type AppliedCSSRuleResultInnerProps = {
  onAddDeclaration?: () => any;
  showNewDeclarationInput: boolean;
  onValueBlur: (name: string, value: string) => any;
  onDeclarationCreated: (name: string, value: string) => any;
  setShowNewDeclarationInput: (value) => any;
  onTitleMouseEnter: () => any;
  onTitleMouseLeave: () => any;
} & AppliedCSSRuleResultOuterProps;

export type StylePropertyInnerProps = {
  windowId: string;
  origValue?: string;
  declarationId: string;
  disabled?: boolean;
  focusNameInput?: boolean;
  ignored?: boolean;
  overridden?: boolean;
  name: string;
  value: string;
  onValueBlur: (name: string, value: string) => any;
  dispatch: Dispatcher<any>;
  onValueChange?: (value: string) => any;
  onNameChange?: (value: string) => any;
};

export type NewStylePropertyOuterProps = {
  windowId: string;
  origValue?: string;
  disabled?: boolean;
  focusNameInput?: boolean;
  ignored?: boolean;
  onValueBlur: (name: string, value: string) => any;
  overridden?: boolean;
  onCreated: (name: string, value: string) => any;
};

type TextInputOuterProps = {
  value: string;
  children: any;
  autoFocus?: boolean;
  className?: string;
  syncOnKeypress?: boolean;
  placeholder?: string;
  onChange?: (value: string) => any;
  onFinished?: () => any;
};

type TextInputInnerProps = {
  value: string;
  children: any;
  className?: string;
  onClick?: () => any;
  onFocus?: () => any;
  onBlur?: (event: any) => any;
  onKeyPress?: () => any;
  showInput?: boolean;
} & TextInputOuterProps;

const beautifyLabel = (label: string) => {
return label.replace(/\s*,\s*/g, ", ");
}

const TextInputBase = ({ autoFocus = false, value, children, showInput, className, placeholder, onClick, onFocus, onBlur, onKeyPress }: TextInputInnerProps) => {
  return <Autofocus focus={autoFocus}><span className={className} tabIndex={0} onFocus={onFocus} onClick={onClick}>
    { showInput ? <Autofocus><input style={{ width: value ? value.length * CHAR_WIDTH : MIN_INPUT_WIDTH }} defaultValue={value} onFocus={onFocus} placeholder={placeholder} onBlur={onBlur} onKeyPress={onKeyPress} /></Autofocus> : children }
  </span></Autofocus>
};

export const enhanceTextInput = compose<TextInputOuterProps, TextInputInnerProps>(
  pure,
  withState("showInput", "setShowInput", false),
  withHandlers({
    onClick: ({ setShowInput }) => (event: React.MouseEvent<any>) => {
      setShowInput(true);
    },
    onFocus: ({ setShowInput }) => (event: React.FocusEvent<any>) => {
      if ((event.target as HTMLInputElement).tagName === "INPUT") {
        (event.target as HTMLInputElement).select();
      } 
      setShowInput(true);
    },
    onBlur: ({ setShowInput, onChange, onBlur, onFinished }) => (event: React.FocusEvent<any>) => {
      setShowInput(false);
      if (onChange) {
        onChange((event.target as HTMLInputElement).value);
      }

      if (onBlur) {
        onBlur(event);
        if (onFinished) {
          onFinished();
        }
      }
    },
    onKeyPress: ({ setShowInput, onChange, onFinished, syncOnKeypress }) => (event: React.KeyboardEvent<any>) => {

      const entered = event.key === "Enter";
      if (syncOnKeypress || entered) {
        if (onChange) {
          onChange((event.target as HTMLInputElement).value);
        }

        if (entered) {
          setShowInput(false);
          if (onFinished) {
            onFinished();
          }
        }
      }
    }
  })
);

const TextInput = enhanceTextInput(TextInputBase);

const StylePropertyBase = ({ windowId, declarationId, name, value, dispatch, disabled, focusNameInput, overridden, ignored, origValue, onValueChange, onNameChange, onValueBlur }: StylePropertyInnerProps) => {
  return <div className={cx("property", { disabled, ignored, overridden })}>
    <span className="name">
      <TextInput value={name} onChange={onNameChange} autoFocus={focusNameInput}>
        {cssPropNameToKebabCase(name)}
      </TextInput>
      :
    </span>
    
    <TextInput className="value" value={value || origValue} onChange={onValueChange} onBlur={onValueBlur ? (event) => onValueBlur(name, event.target.value) : null}>
      {value || origValue}
    </TextInput>
    <div className="controls">
      <i className={cx({ "ion-eye-disabled": disabled, "ion-eye": !disabled })} onClick={wrapEventToDispatch(dispatch, () => toggleCSSDeclarationProperty(name, declarationId, windowId))} />
    </div>
  </div>;
};

const StyleProperty = compose<StylePropertyInnerProps, StylePropertyInnerProps>(
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

const NewStyleProperty = compose<StylePropertyInnerProps, NewStylePropertyOuterProps>(
  pure,
  withState("name", "setName", null),
  withHandlers({
    onNameChange: ({ setName, onCreated }) => (value: string) => {
      setName(value);
      if (!value) {
        onCreated(null, null);
      }
    },
    onValueChange: ({ name, windowId, dispatch, onCreated }) => (value: string) => {
      onCreated(name, value);
    }
  })
)(StylePropertyBase);

const AppliedCSSRuleInfoBase = ({ 
  window, 
  dispatch,
  appliedRule, 
  onValueBlur, 
  onAddDeclaration, 
  onDeclarationCreated, 
  showNewDeclarationInput, 
  onTitleMouseEnter,
  onTitleMouseLeave
}: AppliedCSSRuleResultInnerProps) => {

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
      <StyleProperty onValueBlur={onValueBlur} windowId={window.$id} key={name} name={name} value={value} dispatch={dispatch} declarationId={appliedRule.rule.style.$id} ignored={ignored} disabled={disabled} overridden={overridden} origValue={origValue} />
    );
  }

  if (showNewDeclarationInput) {
    properties.push(
      <NewStyleProperty focusNameInput={true} windowId={window.$id} key={properties.length} onCreated={onDeclarationCreated} onValueBlur={onValueBlur} />
    );
  }

  return <div className="style-rule-info">
      <div className="title" onMouseEnter={onTitleMouseEnter} onMouseLeave={onTitleMouseLeave}>
        { beautifyLabel(appliedRule.rule.label || appliedRule.rule.selectorText) }
        <i className="ion-plus add-declaration-button" onClick={onAddDeclaration} />
        <i className="ion-star" />
        { appliedRule.inherited ? <span className="inherited">Inherited</span> : null }
      </div>
      <div className="declaration">
        { properties }
      </div>
  </div>;
};

const AppliedCSSRuleInfo = compose<AppliedCSSRuleResultInnerProps, AppliedCSSRuleResultOuterProps>(
  pure,
  withState("showNewDeclarationInput", "setShowNewDeclarationInput", false),
  withHandlers({
    onAddDeclaration: ({ setShowNewDeclarationInput }) => () => {
      setShowNewDeclarationInput(true);
    },
    onDeclarationCreated: ({ setShowNewDeclarationInput, dispatch, window, appliedRule }: AppliedCSSRuleResultInnerProps) => (name: string, value: string) => {
      setShowNewDeclarationInput(false);
      if (value) {
        dispatch(cssDeclarationCreated(name, value, appliedRule.rule.style.$id, window.$id));
      }
    },
    onValueBlur: ({ appliedRule, showNewDeclarationInput, setShowNewDeclarationInput }) => (name: string, value: string) => {
      const lastPropName = appliedRule.rule.style[appliedRule.rule.style.length - 1];
      if ((lastPropName === name || !appliedRule.rule.style[name]) && name && value) {
        setShowNewDeclarationInput(true);
      }
    },
    onTitleMouseEnter: ({ dispatch, appliedRule, window }) => () => {
      if (appliedRule.rule.selectorText) {
        dispatch(cssDeclarationTitleMouseEnter(appliedRule.rule.$id, window.$id));
      }
    },
    onTitleMouseLeave: ({ dispatch, appliedRule, window }) => () => {
      if (appliedRule.rule.selectorText) {
        dispatch(cssDeclarationTitleMouseLeave(appliedRule.rule.$id, window.$id));
      }
    }
  })
)(AppliedCSSRuleInfoBase);

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

const enhanceCSSInspector = compose<CSSInspectorOuterProps, CSSInspectorOuterProps>(
  pure
);

export const CSSInspector = enhanceCSSInspector(CSSInspectorBase);
