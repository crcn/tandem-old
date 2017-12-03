import * as React from "react";
import { Pane } from "./pane";
import { identity, kebabCase } from "lodash";
import { compose, pure } from "recompose";
import { parseDeclaration, stringifyDeclarationAST, DcCall } from "paperclip";
import { hydrateTdCssExprInput, hydrateTdCssCallExprInput, TdCssExprInputInnerProps, TdCssCallExprInputInnerProps, TdCssSpacedListExprInputBaseInnerProps, TdCssCommaListExprInputBaseInnerProps, hydrateTdCssSpacedListExprInput, hydrateTdCssCommaListExprInput, TdCssColorExprInputInnerProps, hydrateTdCssColorExprInput, TdCssKeywordExprInputInnerProps, hydrateTdCssKeywordExprInput, hydrateTdCssNumberExprInput, TdCssNumberExprInputInnerProps, hydrateTdCssMeasurementInput, TdCssMeasurementInputInnerProps } from "./css-declaration-input.pc";
import { TdCssInspectorPaneInnerProps, hydrateTdCssInspectorPane, hydrateTdStyleRule, TdStyleRuleInnerProps, TdCssInspectorPaneBaseInnerProps, hydrateCssInspectorMultipleItemsSelected, hydrateTdStyleDeclaration, TdStyleDeclarationInnerProps } from "./css-inspector-pane.pc";

import { Dispatcher } from "aerial-common2";
import { SyntheticBrowser, Workspace } from "front-end/state";

import { 
  AppliedCSSRuleResult,
  cssPropNameToKebabCase,
  toggleCSSDeclarationProperty,
  getSyntheticAppliedCSSRules,
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  SyntheticElement,
  SYNTHETIC_ELEMENT,
  getSyntheticMatchingCSSRules, 
} from "aerial-browser-sandbox";

type StyleDelarationOuterProps = {
  name: string;
  ignored: boolean;
  disabled: boolean;
  overridden: boolean;
  value: string;
};

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

const enhanceCSSStyleDeclaration = compose<TdStyleDeclarationInnerProps, StyleDelarationOuterProps>(
  pure,
  (Base: React.ComponentClass<TdStyleDeclarationInnerProps>) => ({name, ignored, disabled, overridden, value}: StyleDelarationOuterProps) => {
    return <Base name={kebabCase(name)} ignored={ignored} disabled={disabled} overridden={overridden} value={parseDeclaration(value)} sourceValue={value} />;
  }
);

const CSSStyleDeclaration = hydrateTdStyleDeclaration(enhanceCSSStyleDeclaration, {
  TdCssExprInput: CSSExprInput
});

export type CSSInspectorOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export type CSSStyleRuleOuterProps = AppliedCSSRuleResult

const beautifyLabel = (label: string) => {
  return label.replace(/\s*,\s*/g, ", ");
};

const enhanceCSSStyleRule = compose<TdStyleRuleInnerProps, CSSStyleRuleOuterProps>(
  pure,
  (Base: React.ComponentClass<TdStyleRuleInnerProps>) => ({ rule, inherited, ignoredPropertyNames, overriddenPropertyNames }: CSSStyleRuleOuterProps) => {

    const declarations = rule.style;

    // const properties = [];
    
    const childDeclarations: StyleDelarationOuterProps[] = [];
    
    for (let i = 0, n = declarations.length; i < n; i++) {
      const name = declarations[i];
      const value = declarations[name];
      const origValue = rule.style.disabledPropertyNames && rule.style.disabledPropertyNames[name];
      const disabled = Boolean(origValue);
      const ignored = Boolean(ignoredPropertyNames && ignoredPropertyNames[name]);
      const overridden = Boolean(overriddenPropertyNames && overriddenPropertyNames[name]);

      // childDeclarations.push({
      //   name,
      //   ignored,
      //   disabled,
      //   overridden,
      //   value,
      // });
    }
    return <Base label={beautifyLabel(rule.label || rule.selectorText)} source={null} declarations={childDeclarations} inherited={inherited} />;
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
  (Base: React.ComponentClass<TdCssInspectorPaneInnerProps>) => ({ workspace, browser }: CSSInspectorOuterProps) => {

    const selectedElementRefs = workspace.selectionRefs.filter(([type]) => type === SYNTHETIC_ELEMENT);

    if (!selectedElementRefs.length) {
      return null;
    }

    if (selectedElementRefs.length > 1) {
      return <CSSPaneMultipleSelectedError />;
    }

    const [type, targetElementId] = selectedElementRefs[0];
    

    const element = getSyntheticNodeById(browser, targetElementId) as SyntheticElement;
    const window = getSyntheticNodeWindow(browser, targetElementId);
    if (!element || !window) {
      return null;
    }
  

    const rules = getSyntheticAppliedCSSRules(window, targetElementId);

    return <Base styleRules={rules} />;
  }
);

export const CSSInpectorPane = hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
  TdPane: Pane,
  TdStyleRule: CSSStyleRule
});

