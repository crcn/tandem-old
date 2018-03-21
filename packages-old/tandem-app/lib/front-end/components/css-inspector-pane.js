"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pane_1 = require("./pane");
var lodash_1 = require("lodash");
var recompose_1 = require("recompose");
var autofocus_1 = require("./autofocus");
var td_dropdown_1 = require("./td-dropdown");
var paperclip_1 = require("paperclip");
var css_declaration_input_pc_1 = require("./css-declaration-input.pc");
var css_inspector_pane_pc_1 = require("./css-inspector-pane.pc");
var actions_1 = require("front-end/actions");
var state_1 = require("front-end/state");
var slim_dom_1 = require("slim-dom");
var CSS_INSPECTOR_MORE_OPTIONS = [
    {
        label: "Add style"
    }
];
var enhanceCssCallExprInput = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var name = _a.name, params = _a.params, rest = __rest(_a, ["name", "params"]);
    var returnType;
    var returnValue = paperclip_1.stringifyDeclarationAST(__assign({ name: name,
        params: params }, rest));
    switch (name) {
        case "rgb":
        case "rgba": {
            returnType = "COLOR";
            break;
        }
    }
    return React.createElement(Base, __assign({ name: name, params: params, returnValue: returnValue, returnType: returnType }, rest));
}; });
var CssCallExprInput = css_declaration_input_pc_1.hydrateTdCssCallExprInput(enhanceCssCallExprInput, {
    TdColorMiniInput: null,
    TdCssExprInput: function (props) {
        return React.createElement(CSSExprInput, __assign({}, props));
    }
});
var enhanceCssNumberInput = recompose_1.compose(recompose_1.pure);
var CssNumberInput = css_declaration_input_pc_1.hydrateTdCssNumberExprInput(enhanceCssNumberInput, {});
var enhanceCssMeasurementInput = recompose_1.compose(recompose_1.pure);
var CssMeasurementInput = css_declaration_input_pc_1.hydrateTdCssMeasurementInput(enhanceCssMeasurementInput, {});
var enhanceCssKeywordInput = recompose_1.compose(recompose_1.pure);
var CssKeywordInput = css_declaration_input_pc_1.hydrateTdCssKeywordExprInput(enhanceCssKeywordInput, {});
var enhanceCssColorInput = recompose_1.compose(recompose_1.pure);
var CssColorInput = css_declaration_input_pc_1.hydrateTdCssColorExprInput(enhanceCssColorInput, {
    TdColorMiniInput: null
});
var enhanceCSSCallExprInput = recompose_1.compose(recompose_1.pure);
var enhanceCSSSpaced = recompose_1.compose(recompose_1.pure);
var CssSpacedList = css_declaration_input_pc_1.hydrateTdCssSpacedListExprInput(enhanceCSSSpaced, {
    TdCssExprInput: function (props) { return React.createElement(CSSExprInput, __assign({}, props)); }
});
var CssCommaList = css_declaration_input_pc_1.hydrateTdCssCommaListExprInput(enhanceCSSSpaced, {
    TdCssExprInput: function (props) { return React.createElement(CSSExprInput, __assign({}, props)); }
});
var CSSExprInput = css_declaration_input_pc_1.hydrateTdCssExprInput(enhanceCSSCallExprInput, {
    TdCssCallExprInput: CssCallExprInput,
    TdCssColorExprInput: CssColorInput,
    TdCssCommaListExprInput: CssCommaList,
    TdCssKeywordExprInput: CssKeywordInput,
    TdCssMeasurementInput: CssMeasurementInput,
    TdCssNumberExprInput: CssNumberInput,
    TdCssSpacedListExprInput: CssSpacedList,
    TdCssStringExprInput: null
});
var enhanceCSSStyleDeclaration = recompose_1.compose(recompose_1.pure, recompose_1.withState("editingName", "setEditingName", undefined), recompose_1.withState("editingValue", "setEditingValue", undefined), recompose_1.withState("newName", "setNewName", undefined), recompose_1.withState("newValue", "setNewValue", undefined), recompose_1.withHandlers({
    onToggleDeclarationClick: function (_a) {
        var index = _a.index, artboardId = _a.artboardId, owner = _a.owner, dispatch = _a.dispatch, name = _a.name;
        return function (event) {
            dispatch(actions_1.cssToggleDeclarationEyeClicked(artboardId, owner.id, name, index));
        };
    },
    onNameInputKeyDown: function (_a) {
        var index = _a.index, setEditingName = _a.setEditingName, onNameChange = _a.onNameChange, onDeclarationBlur = _a.onDeclarationBlur;
        return function (event) {
            if (event.key === "Enter") {
                setEditingName(false);
                if (event.target.value !== name) {
                    onNameChange(name, event.target.value);
                }
            }
            else if (event.key === "Tab" && onDeclarationBlur && !event.target.value) {
                onDeclarationBlur(event);
            }
        };
    },
    onValueInputKeyDown: function (_a) {
        var index = _a.index, setEditingValue = _a.setEditingValue, value = _a.value, name = _a.name, onValueChange = _a.onValueChange, onDeclarationBlur = _a.onDeclarationBlur;
        return function (event) {
            var target = event.target;
            if (event.key === "Enter") {
                setEditingValue(false);
                if (target.value !== value) {
                    onValueChange(index, name, target.value);
                }
            }
            else if (event.key === "Tab" && onDeclarationBlur) {
                onDeclarationBlur(event, true);
            }
        };
    },
    onNameInputBlur: function (_a) {
        var index = _a.index, name = _a.name, setEditingName = _a.setEditingName, setEditingValue = _a.setEditingValue, onNameChange = _a.onNameChange, editingValue = _a.editingValue, onDeclarationBlur = _a.onDeclarationBlur;
        return function (event) {
            setEditingName(false);
            if (event.target.value !== name) {
                onNameChange(index, name, event.target.value);
            }
            if (!event.target.value && onDeclarationBlur) {
                onDeclarationBlur(event);
            }
        };
    },
    onValueInputBlur: function (_a) {
        var index = _a.index, setEditingValue = _a.setEditingValue, onValueChange = _a.onValueChange, name = _a.name, value = _a.value;
        return function (event) {
            setEditingValue(false);
            if (event.target.value !== value) {
                onValueChange(index, name, event.target.value);
            }
        };
    },
    onNameFocus: function (_a) {
        var setEditingName = _a.setEditingName;
        return function () {
            setEditingName(true);
        };
    },
    onValueFocus: function (_a) {
        var setEditingValue = _a.setEditingValue, name = _a.name;
        return function () {
            setEditingValue(true);
        };
    }
}), function (Base) { return function (_a) {
    var name = _a.name, ignored = _a.ignored, disabled = _a.disabled, overridden = _a.overridden, value = _a.value, onToggleDeclarationClick = _a.onToggleDeclarationClick, editingName = _a.editingName, editingValue = _a.editingValue, onNameInputBlur = _a.onNameInputBlur, onValueInputBlur = _a.onValueInputBlur, onValueInputKeyDown = _a.onValueInputKeyDown, onNameInputKeyDown = _a.onNameInputKeyDown, isNewDeclaration = _a.isNewDeclaration, onNameFocus = _a.onNameFocus, onValueFocus = _a.onValueFocus, rest = __rest(_a, ["name", "ignored", "disabled", "overridden", "value", "onToggleDeclarationClick", "editingName", "editingValue", "onNameInputBlur", "onValueInputBlur", "onValueInputKeyDown", "onNameInputKeyDown", "isNewDeclaration", "onNameFocus", "onValueFocus"]);
    var root;
    if (isNewDeclaration && editingName !== false) {
        editingName = true;
    }
    try {
        root = value && paperclip_1.parseDeclaration(value).root;
    }
    catch (e) {
    }
    var nameInputSlot;
    var valueInputSlot;
    if (editingName) {
        nameInputSlot = React.createElement(autofocus_1.Autofocus, { select: true },
            React.createElement("input", { type: "text", placeholder: "name", defaultValue: name, className: "TdStyleDeclaration", onBlur: onNameInputBlur, onKeyDown: onNameInputKeyDown }));
    }
    if (editingValue) {
        valueInputSlot = React.createElement(autofocus_1.Autofocus, { select: true },
            React.createElement("input", { type: "text", placeholder: "value", defaultValue: value, className: "TdStyleDeclaration", onBlur: onValueInputBlur, onKeyDown: onValueInputKeyDown }));
    }
    return React.createElement(Base, __assign({ name: name, editingName: editingName, onNameFocus: onNameFocus, onValueFocus: onValueFocus, editingValue: editingValue, nameInputSlot: nameInputSlot, valueInputSlot: valueInputSlot, ignored: ignored, disabled: disabled, overridden: overridden, value: root, sourceValue: value, onToggleDeclarationClick: onToggleDeclarationClick }, rest));
}; });
var CSSStyleDeclaration = css_inspector_pane_pc_1.hydrateTdStyleDeclaration(enhanceCSSStyleDeclaration, {
    TdCssExprInput: CSSExprInput
});
var beautifyLabel = function (label) {
    return label.replace(/\s*,\s*/g, ", ");
};
var EMPTY_OBJECT = {};
var enhanceCSSStyleRule = recompose_1.compose(recompose_1.pure, recompose_1.withState("addingDeclaration", "setAddingDeclaration", false), recompose_1.withState("editingSelectorText", "setEditingSelectorText", false), recompose_1.withHandlers({
    onAddDeclarationClick: function (_a) {
        var setAddingDeclaration = _a.setAddingDeclaration;
        return function () {
            setAddingDeclaration(true);
        };
    },
    onLastDeclarationTabbed: function (_a) {
        var setAddingDeclaration = _a.setAddingDeclaration, addingDeclaration = _a.addingDeclaration;
        return function (event, isValue) {
            if (isValue && !addingDeclaration) {
                event.preventDefault();
            }
            setAddingDeclaration(!addingDeclaration);
        };
    },
    onDeclarationNameChange: function (_a) {
        var dispatch = _a.dispatch, rule = _a.rule, artboardId = _a.artboardId, setAddingDeclaration = _a.setAddingDeclaration;
        return function (index, oldName, newName) {
            var owner = (rule.rule || rule.targetElement);
            // is a new prop
            if (!oldName && newName) {
                setAddingDeclaration(false);
            }
            dispatch(actions_1.cssDeclarationNameChanged(index, oldName, newName, owner.id, artboardId));
        };
    },
    onDeclarationValueChange: function (_a) {
        var dispatch = _a.dispatch, rule = _a.rule, artboardId = _a.artboardId;
        return function (index, name, newValue) {
            var owner = (rule.rule || rule.targetElement);
            dispatch(actions_1.cssDeclarationValueChanged(index, name, newValue, owner.id, artboardId));
        };
    },
    onSelectorTextFocus: function (_a) {
        var setEditingSelectorText = _a.setEditingSelectorText;
        return function () {
            setEditingSelectorText(true);
        };
    },
    onSelectorTextBlur: function (_a) {
        var dispatch = _a.dispatch, setEditingSelectorText = _a.setEditingSelectorText, rule = _a.rule, artboardId = _a.artboardId;
        return function (event) {
            setEditingSelectorText(false);
            if (rule.rule && rule.rule.selectorText !== event.target.value) {
                dispatch(actions_1.cssSelectorTextChanged(rule.rule.id, event.target.value, artboardId));
            }
        };
    },
    onSelectorTextInputKeyDown: function (_a) {
        var dispatch = _a.dispatch, rule = _a.rule, artboardId = _a.artboardId;
        return function (event) {
            if (event.key === "Enter" && rule.rule && rule.rule.selectorText !== event.target.value) {
                dispatch(actions_1.cssSelectorTextChanged(rule.rule.id, event.target.value, artboardId));
            }
        };
    }
}), function (Base) { return function (_a) {
    var rule = _a.rule, inherited = _a.inherited, ignoredPropertyNames = _a.ignoredPropertyNames, overriddenPropertyNames = _a.overriddenPropertyNames, dispatch = _a.dispatch, artboardId = _a.artboardId, disabledPropertyNames = _a.disabledPropertyNames, onAddDeclarationClick = _a.onAddDeclarationClick, addingDeclaration = _a.addingDeclaration, onLastDeclarationTabbed = _a.onLastDeclarationTabbed, onDeclarationNameChange = _a.onDeclarationNameChange, onDeclarationValueChange = _a.onDeclarationValueChange, editingSelectorText = _a.editingSelectorText, onSelectorTextFocus = _a.onSelectorTextFocus, onSelectorTextBlur = _a.onSelectorTextBlur, onSelectorTextInputKeyDown = _a.onSelectorTextInputKeyDown;
    var declarations = rule.style;
    // const properties = [];
    var childDeclarations = [];
    var owner = (rule.rule || rule.targetElement);
    var index = 0;
    for (var _i = 0, _b = rule.style; _i < _b.length; _i++) {
        var _c = _b[_i], name_1 = _c.name, value = _c.value;
        var disabled = disabledPropertyNames[name_1];
        var ignored = Boolean(ignoredPropertyNames && ignoredPropertyNames[name_1]);
        var overridden = Boolean(overriddenPropertyNames && overriddenPropertyNames[name_1]);
        childDeclarations.push({
            index: index++,
            owner: owner,
            artboardId: artboardId,
            onNameChange: onDeclarationNameChange,
            onValueChange: onDeclarationValueChange,
            name: name_1,
            ignored: ignored,
            disabled: disabled,
            overridden: overridden,
            value: value,
            dispatch: dispatch
        });
    }
    if (addingDeclaration) {
        childDeclarations.push({
            index: index,
            owner: owner,
            artboardId: artboardId,
            isNewDeclaration: true,
            onNameChange: onDeclarationNameChange,
            onValueChange: onDeclarationValueChange,
            dispatch: dispatch,
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
    var selectorTextInputSlot;
    if (rule.rule && editingSelectorText) {
        selectorTextInputSlot = React.createElement(autofocus_1.Autofocus, { select: true },
            React.createElement("input", { type: "text", defaultValue: rule.rule.selectorText, onBlur: onSelectorTextBlur, className: "TdStyleRule", onKeyDown: onSelectorTextInputKeyDown }));
    }
    return React.createElement(Base, { label: beautifyLabel(rule.rule ? rule.rule.selectorText : "style"), index: -1, selectorTextInputSlot: selectorTextInputSlot, onSelectorTextFocus: onSelectorTextFocus, editingSelectorText: editingSelectorText, source: null, declarations: childDeclarations, inherited: inherited, onAddDeclarationClick: onAddDeclarationClick });
}; });
var CSSStyleRule = css_inspector_pane_pc_1.hydrateTdStyleRule(enhanceCSSStyleRule, {
    TdGutterSubheader: null,
    TdStyleDeclaration: CSSStyleDeclaration,
    TdList: null,
    TdListItem: null
});
var CSSPaneMultipleSelectedError = css_inspector_pane_pc_1.hydrateCssInspectorMultipleItemsSelected(lodash_1.identity, {
    TdPane: pane_1.Pane,
});
var enhanceCSSInspectorPane = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch;
    var selectedElementRefs = workspace.selectionRefs.filter(function (_a) {
        var type = _a[0];
        return type === slim_dom_1.SlimVMObjectType.ELEMENT;
    });
    if (!selectedElementRefs.length) {
        return null;
    }
    if (selectedElementRefs.length > 1) {
        return React.createElement(CSSPaneMultipleSelectedError, null);
    }
    var _b = selectedElementRefs[0], type = _b[0], targetElementId = _b[1];
    var artboard = state_1.getNodeArtboard(targetElementId, workspace);
    if (!artboard) {
        return null;
    }
    var ruleProps = slim_dom_1.getSyntheticAppliedCSSRules(artboard, targetElementId, workspace.disabledStyleDeclarations).map(function (rule) { return (__assign({}, rule, { dispatch: dispatch, artboardId: artboard.$id })); });
    return React.createElement(Base, { styleRules: ruleProps, onMoreClick: null, moreButtonOptions: true });
}; });
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
exports.CSSInpectorPane = css_inspector_pane_pc_1.hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
    TdPane: pane_1.Pane,
    TdStyleRule: CSSStyleRule,
    TdDropdownButton: td_dropdown_1.DropdownButton
});
//# sourceMappingURL=css-inspector-pane.js.map