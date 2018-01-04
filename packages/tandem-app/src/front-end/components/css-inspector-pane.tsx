import * as React from "react";
import { Pane } from "./pane";
import { identity } from "lodash";
import { compose, pure, withHandlers, withState, withProps, mapProps } from "recompose";
import { weakMemo } from "aerial-common2";
import { Autofocus } from "./autofocus";
import { parseDeclaration, stringifyDeclarationAST, DcCall } from "paperclip";
import { hydrateTdCssExprInput, hydrateTdCssCallExprInput, TdCssExprInputInnerProps, TdCssCallExprInputInnerProps, hydrateTdCssSpacedListExprInput, hydrateTdCssCommaListExprInput, TdCssColorExprInputInnerProps, hydrateTdCssColorExprInput, TdCssKeywordExprInputInnerProps, hydrateTdCssKeywordExprInput, hydrateTdCssNumberExprInput, TdCssNumberExprInputInnerProps, hydrateTdCssMeasurementInput, TdCssMeasurementInputInnerProps } from "./css-declaration-input.pc";
import { TdCssInspectorPaneInnerProps, hydrateTdCssInspectorPane, hydrateTdStyleRule, TdStyleRuleInnerProps, hydrateCssInspectorMultipleItemsSelected, hydrateTdStyleDeclaration, TdStyleDeclarationInnerProps } from "./css-inspector-pane.pc";

import { Dispatcher } from "aerial-common2";
import { cssToggleDeclarationEyeClicked, cssDeclarationNameChanged, cssDeclarationValueChanged } from "front-end/actions";
import { Workspace, getNodeArtboard, DisabledStyleDeclarations, Artboard } from "front-end/state";

import { getSyntheticAppliedCSSRules, getSyntheticMatchingCSSRules, AppliedCSSRuleResult, SlimVMObjectType, isValidStyleDeclarationName, SlimElement, SlimCSSStyleRule, getStyleOwnerFromScopeInfo, getStyleOwnerScopeInfo } from "slim-dom";

type StyleDelarationOuterProps = {
  index: number;
  isNewDeclaration?: boolean;
  onDeclarationBlur?: () => any;
  onNameChange: (oldName: string, newName: string) => any;
  onValueChange: (name: string, value: string) => any;
  artboardId: string;
  owner: SlimCSSStyleRule | SlimElement;
  name: string;
  ignored: boolean;
  disabled: boolean;
  overridden: boolean;
  value: string;
  dispatch: any;
};

type StyleDelarationInnerProps = {
  onToggleDeclarationClick: () => any;
  // setNewName: (value: string) => any;
  // setNewValue: (value: string) => any;
  setEditingName: (value: boolean) => any;
  setEditingValue: (value: boolean) => any;
  onNameInputBlur: (event: any) => any;
  onValueInputBlur: (event: any) => any;
} & TdStyleDeclarationInnerProps;


const enhanceCssCallExprInput = compose<TdCssCallExprInputInnerProps, TdCssCallExprInputInnerProps>(
  pure,
  (Base: React.ComponentClass<TdCssCallExprInputInnerProps>) => ({ name, params, ...rest }: (DcCall & TdCssCallExprInputInnerProps)) => {
    
    let returnType;
    let returnValue = stringifyDeclarationAST({
      name,
      params,
      ...rest
    } as DcCall);

    switch(name) {
      case "rgb":
      case "rgba": {
        returnType = "COLOR";
        break;
      }
    }

    return <Base name={name} params={params} returnValue={returnValue} returnType={returnType} {...rest} />;
  }
);

const CssCallExprInput = hydrateTdCssCallExprInput(enhanceCssCallExprInput, {
  TdColorMiniInput: null,
  TdCssExprInput: (props) => {
    return <CSSExprInput {...props} />
  }
});


const enhanceCssNumberInput = compose<TdCssNumberExprInputInnerProps, TdCssNumberExprInputInnerProps>(
  pure
);

const CssNumberInput = hydrateTdCssNumberExprInput(enhanceCssNumberInput, {
});


const enhanceCssMeasurementInput = compose<TdCssMeasurementInputInnerProps, TdCssMeasurementInputInnerProps>(
  pure
);

const CssMeasurementInput = hydrateTdCssMeasurementInput(enhanceCssMeasurementInput, {
});

