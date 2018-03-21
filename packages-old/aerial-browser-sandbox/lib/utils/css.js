"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var state_1 = require("../state");
var environment_1 = require("../environment");
var constants_1 = require("../constants");
exports.containsInheritableStyleProperty = function (style) {
    for (var i = 0; i < style.length; i++) {
        var propertyName = style[i];
        if (constants_1.INHERITED_CSS_STYLE_PROPERTIES[propertyName] && style[propertyName]) {
            return true;
        }
    }
    return false;
};
var getDocumentCSSStyleRules = aerial_common2_1.weakMemo(function (document) {
    var allRules = [];
    var styleSheets = document.instance.stylesheets;
    for (var _i = 0, styleSheets_1 = styleSheets; _i < styleSheets_1.length; _i++) {
        var styleSheet = styleSheets_1[_i];
        for (var _a = 0, _b = styleSheet.cssRules; _a < _b.length; _a++) {
            var rule = _b[_a];
            if (rule.type === environment_1.CSSRuleType.STYLE_RULE) {
                allRules.push(rule);
            }
        }
    }
    // const allChildObjects = flattenDocumentSources(document);
    // for (const $id in allChildObjects) {
    //   const child = allChildObjects[$id] as any as SEnvCSSRuleInterface;
    //   if (child.type === CSSRuleType.STYLE_RULE) {
    //     allRules.push(child as SEnvCSSStyleRuleInterface);
    //   }
    // }
    return allRules;
});
exports.windowMatchesMedia = aerial_common2_1.weakMemo(function (window, conditionText) {
    return window.instance.matchMedia(conditionText).matches;
});
// TODO - consider media screen here too
exports.getSyntheticMatchingCSSRules = aerial_common2_1.weakMemo(function (window, elementId, breakPastHost) {
    var element = state_1.getSyntheticWindowChild(window, elementId);
    var hostDocument = environment_1.getHostDocument(element.instance);
    var allRules = getDocumentCSSStyleRules(hostDocument.struct);
    var matchingRules = [];
    var elementStyle = element.instance.style;
    for (var i = 0, n = allRules.length; i < n; i++) {
        var rule = allRules[i];
        // no parent rule -- check
        if (!rule.parentRule) {
            if (element.instance.matches(rule.selectorText)) {
                matchingRules.push(rule.struct);
            }
            // else - check if media rule
        }
        else if (rule.parentRule.conditionText && exports.windowMatchesMedia(window, rule.parentRule.conditionText) && element.instance.matches(rule.selectorText)) {
            matchingRules.push(rule.struct);
        }
    }
    matchingRules.push({
        label: "style",
        $id: element.$id,
        source: element.source,
        instance: element.instance,
        style: elementStyle.struct
    });
    return matchingRules;
});
var getSyntheticInheritableCSSRules = aerial_common2_1.weakMemo(function (window, elementId) {
    var matchingCSSRules = exports.getSyntheticMatchingCSSRules(window, elementId, true);
    var inheritableCSSRules = [];
    for (var i = 0, n = matchingCSSRules.length; i < n; i++) {
        var rule = matchingCSSRules[i];
        if (exports.containsInheritableStyleProperty(rule.style)) {
            inheritableCSSRules.push(rule);
        }
    }
    return inheritableCSSRules;
});
var getParentMediaText = function (rule) { return rule.parentRule && rule.parentRule.conditionText; };
exports.getSyntheticAppliedCSSRules = aerial_common2_1.weakMemo(function (window, elementId) {
    var element = state_1.getSyntheticWindowChild(window, elementId);
    var document = environment_1.getHostDocument(element.instance);
    var allRules = getDocumentCSSStyleRules(document.struct);
    // first grab the rules that are applied directly to the element
    var matchingRules = exports.getSyntheticMatchingCSSRules(window, elementId);
    var appliedPropertNames = {};
    var appliedStyleRules = {};
    var appliedRules = [];
    for (var i = matchingRules.length; i--;) {
        var matchingRule = matchingRules[i];
        appliedStyleRules[matchingRule.$id] = true;
        var overriddenPropertyNames = {};
        for (var propertyName in matchingRule.style) {
            if (appliedPropertNames[propertyName]) {
                overriddenPropertyNames[propertyName] = true;
            }
            else if (!matchingRule.style.disabledPropertyNames || !matchingRule.style.disabledPropertyNames[propertyName]) {
                appliedPropertNames[propertyName] = true;
            }
        }
        appliedRules.push({
            inherited: false,
            media: getParentMediaText(matchingRule.instance),
            rule: matchingRule,
            overriddenPropertyNames: overriddenPropertyNames,
        });
    }
    // next, fetch the style rules that have inheritable properties such as font-size, color, etc. 
    var ancestors = state_1.getSyntheticNodeAncestors(element, window);
    // reduce by 1 to omit #document
    for (var i = 0, n = ancestors.length - 1; i < n; i++) {
        var ancestor = ancestors[i];
        if (ancestor.nodeType !== environment_1.SEnvNodeTypes.ELEMENT) {
            continue;
        }
        var inheritedRules = getSyntheticInheritableCSSRules(window, ancestor.$id);
        for (var j = inheritedRules.length; j--;) {
            var ancestorRule = inheritedRules[j];
            if (appliedStyleRules[ancestorRule.$id]) {
                continue;
            }
            appliedStyleRules[ancestorRule.$id] = true;
            var overriddenPropertyNames = {};
            var ignoredPropertyNames = {};
            for (var propertyName in ancestorRule.style) {
                if (!constants_1.INHERITED_CSS_STYLE_PROPERTIES[propertyName]) {
                    ignoredPropertyNames[propertyName] = true;
                }
                else if (appliedPropertNames[propertyName]) {
                    overriddenPropertyNames[propertyName] = true;
                }
                else if (!ancestorRule.style.disabledPropertyNames || !ancestorRule.style.disabledPropertyNames[propertyName]) {
                    appliedPropertNames[propertyName] = true;
                }
            }
            appliedRules.push({
                inherited: true,
                media: getParentMediaText(ancestorRule.instance),
                rule: ancestorRule,
                ignoredPropertyNames: ignoredPropertyNames,
                overriddenPropertyNames: overriddenPropertyNames,
            });
        }
    }
    return appliedRules;
});
//# sourceMappingURL=css.js.map