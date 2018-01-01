import * as React from "react";
import { Pane } from "./pane";
import { identity } from "lodash";
import { compose, pure, withHandlers, withState } from "recompose";
import { weakMemo } from "aerial-common2";
import { parseDeclaration, stringifyDeclarationAST, DcCall } from "paperclip";
import { hydrateTdCssExprInput, hydrateTdCssCallExprInput, TdCssExprInputInnerProps, TdCssCallExprInputInnerProps, TdCssSpacedListExprInputBaseInnerProps, TdCssCommaListExprInputBaseInnerProps, hydrateTdCssSpacedListExprInput, hydrateTdCssCommaListExprInput, TdCssColorExprInputInnerProps, hydrateTdCssColorExprInput, TdCssKeywordExprInputInnerProps, hydrateTdCssKeywordExprInput, hydrateTdCssNumberExprInput, TdCssNumberExprInputInnerProps, hydrateTdCssMeasurementInput, TdCssMeasurementInputInnerProps } from "./css-declaration-input.pc";
import { TdCssInspectorPaneInnerProps, hydrateTdCssInspectorPane, hydrateTdStyleRule, TdStyleRuleInnerProps, TdCssInspectorPaneBaseInnerProps, hydrateCssInspectorMultipleItemsSelected, hydrateTdStyleDeclaration, TdStyleDeclarationInnerProps } from "./css-inspector-pane.pc";

import { Dispatcher } from "aerial-common2";
import { cssToggleDeclarationEyeClicked } from "front-end/actions";
import { Workspace, getNodeArtboard, DisabledStyleDeclarations, Artboard } from "front-end/state";

import { getSyntheticAppliedCSSRules, getSyntheticMatchingCSSRules, AppliedCSSRuleResult, SlimVMObjectType, isValidStyleDeclarationName, SlimElement, SlimCSSStyleRule, getStyleOwnerFromScopeInfo, getStyleOwnerScopeInfo } from "slim-dom";

type StyleDelarationOuterProps = {
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

const enhanceCSSSpaced = compose<TdCssSpacedListExprInputBaseInnerProps, TdCssSpacedListExprInputBaseInnerProps>(
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
  withHandlers({
    onToggleDeclarationClick: ({ artboardId, owner, dispatch, name }: StyleDelarationOuterProps) => (event) => {
      dispatch(cssToggleDeclarationEyeClicked(artboardId, owner.id, name));
    }
  }),
  (Base: React.ComponentClass<TdStyleDeclarationInnerProps>) => ({name, ignored, disabled, overridden, value, onToggleDeclarationClick}: StyleDelarationInnerProps) => {

    let root: any;

    try {
      root = value && parseDeclaration(value).root;
    } catch(e) {
      return <span>Syntax error</span>;
    }

    return <Base name={name} ignored={ignored} disabled={disabled} overridden={overridden} value={root} sourceValue={value} onToggleDeclarationClick={onToggleDeclarationClick} />;
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
  addingDeclaration: boolean;
  onAddDeclarationClick: () => any;
} & CSSStyleRuleOuterProps & TdStyleRuleInnerProps;

const beautifyLabel = (label: string) => {
  return label.replace(/\s*,\s*/g, ", ");
};

const EMPTY_OBJECT = {};

const enhanceCSSStyleRule = compose<TdStyleRuleInnerProps, CSSStyleRuleOuterProps>(
  pure,
  withState(`addingDeclaration`, `setAddingDeclaration`, false),
  withHandlers({
    onAddDeclarationClick: ({ setAddingDeclaration }) => () => {
      setAddingDeclaration(true);
    },
  }),
  (Base: React.ComponentClass<TdStyleRuleInnerProps>) => ({ rule, inherited, ignoredPropertyNames, overriddenPropertyNames, dispatch, artboardId, disabledPropertyNames, onAddDeclarationClick, addingDeclaration }: CSSStyleRuleInnerProps) => {

    const declarations = rule.style;

    // const properties = [];

    const childDeclarations: StyleDelarationOuterProps[] = [];

    const owner = (rule.rule || rule.targetElement);
    for (const name in rule.style) {
      const value = declarations[name];
      if (value == null || !isValidStyleDeclarationName(name)) {
        continue;
      }
      
      const disabled = disabledPropertyNames[name];
      const ignored = Boolean(ignoredPropertyNames && ignoredPropertyNames[name]);
      const overridden = Boolean(overriddenPropertyNames && overriddenPropertyNames[name]);
      childDeclarations.push({
        owner: owner,
        artboardId,
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
        owner,
        artboardId,
        dispatch,
        editingName: true,
        name: undefined,
        value: undefined,
        ignored: false,
        disabled: false,
        overridden: false
      } as any);
    }

    return <Base label={beautifyLabel(rule.rule ? rule.rule.selectorText : "style")} source={null} declarations={childDeclarations} inherited={inherited} onAddDeclarationClick={onAddDeclarationClick} />;
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