const enhanceCssKeywordInput = compose<TdCssKeywordExprInputInnerProps, TdCssKeywordExprInputInnerProps>(
  pure
);

const CssKeywordInput = hydrateTdCssKeywordExprInput(enhanceCssKeywordInput, {
});

const enhanceCssColorInput = compose<TdCssColorExprInputInnerProps, TdCssColorExprInputInnerProps>(
  pure
);

const CssColorInput = hydrateTdCssColorExprInput(enhanceCssColorInput, {
  TdColorMiniInput: null
})

const enhanceCSSCallExprInput = compose<TdCssExprInputInnerProps, TdCssExprInputInnerProps>(
  pure
);

const enhanceCSSSpaced = compose<any, any>(
  pure
);

const CssSpacedList = hydrateTdCssSpacedListExprInput(enhanceCSSSpaced, {
  TdCssExprInput: (props) => <CSSExprInput {...props} />
});

const CssCommaList = hydrateTdCssCommaListExprInput(enhanceCSSSpaced, {
  TdCssExprInput: (props) => <CSSExprInput {...props} />
});

const CSSExprInput = hydrateTdCssExprInput(enhanceCSSCallExprInput, {
  TdCssCallExprInput: CssCallExprInput,
  TdCssColorExprInput: CssColorInput,
  TdCssCommaListExprInput: CssCommaList,
  TdCssKeywordExprInput: CssKeywordInput,
  TdCssMeasurementInput: CssMeasurementInput,
  TdCssNumberExprInput: CssNumberInput,
  TdCssSpacedListExprInput: CssSpacedList
});

const enhanceCSSStyleDeclaration = compose<StyleDelarationInnerProps, StyleDelarationOuterProps>(
  pure,
  withState(`editingName`, `setEditingName`, undefined),
  withState(`editingValue`, `setEditingValue`, undefined),
  withState(`newName`, `setNewName`, undefined),
  withState(`newValue`, `setNewValue`, undefined),
  withHandlers({
    onToggleDeclarationClick: ({ index, artboardId, owner, dispatch, name }: StyleDelarationInnerProps) => (event) => {
      dispatch(cssToggleDeclarationEyeClicked(artboardId, owner.id, name, index));
    },
    onNameInputKeyDown: ({ setEditingName, onNameChange, onDeclarationBlur })  => (event) => {
      if (event.key === "Enter") {
        setEditingName(false);
        if (event.target.value !== name) {
          onNameChange(name, event.target.value);
        }
      } else if (event.key === "Tab" && onDeclarationBlur && !event.target.value) {
        onDeclarationBlur(event);
      }
    },
    onValueInputKeyDown: ({ setEditingValue, value, name, onValueChange, onDeclarationBlur }) => (event: React.KeyboardEvent<any>) => {
      const target = event.target as any;
      if (event.key === "Enter") {
        setEditingValue(false);
        if (target.value !== value) {
          onValueChange(name, target.value);
        }
      } else if (event.key === "Tab" && !event.shiftKey && onDeclarationBlur) {
        onDeclarationBlur(event, true);
      }
    },
    onNameInputBlur: ({ index, name, setEditingName, setEditingValue, onNameChange, editingValue, onDeclarationBlur }: StyleDelarationInnerProps) => (event) => {
      setEditingName(false);

      if (event.target.value !== name) {
        onNameChange(index, name, event.target.value);
      }

      if (!event.target.value && onDeclarationBlur) {
        onDeclarationBlur(event);
      }
    },
    onValueInputBlur: ({ index, setEditingValue, onValueChange, name, value }: StyleDelarationInnerProps) => (event) => {
      setEditingValue(false);

      if (event.target.value !== value) {
        onValueChange(index, name, event.target.value);
      }
    },
    onNameFocus: ({ setEditingName }) => () => {
      setEditingName(true);
    },
    onValueFocus: ({ setEditingValue, name }) => () => {
      setEditingValue(true);
    }
  }),
  (Base: React.ComponentClass<TdStyleDeclarationInnerProps>) => ({name, ignored, disabled, overridden, value, onToggleDeclarationClick, editingName, editingValue, onNameInputBlur, onValueInputBlur, onValueInputKeyDown, onNameInputKeyDown, isNewDeclaration, onNameFocus, onValueFocus, ...rest}: StyleDelarationInnerProps) => {

    let root: any;

    if (isNewDeclaration && editingName !== false) {
      editingName = true;
    }
    
    try {
      root = value && parseDeclaration(value).root;
    } catch(e) {
    }

    let nameInputSlot;
    let valueInputSlot;

    if (editingName) {
      nameInputSlot = <Autofocus select><input type="text" placeholder="name" defaultValue={name} className="TdStyleDeclaration" onBlur={onNameInputBlur} onKeyDown={onNameInputKeyDown} /></Autofocus>;
    }

    if (editingValue) {
      valueInputSlot = <Autofocus select><input type="text" placeholder="value" defaultValue={value} className="TdStyleDeclaration" onBlur={onValueInputBlur} onKeyDown={onValueInputKeyDown} /></Autofocus>;
    }

    return <Base name={name} editingName={editingName} onNameFocus={onNameFocus} onValueFocus={onValueFocus} editingValue={editingValue} nameInputSlot={nameInputSlot} valueInputSlot={valueInputSlot} ignored={ignored} disabled={disabled} overridden={overridden} value={root} sourceValue={value} onToggleDeclarationClick={onToggleDeclarationClick} {...rest} />;
  }
);

