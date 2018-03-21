"use strict";
// TODOS:
// - [ ] Tokenize declaration value to include BG colors and interactive props
// - [ ] highlight elements in stage when hovering over selectors
// - [ ] react dnd properties
// - [ ] autocomplete for css props
// - [ ] autocomplete value props based on name
// - [ ] warning when css properties are not applied (possibly use renderer)
// - [ ] autocomplete fonts (native vs loaded separators)
// - [ ] media props
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var cx = require("classnames");
var React = require("react");
var autofocus_1 = require("front-end/components/autofocus");
var aerial_common2_1 = require("aerial-common2");
var recompose_1 = require("recompose");
var actions_1 = require("front-end/actions");
// import { 
//   AppliedCSSRuleResult,
//   cssPropNameToKebabCase,
//   toggleCSSDeclarationProperty,
//   getSyntheticAppliedCSSRules,
//   getSyntheticMatchingCSSRules, 
// } from "aerial-browser-sandbox";
var slim_dom_1 = require("slim-dom");
var toggleCSSDeclarationProperty = function () {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
};
var MIN_INPUT_WIDTH = 50;
var CHAR_WIDTH = 8;
var beautifyLabel = function (label) {
    return label.replace(/\s*,\s*/g, ", ");
};
var TextInputBase = function (_a) {
    var _b = _a.autoFocus, autoFocus = _b === void 0 ? false : _b, value = _a.value, children = _a.children, showInput = _a.showInput, className = _a.className, placeholder = _a.placeholder, onClick = _a.onClick, onFocus = _a.onFocus, onBlur = _a.onBlur, onKeyPress = _a.onKeyPress;
    return React.createElement(autofocus_1.Autofocus, { focus: autoFocus },
        React.createElement("span", { className: className, tabIndex: 0, onFocus: onFocus, onClick: onClick }, showInput ? React.createElement(autofocus_1.Autofocus, null,
            React.createElement("input", { style: { width: value ? value.length * CHAR_WIDTH : MIN_INPUT_WIDTH }, defaultValue: value, onFocus: onFocus, placeholder: placeholder, onBlur: onBlur, onKeyPress: onKeyPress })) : children));
};
exports.enhanceTextInput = recompose_1.compose(recompose_1.pure, recompose_1.withState("showInput", "setShowInput", false), recompose_1.withHandlers({
    onClick: function (_a) {
        var setShowInput = _a.setShowInput;
        return function (event) {
            setShowInput(true);
        };
    },
    onFocus: function (_a) {
        var setShowInput = _a.setShowInput;
        return function (event) {
            if (event.target.tagName === "INPUT") {
                event.target.select();
            }
            setShowInput(true);
        };
    },
    onBlur: function (_a) {
        var setShowInput = _a.setShowInput, onChange = _a.onChange, onBlur = _a.onBlur, onFinished = _a.onFinished;
        return function (event) {
            setShowInput(false);
            if (onChange) {
                onChange(event.target.value);
            }
            if (onBlur) {
                onBlur(event);
                if (onFinished) {
                    onFinished();
                }
            }
        };
    },
    onKeyPress: function (_a) {
        var setShowInput = _a.setShowInput, onChange = _a.onChange, onFinished = _a.onFinished, syncOnKeypress = _a.syncOnKeypress;
        return function (event) {
            var entered = event.key === "Enter";
            if (syncOnKeypress || entered) {
                if (onChange) {
                    onChange(event.target.value);
                }
                if (entered) {
                    setShowInput(false);
                    if (onFinished) {
                        onFinished();
                    }
                }
            }
        };
    }
}));
var TextInput = exports.enhanceTextInput(TextInputBase);
var StylePropertyBase = function (_a) {
    var windowId = _a.windowId, declarationId = _a.declarationId, name = _a.name, value = _a.value, dispatch = _a.dispatch, disabled = _a.disabled, focusNameInput = _a.focusNameInput, overridden = _a.overridden, ignored = _a.ignored, origValue = _a.origValue, onValueChange = _a.onValueChange, onNameChange = _a.onNameChange, onValueBlur = _a.onValueBlur;
    return React.createElement("div", { className: cx("property", { disabled: disabled, ignored: ignored, overridden: overridden }) },
        React.createElement("span", { className: "name" },
            React.createElement(TextInput, { value: name, onChange: onNameChange, autoFocus: focusNameInput }, slim_dom_1.cssPropNameToKebabCase(name)),
            ":"),
        React.createElement(TextInput, { className: "value", value: value || origValue, onChange: onValueChange, onBlur: onValueBlur ? function (event) { return onValueBlur(name, event.target.value); } : null }, value || origValue),
        React.createElement("div", { className: "controls" },
            React.createElement("i", { className: cx({ "ion-eye-disabled": disabled, "ion-eye": !disabled }), onClick: aerial_common2_1.wrapEventToDispatch(dispatch, function () { return toggleCSSDeclarationProperty(name, declarationId, windowId); }) })));
};
var StyleProperty = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onNameChange: function (_a) {
        var name = _a.name, windowId = _a.windowId, declarationId = _a.declarationId, dispatch = _a.dispatch;
        return function (value) {
            // dispatch(cssDeclarationNameChanged(name, value, declarationId, windowId));
        };
    },
    onValueChange: function (_a) {
        var name = _a.name, windowId = _a.windowId, declarationId = _a.declarationId, dispatch = _a.dispatch;
        return function (value) {
            // dispatch(cssDeclarationValueChanged(name, value, declarationId, windowId));
        };
    }
}))(StylePropertyBase);
var NewStyleProperty = recompose_1.compose(recompose_1.pure, recompose_1.withState("name", "setName", null), recompose_1.withHandlers({
    onNameChange: function (_a) {
        var setName = _a.setName, onCreated = _a.onCreated;
        return function (value) {
            setName(value);
            if (!value) {
                onCreated(null, null);
            }
        };
    },
    onValueChange: function (_a) {
        var name = _a.name, windowId = _a.windowId, dispatch = _a.dispatch, onCreated = _a.onCreated;
        return function (value) {
            onCreated(name, value);
        };
    }
}))(StylePropertyBase);
var AppliedCSSRuleInfoBase = function (_a) {
    var isDefault = _a.isDefault, isTarget = _a.isTarget, dispatch = _a.dispatch, appliedRule = _a.appliedRule, onValueBlur = _a.onValueBlur, onSourceClicked = _a.onSourceClicked, onToggleAsTarget = _a.onToggleAsTarget, onAddDeclaration = _a.onAddDeclaration, onTitleMouseEnter = _a.onTitleMouseEnter, onTitleMouseLeave = _a.onTitleMouseLeave, onDeclarationCreated = _a.onDeclarationCreated, showNewDeclarationInput = _a.showNewDeclarationInput;
    var properties = [];
    var declaration = appliedRule.rule.style;
    // for (let i = 0, n = declaration.length; i < n; i++) {
    for (var name_1 in declaration) {
        // const name = declaration[i];
        var value = declaration[name_1];
        // const origValue = appliedRule.rule.style.disabledPropertyNames && appliedRule.rule.style.disabledPropertyNames[name];
        // const disabled = Boolean(origValue);
        var ignored = Boolean(appliedRule.ignoredPropertyNames && appliedRule.ignoredPropertyNames[name_1]);
        var overridden = Boolean(appliedRule.overriddenPropertyNames && appliedRule.overriddenPropertyNames[name_1]);
        // properties.push(
        //   <StyleProperty onValueBlur={onValueBlur} windowId={window.$id} key={name} name={name} value={value} dispatch={dispatch} declarationId={appliedRule.rule.style.id} ignored={ignored} disabled={disabled} overridden={overridden} origValue={origValue} />
        // );
    }
    if (showNewDeclarationInput) {
        // properties.push(
        //   <NewStyleProperty focusNameInput={true} windowId={window.$id} key={properties.length} onCreated={onDeclarationCreated} onValueBlur={onValueBlur} />
        // );
    }
    return React.createElement("div", { className: cx("style-rule-info", { "is-target": isTarget, "is-default": isDefault }) },
        React.createElement("div", { className: "title", onMouseEnter: onTitleMouseEnter, onMouseLeave: onTitleMouseLeave },
            React.createElement("span", { className: "selector" }),
            React.createElement("span", { className: "source", onClick: onSourceClicked }),
            appliedRule.inherited ? React.createElement("span", { className: "inherited" }, "Inherited") : null,
            appliedRule.media ? React.createElement("span", { className: "media" },
                "@media ",
                appliedRule.media) : null,
            React.createElement("i", { className: "ion-star", onClick: onToggleAsTarget }),
            React.createElement("i", { className: "ion-plus add-declaration-button", onClick: onAddDeclaration })),
        React.createElement("div", { className: "declaration" }, properties));
};
var AppliedCSSRuleInfo = recompose_1.compose(recompose_1.pure, recompose_1.withState("showNewDeclarationInput", "setShowNewDeclarationInput", false), recompose_1.withHandlers({
    onAddDeclaration: function (_a) {
        var setShowNewDeclarationInput = _a.setShowNewDeclarationInput;
        return function () {
            setShowNewDeclarationInput(true);
        };
    },
    onToggleAsTarget: function (_a) {
        var dispatch = _a.dispatch, appliedRule = _a.appliedRule;
        return function () {
            // dispatch(toggleCSSTargetSelectorClicked(appliedRule.rule.$id, window.$id));
        };
    },
    onDeclarationCreated: function (_a) {
        var setShowNewDeclarationInput = _a.setShowNewDeclarationInput, dispatch = _a.dispatch, appliedRule = _a.appliedRule;
        return function (name, value) {
            setShowNewDeclarationInput(false);
            if (value) {
                // dispatch(cssDeclarationCreated(name, value, appliedRule.rule.style.$id, window.$id));
            }
        };
    },
    onValueBlur: function (_a) {
        var appliedRule = _a.appliedRule, showNewDeclarationInput = _a.showNewDeclarationInput, setShowNewDeclarationInput = _a.setShowNewDeclarationInput;
        return function (name, value) {
            var lastPropName = appliedRule.rule.style[appliedRule.rule.style.length - 1];
            if ((lastPropName === name || !appliedRule.rule.style[name]) && name && value) {
                setShowNewDeclarationInput(true);
            }
        };
    },
    onSourceClicked: function (_a) {
        var dispatch = _a.dispatch, appliedRule = _a.appliedRule, window = _a.window;
        return function () {
            dispatch(actions_1.sourceClicked(appliedRule.rule.$id, window.$id));
        };
    },
    onTitleMouseEnter: function (_a) {
        var dispatch = _a.dispatch, appliedRule = _a.appliedRule, window = _a.window;
        return function () {
            if (appliedRule.rule.selectorText) {
                dispatch(actions_1.cssDeclarationTitleMouseEnter(appliedRule.rule.$id, window.$id));
            }
        };
    },
    onTitleMouseLeave: function (_a) {
        var dispatch = _a.dispatch, appliedRule = _a.appliedRule, window = _a.window;
        return function () {
            if (appliedRule.rule.selectorText) {
                dispatch(actions_1.cssDeclarationTitleMouseLeave(appliedRule.rule.$id, window.$id));
            }
        };
    }
}))(AppliedCSSRuleInfoBase);
var CSSInspectorBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch;
    var selectedElementRefs = workspace.selectionRefs.filter(function (_a) {
        var type = _a[0];
        return type === null;
    });
    if (!selectedElementRefs.length) {
        return null;
    }
    var targetSelectors = workspace.targetCSSSelectors || [];
    return null;
    // return <div>
    //   { selectedElementRefs.sort((a, b) => a[1] > b[1] ? -1 : 1).map(([type, targetElementId]) => {
    //     const element = getSyntheticNodeById(browser, targetElementId) as SyntheticElement;
    //     const window = getSyntheticNodeWindow(browser, targetElementId);
    //     if (!element || !window) {
    //       return null;
    //     }
    //     const rules = [];
    //     // const rules = getSyntheticAppliedCSSRules(window, targetElementId);
    //     const title = <span className="pane-title"><span className="selected-element">{getSyntheticElementLabel(element)}</span> CSS</span>;
    //     return <Pane key={element.$id} title={title} className="m-css-inspector">
    //       {
    //         rules.map((rule) => {
    //           return <AppliedCSSRuleInfo workspaceId={workspace.$id} window={window} key={rule.rule.$id}  appliedRule={rule} dispatch={dispatch} isTarget={Boolean(targetSelectors.find(({ uri, value }) => rule.rule.source && rule.rule.source.uri === uri && rule.rule.selectorText == value))} isDefault={targetSelectors.length === 0 && !rule.rule.selectorText} />
    //         })
    //       }
    //     </Pane>
    //   }) }
    // </div>
};
var enhanceCSSInspector = recompose_1.compose(recompose_1.pure);
exports.CSSInspector = enhanceCSSInspector(CSSInspectorBase);
//# sourceMappingURL=index.js.map