const CSSStyleDeclaration = hydrateTdStyleDeclaration(enhanceCSSStyleDeclaration, {
  TdCssExprInput: CSSExprInput
});

export type CSSInspectorOuterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
}

export type CSSStyleRuleOuterProps = {
  artboardId: string;
} & AppliedCSSRuleResult;
export type CSSStyleRuleInnerProps = {
  onLastDeclarationBlur: () => any;
  editingSelectorText: boolean;
  setEditingSelectorText: (value: boolean) => any;
  onSelectorTextInputFocus: () => any;
  onSelectorTextInputBlur: () => any;
  addingDeclaration: boolean;
  onAddDeclarationClick: () => any;
  onDeclarationNameChange: (oldName: string, newName: string) => any;
} & CSSStyleRuleOuterProps & TdStyleRuleInnerProps;

const beautifyLabel = (label: string) => {
  return label.replace(/\s*,\s*/g, ", ");
};

const EMPTY_OBJECT = {};

const enhanceCSSStyleRule = compose<TdStyleRuleInnerProps, CSSStyleRuleOuterProps>(
  pure,
  withState(`addingDeclaration`, `setAddingDeclaration`, false),
  withState(`editingSelectorText`, `setEditingSelectorText`, false),
  withHandlers({
    onAddDeclarationClick: ({ setAddingDeclaration }) => () => {
      setAddingDeclaration(true);
    },
    onLastDeclarationTabbed: ({ setAddingDeclaration, addingDeclaration }) => (event: React.KeyboardEvent<any>, isValue: boolean) => {
      if (isValue && !addingDeclaration) {
        event.preventDefault();
      }
      setAddingDeclaration(!addingDeclaration);
    },
    onDeclarationNameChange: ({ dispatch, rule, artboardId, setAddingDeclaration }: CSSStyleRuleInnerProps) => (index: number, oldName: string, newName: string) => {
      const owner = (rule.rule || rule.targetElement);

      // is a new prop
      if (!oldName && newName) {
        setAddingDeclaration(false);
      }
      dispatch(cssDeclarationNameChanged(index, oldName, newName, owner.id, artboardId));
    },
    onDeclarationValueChange: ({ dispatch, rule, artboardId }: CSSStyleRuleInnerProps) => (index: number, name: string, newValue: string) => {
      const owner = (rule.rule || rule.targetElement);
      dispatch(cssDeclarationValueChanged(index, name, newValue, owner.id, artboardId));
    },
    onSelectorTextFocus: ({ setEditingSelectorText }) => () => {
      setEditingSelectorText(true);
    },
    onSelectorTextBlur: ({ setEditingSelectorText }) => () => {
      setEditingSelectorText(false);
    }
  }),
  (Base: React.ComponentClass<TdStyleRuleInnerProps>) => ({ rule, inherited, ignoredPropertyNames, overriddenPropertyNames, dispatch, artboardId, disabledPropertyNames, onAddDeclarationClick, addingDeclaration, onLastDeclarationTabbed, onDeclarationNameChange, onDeclarationValueChange, editingSelectorText, onSelectorTextFocus, onSelectorTextBlur }: CSSStyleRuleInnerProps) => {

    const declarations = rule.style;

    // const properties = [];

    const childDeclarations: StyleDelarationOuterProps[] = [];

    const owner = (rule.rule || rule.targetElement);
    let index = 0;
    for (const {name, value} of rule.style) {
      const disabled = disabledPropertyNames[name];
      const ignored = Boolean(ignoredPropertyNames && ignoredPropertyNames[name]);
      const overridden = Boolean(overriddenPropertyNames && overriddenPropertyNames[name]);
      childDeclarations.push({
        index: index++,
        owner: owner,
        artboardId,
        onNameChange: onDeclarationNameChange,
        onValueChange: onDeclarationValueChange,
        name,
        ignored,
        disabled,
        overridden,
        value,
        dispatch
      });
    }

    if (addingDeclaration) {
      childDeclarations.push({
        index,
        owner,
        artboardId,
        isNewDeclaration: true,
        onNameChange: onDeclarationNameChange,
        onValueChange: onDeclarationValueChange,
        dispatch,
        name: undefined,
        value: undefined,
        ignored: false,
        disabled: false,
        overridden: false
      });
    }

    if (childDeclarations.length) {
      childDeclarations[childDeclarations.length - 1].onDeclarationBlur = onLastDeclarationTabbed;
    }

    let selectorTextInputSlot;

    if (rule.rule && editingSelectorText) {
      selectorTextInputSlot = <Autofocus select><input type="text" defaultValue={rule.rule.selectorText} onBlur={onSelectorTextBlur} className="TdStyleRule" /></Autofocus>;
    }

    return <Base label={beautifyLabel(rule.rule ? rule.rule.selectorText : "style")} index={-1} selectorTextInputSlot={selectorTextInputSlot} onSelectorTextFocus={onSelectorTextFocus} editingSelectorText={editingSelectorText}  source={null} declarations={childDeclarations} inherited={inherited} onAddDeclarationClick={onAddDeclarationClick} />;
  }
);

const CSSStyleRule = hydrateTdStyleRule(enhanceCSSStyleRule, {
  TdGutterSubheader: null,
  TdStyleDeclaration: CSSStyleDeclaration,
  TdList: null,
  TdListItem: null
});

const CSSPaneMultipleSelectedError = hydrateCssInspectorMultipleItemsSelected(identity, {
  TdPane: Pane,
});

const enhanceCSSInspectorPane = compose<TdCssInspectorPaneInnerProps, CSSInspectorOuterProps>(
  pure,
  (Base: React.ComponentClass<TdCssInspectorPaneInnerProps>) => ({ workspace, dispatch }: CSSInspectorOuterProps) => {

    const selectedElementRefs = workspace.selectionRefs.filter(([type]) => type === SlimVMObjectType.ELEMENT);

    if (!selectedElementRefs.length) {
      return null;
    }

    if (selectedElementRefs.length > 1) {
      return <CSSPaneMultipleSelectedError />;
    }

    const [type, targetElementId] = selectedElementRefs[0];
    
    const artboard = getNodeArtboard(targetElementId, workspace);
    if (!artboard) {
      return null;
    }

    const ruleProps: CSSStyleRuleOuterProps[] = getSyntheticAppliedCSSRules(artboard, targetElementId, workspace.disabledStyleDeclarations).map(rule => ({...rule, dispatch, artboardId: artboard.$id }))

    return <Base styleRules={ruleProps} />;
  }
);

// const getDisabledDeclarations = weakMemo((result: AppliedCSSRuleResult, artboard: Artboard, disabledInfo: DisabledStyleDeclarations = EMPTY_OBJECT) => {
//   const ruleOwner = result.rule.rule || result.rule.targetElement;
//   const scopeInfo = getStyleOwnerScopeInfo(ruleOwner.id, artboard.document);
//   const scopeHash = scopeInfo.join("");

//   const info =  disabledInfo[scopeHash] || EMPTY_OBJECT;

//   let ret: any = {};

//   for (const key in info) {
//     ret[key] = Boolean(info[key]);
//   }

//   return ret;
// });

export const CSSInpectorPane = hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
  TdPane: Pane,
  TdStyleRule: CSSStyleRule
});

