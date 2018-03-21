"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
var constants_1 = require("./constants");
var state_1 = require("../../state");
var declaration_1 = require("./declaration");
var base_1 = require("./base");
var collections_1 = require("./collections");
var constants_2 = require("../constants");
var utils_1 = require("./utils");
exports.cssInsertRule = function (parent, child, index, context) {
    var isStyleRule = parent.type != null;
    var styleSheet = isStyleRule ? parent.parentStyleSheet : parent;
    if (!child) {
        return -1;
    }
    if (typeof child === "string") {
        var childObject = utils_1.evaluateCSS(child, styleSheet.href, context, null).cssRules[0];
        if (isStyleRule) {
            childObject.$parentRule = parent;
        }
        else {
            childObject.$parentStyleSheet = parent;
        }
        child = childObject;
    }
    if (index == null) {
        index = parent.cssRules.length;
    }
    Array.prototype.splice.call(parent.cssRules, index, 0, child);
    parent["didChange"](exports.cssParentInsertRule(parent, child, index));
    return index;
};
exports.cssDeleteRule = function (parent, index) {
    var child = parent.cssRules[index];
    Array.prototype.splice.call(parent.cssRules, index, 1);
    parent["didChange"](exports.cssParentDeleteRule(parent, child, index));
};
exports.getSEnvCSSRuleClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvCSSRuleList = collections_1.getSEnvCSSCollectionClasses(context).SEnvCSSRuleList;
    var SEnvBaseObjectClass = base_1.getSEnvCSSBaseObjectClass(context);
    var SEnvCSSRule = /** @class */ (function (_super) {
        __extends(SEnvCSSRule, _super);
        function SEnvCSSRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SEnvCSSRule.prototype, "cssText", {
            get: function () {
                return this.getCSSText();
            },
            set: function (value) {
                this.setCSSText(value);
                this._struct = undefined;
                // TODO - notify parent rune
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSRule.prototype, "parentRule", {
            get: function () {
                return this.$parentRule;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSRule.prototype, "parentStyleSheet", {
            get: function () {
                return this.$parentStyleSheet || (this.$parentRule && this.$parentRule.parentStyleSheet);
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSRule.prototype.didChange = function (mutation, notifyOwnerNode) {
            this._struct = undefined;
            if (this.parentRule) {
                this.parentRule.didChange(mutation, notifyOwnerNode);
            }
            else if (this.parentStyleSheet) {
                this.parentStyleSheet.didChange(mutation, notifyOwnerNode);
            }
        };
        return SEnvCSSRule;
    }(SEnvBaseObjectClass));
    var SEnvCSSStyleParentRule = /** @class */ (function (_super) {
        __extends(SEnvCSSStyleParentRule, _super);
        function SEnvCSSStyleParentRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SEnvCSSStyleParentRule;
    }(SEnvCSSRule));
    var SEnvCSSStyleRule = /** @class */ (function (_super) {
        __extends(SEnvCSSStyleRule, _super);
        function SEnvCSSStyleRule(selectorText, style) {
            var _this = _super.call(this) || this;
            _this.type = constants_2.CSSRuleType.STYLE_RULE;
            _this.selectorText = selectorText;
            _this.style = style;
            style.parentRule = _this;
            return _this;
        }
        Object.defineProperty(SEnvCSSStyleRule.prototype, "selectorText", {
            get: function () {
                return this._selectorText;
            },
            set: function (value) {
                this._selectorText = value;
                this.didChange(exports.cssStyleRuleSetSelectorText(this, value), true);
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSStyleRule.prototype.$createStruct = function () {
            return state_1.createSyntheticCSSStyleRule({
                $id: this.$id,
                source: this.source,
                instance: this,
                selectorText: this.selectorText,
                style: this.style.struct
            });
        };
        SEnvCSSStyleRule.prototype.getCSSText = function () {
            return this.selectorText + " { " + this.style.cssText + " }";
        };
        Object.defineProperty(SEnvCSSStyleRule.prototype, "previewCSSText", {
            get: function () {
                return this.selectorText + " { " + this.style.previewCSSText + " }";
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSStyleRule.prototype.setCSSText = function (value) {
            // NOTHING FOR NOW
        };
        SEnvCSSStyleRule.prototype.cloneDeep = function () {
            return new SEnvCSSStyleRule(this.selectorText, this.style.clone());
        };
        return SEnvCSSStyleRule;
    }(SEnvCSSStyleParentRule));
    var SEnvCSSGroupingRule = /** @class */ (function (_super) {
        __extends(SEnvCSSGroupingRule, _super);
        function SEnvCSSGroupingRule(rules) {
            if (rules === void 0) { rules = []; }
            var _this = _super.call(this) || this;
            _this.cssRules = new (SEnvCSSRuleList.bind.apply(SEnvCSSRuleList, [void 0].concat(rules)))();
            for (var i = rules.length; i--;) {
                rules[i].$parentRule = _this;
            }
            return _this;
        }
        SEnvCSSGroupingRule.prototype.getCSSText = function () {
            return null;
        };
        SEnvCSSGroupingRule.prototype.setCSSText = function (value) {
        };
        SEnvCSSGroupingRule.prototype.deleteRule = function (index) {
            return exports.cssDeleteRule(this, index);
        };
        SEnvCSSGroupingRule.prototype.insertRule = function (rule, index) {
            return exports.cssInsertRule(this, rule, index, context);
        };
        return SEnvCSSGroupingRule;
    }(SEnvCSSStyleParentRule));
    var SEnvMediaList = /** @class */ (function () {
        function SEnvMediaList(mediaText) {
            this.mediaText = mediaText;
            this.length = 0;
        }
        SEnvMediaList.prototype.item = function (index) {
            // throw new Error(`not implemented`);
            return null;
        };
        SEnvMediaList.prototype.appendMedium = function (value) {
            throw new Error("not implemented");
        };
        SEnvMediaList.prototype.deleteMedium = function (value) {
            throw new Error("not implemented");
        };
        return SEnvMediaList;
    }());
    var SEnvCSSMediaRule = /** @class */ (function (_super) {
        __extends(SEnvCSSMediaRule, _super);
        function SEnvCSSMediaRule(_conditionText, rules) {
            var _this = _super.call(this, rules) || this;
            _this._conditionText = _conditionText;
            _this.type = constants_2.CSSRuleType.MEDIA_RULE;
            _this.media = new SEnvMediaList(_this._conditionText);
            return _this;
        }
        Object.defineProperty(SEnvCSSMediaRule.prototype, "previewCSSText", {
            get: function () {
                return "@media " + this.conditionText + " { " + Array.prototype.map.call(this.cssRules, function (rule) { return rule.previewCSSText; }).join(" ") + " }";
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSMediaRule.prototype.getCSSText = function () {
            return "@media " + this.conditionText + " { " + Array.prototype.map.call(this.cssRules, function (rule) { return rule.cssText; }).join(" ") + " }";
        };
        SEnvCSSMediaRule.prototype.$createStruct = function () {
            return state_1.createSyntheticCSSMediaRule({
                $id: this.$id,
                instance: this,
                source: this.source,
                conditionText: this.conditionText,
                rules: Array.prototype.map.call(this.cssRules, function (rule) { return rule.struct; })
            });
        };
        Object.defineProperty(SEnvCSSMediaRule.prototype, "conditionText", {
            get: function () {
                return this._conditionText;
            },
            set: function (value) {
                this._conditionText = value;
                this.didChange(mediaRuleSetConditionText(this, value));
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSMediaRule.prototype.cloneDeep = function () {
            return new SEnvCSSMediaRule(this.conditionText, Array.prototype.map.call(this.cssRules, function (rule) { return rule.clone(); }));
        };
        return SEnvCSSMediaRule;
    }(SEnvCSSGroupingRule));
    var SEnvCSSFontFace = /** @class */ (function (_super) {
        __extends(SEnvCSSFontFace, _super);
        function SEnvCSSFontFace(style) {
            var _this = _super.call(this) || this;
            _this.type = constants_2.CSSRuleType.FONT_FACE_RULE;
            _this.style = style;
            style.parentRule = _this;
            style.$owner = _this;
            return _this;
        }
        Object.defineProperty(SEnvCSSFontFace.prototype, "previewCSSText", {
            get: function () {
                return "@font-face { " + this.style.previewCSSText + " }";
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSFontFace.prototype.getCSSText = function () {
            return "@font-face { " + this.style.cssText + " }";
        };
        SEnvCSSFontFace.prototype.$createStruct = function () {
            return state_1.createSyntheticCSSFontFaceRule({
                $id: this.$id,
                instance: this,
                source: this.source,
                style: this.style.struct,
            });
        };
        SEnvCSSFontFace.prototype.setCSSText = function (value) {
        };
        SEnvCSSFontFace.prototype.cloneDeep = function () {
            return new SEnvCSSFontFace(this.style.clone());
        };
        return SEnvCSSFontFace;
    }(SEnvCSSRule));
    var SEnvCSSKeyframeRule = /** @class */ (function (_super) {
        __extends(SEnvCSSKeyframeRule, _super);
        function SEnvCSSKeyframeRule(_keyText, style) {
            var _this = _super.call(this) || this;
            _this._keyText = _keyText;
            _this.type = constants_2.CSSRuleType.KEYFRAME_RULE;
            _this.style = style;
            return _this;
        }
        Object.defineProperty(SEnvCSSKeyframeRule.prototype, "keyText", {
            get: function () {
                return this._keyText;
            },
            set: function (value) {
                this._keyText = value;
                // this.didChange();
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSKeyframeRule.prototype.$createStruct = function () {
            return state_1.createSyntheticCSSKeyframeRule({
                $id: this.$id,
                instance: this,
                source: this.source
            });
        };
        Object.defineProperty(SEnvCSSKeyframeRule.prototype, "previewCSSText", {
            get: function () {
                return this.keyText + " { " + this.style.previewCSSText + " }";
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSKeyframeRule.prototype.getCSSText = function () {
            return this.keyText + " { " + this.style.cssText + " }";
        };
        SEnvCSSKeyframeRule.prototype.setCSSText = function (value) {
            throw new Error("Not implemented");
        };
        SEnvCSSKeyframeRule.prototype.cloneDeep = function () {
            return new SEnvCSSKeyframeRule(this._keyText, this.style.clone());
        };
        return SEnvCSSKeyframeRule;
    }(SEnvCSSRule));
    var SEnvCSSKeyframesRule = /** @class */ (function (_super) {
        __extends(SEnvCSSKeyframesRule, _super);
        function SEnvCSSKeyframesRule(name, rules) {
            if (rules === void 0) { rules = []; }
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.type = constants_2.CSSRuleType.FONT_FACE_RULE;
            _this.cssRules = new (SEnvCSSRuleList.bind.apply(SEnvCSSRuleList, [void 0].concat(rules)))();
            return _this;
        }
        SEnvCSSKeyframesRule.prototype.$createStruct = function () {
            return state_1.createSyntheticCSSKeyframesRule({
                $id: this.$id,
                instance: this,
                source: this.source,
                rules: Array.prototype.map.call(this.cssRules, function (rule) { return rule.struct; })
            });
        };
        Object.defineProperty(SEnvCSSKeyframesRule.prototype, "previewCSSText", {
            get: function () {
                return "@keyframes " + this.name + " { }";
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSKeyframesRule.prototype.getCSSText = function () {
            return "@keyframes " + this.name + " { " + Array.prototype.map.call(this.cssRules, function (rule) { return rule.cssText; }).join(" ") + " }";
        };
        SEnvCSSKeyframesRule.prototype.setCSSText = function (value) {
        };
        SEnvCSSKeyframesRule.prototype.appendRule = function (rule) {
        };
        SEnvCSSKeyframesRule.prototype.deleteRule = function (rule) {
        };
        SEnvCSSKeyframesRule.prototype.findRule = function (rule) {
            return null;
        };
        SEnvCSSKeyframesRule.prototype.cloneDeep = function () {
            return new SEnvCSSKeyframesRule(this.name, Array.prototype.map.call(this.cssRules, function (rule) { return rule.clone(); }));
        };
        return SEnvCSSKeyframesRule;
    }(SEnvCSSRule));
    var SEnvUnknownGroupingRule = /** @class */ (function (_super) {
        __extends(SEnvUnknownGroupingRule, _super);
        function SEnvUnknownGroupingRule() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = constants_2.CSSRuleType.UNKNOWN_RULE;
            return _this;
        }
        SEnvUnknownGroupingRule.prototype.getCSSText = function () {
            return "";
        };
        Object.defineProperty(SEnvUnknownGroupingRule.prototype, "previewCSSText", {
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        SEnvUnknownGroupingRule.prototype.$createStruct = function () {
            return state_1.createSyntheticCSSUnknownGroupingRule({
                $id: this.$id,
                instance: this,
                source: this.source,
                rules: []
            });
        };
        SEnvUnknownGroupingRule.prototype.setCSSText = function (value) {
        };
        SEnvUnknownGroupingRule.prototype.cloneDeep = function () {
            return new SEnvUnknownGroupingRule();
        };
        return SEnvUnknownGroupingRule;
    }(SEnvCSSGroupingRule));
    return {
        SEnvCSSStyleRule: SEnvCSSStyleRule,
        SEnvCSSMediaRule: SEnvCSSMediaRule,
        SEnvCSSKeyframesRule: SEnvCSSKeyframesRule,
        SEnvCSSFontFace: SEnvCSSFontFace,
        SEnvUnknownGroupingRule: SEnvUnknownGroupingRule
    };
});
exports.cssStyleRuleSetSelectorText = function (rule, selectorText) { return source_mutation_1.createSetValueMutation(constants_1.CSS_STYLE_RULE_SET_SELECTOR_TEXT, rule, selectorText); };
exports.cssStyleRuleSetStyle = function (rule, style) { return source_mutation_1.createSetValueMutation(constants_1.CSS_STYLE_RULE_SET_STYLE, rule, style.cssText); };
exports.cssStyleRuleSetStyleProperty = function (rule, name, value) { return source_mutation_1.createPropertyMutation(constants_1.CSS_STYLE_RULE_SET_STYLE_PROPERTY, rule, name, value); };
var diffStyleRule = function (oldRule, newRule) {
    var mutations = [];
    if (oldRule.selectorText !== newRule.selectorText) {
        mutations.push(exports.cssStyleRuleSetSelectorText(oldRule, newRule.selectorText));
    }
    mutations.push.apply(mutations, declaration_1.diffCSStyleDeclaration(oldRule.style, newRule.style));
    return mutations;
};
exports.cssParentInsertRule = function (parent, rule, newIndex) { return source_mutation_1.createInsertChildMutation(constants_1.CSS_PARENT_INSERT_RULE, parent, rule, newIndex); };
exports.cssParentDeleteRule = function (parent, rule, index) { return source_mutation_1.createRemoveChildMutation(constants_1.CSS_PARENT_DELETE_RULE, parent, rule, index); };
exports.cssParentMoveRule = function (parent, rule, newIndex, oldIndex) { return source_mutation_1.createMoveChildMutation(constants_1.CSS_PARENT_MOVE_RULE, parent, rule, newIndex, oldIndex); };
exports.diffCSSParentObject = function (oldParent, newParent) {
    var mutations = [];
    var oldSheetRules = Array.prototype.slice.call(oldParent.cssRules);
    var diffs = source_mutation_1.diffArray(oldSheetRules, Array.prototype.slice.call(newParent.cssRules), exports.compareCSSRule);
    source_mutation_1.eachArrayValueMutation(diffs, {
        insert: function (_a) {
            var value = _a.value, index = _a.index;
            mutations.push(exports.cssParentInsertRule(oldParent, value, index));
        },
        delete: function (_a) {
            var value = _a.value, index = _a.index;
            mutations.push(exports.cssParentDeleteRule(oldParent, value, index));
        },
        update: function (_a) {
            var newValue = _a.newValue, patchedOldIndex = _a.patchedOldIndex, index = _a.index, originalOldIndex = _a.originalOldIndex;
            if (patchedOldIndex !== index) {
                mutations.push(exports.cssParentMoveRule(oldParent, newValue, index, patchedOldIndex));
            }
            mutations.push.apply(mutations, exports.diffCSSRule(oldSheetRules[originalOldIndex], newValue));
        }
    });
    return mutations;
};
exports.CSS_MEDIA_RULE_SET_CONDITION_TEXT = "CSS_MEDIA_RULE_SET_CONDITION_TEXT";
var mediaRuleSetConditionText = function (rule, conditionText) { return source_mutation_1.createSetValueMutation(exports.CSS_MEDIA_RULE_SET_CONDITION_TEXT, rule, conditionText); };
var diffMediaRule = function (oldRule, newRule) {
    var mutations = [];
    if (oldRule.conditionText !== newRule.conditionText) {
        mutations.push(mediaRuleSetConditionText(oldRule, newRule.conditionText));
    }
    mutations.push.apply(mutations, exports.diffCSSParentObject(oldRule, newRule));
    return mutations;
};
exports.diffCSSRule = function (oldRule, newRule) {
    if (oldRule.type === constants_2.CSSRuleType.STYLE_RULE) {
        return diffStyleRule(oldRule, newRule);
    }
    else if (oldRule.type === constants_2.CSSRuleType.MEDIA_RULE) {
        return diffMediaRule(oldRule, newRule);
    }
    return [];
};
exports.cssStyleRuleMutators = __assign({}, declaration_1.cssStyleDeclarationMutators, (_a = {}, _a[constants_1.CSS_STYLE_RULE_SET_SELECTOR_TEXT] = function (target, mutation) {
    target.selectorText = mutation.newValue;
}, _a[constants_1.CSS_STYLE_RULE_SET_STYLE] = function (target, _a) {
    var style = _a.newValue;
    while (target.style.length) {
        target.style.removeProperty(target.style[0]);
    }
    var props = declaration_1.parseStyleSource(style);
    for (var prop in props) {
        target.style.setProperty(prop, props[prop]);
    }
}, _a[constants_1.CSS_STYLE_RULE_SET_STYLE_PROPERTY] = function (target, _a) {
    var name = _a.name, newValue = _a.newValue;
    target.style.setProperty(name, newValue);
}, _a));
exports.cssMediaRuleMutators = (_b = {},
    _b[exports.CSS_MEDIA_RULE_SET_CONDITION_TEXT] = function (target, mutation) {
        target.conditionText = mutation.newValue;
    },
    _b);
exports.cssRuleMutators = __assign({}, exports.cssStyleRuleMutators, exports.cssMediaRuleMutators);
exports.cssParentMutators = __assign({}, exports.cssRuleMutators, (_c = {}, _c[constants_1.CSS_PARENT_INSERT_RULE] = function (target, mutation) {
    target.insertRule(mutation.child.cssText, mutation.index);
}, _c[constants_1.CSS_PARENT_MOVE_RULE] = function (target, mutation) {
    var child = target.cssRules[mutation.oldIndex];
    target.deleteRule(mutation.oldIndex);
    target.insertRule(child, mutation.index);
}, _c[constants_1.CSS_PARENT_DELETE_RULE] = function (target, mutation) {
    target.deleteRule(mutation.index);
}, _c));
exports.flattenCSSRuleSources = aerial_common2_1.weakMemo(function (rule) {
    var flattened = (_a = {}, _a[rule.$id] = rule.instance, _a);
    if (rule.$type === state_1.SYNTHETIC_CSS_STYLE_RULE) {
        var styleRule = rule;
        flattened[styleRule.style.$id] = styleRule.style.instance;
    }
    else if (rule.$type === state_1.SYNTHETIC_CSS_FONT_FACE_RULE) {
        var styleRule = rule;
        flattened[styleRule.style.$id] = styleRule.style.instance;
    }
    else if (rule["rules"]) {
        var groupingRule = rule;
        for (var i = groupingRule.rules.length; i--;) {
            Object.assign(flattened, exports.flattenCSSRuleSources(groupingRule.rules[i]));
        }
    }
    else {
        throw new Error("Cannot flatten " + rule.$type);
    }
    return flattened;
    var _a;
});
exports.compareCSSRule = function (a, b) {
    if (a.type !== b.type) {
        return -1;
    }
    if (a.cssText === b.cssText) {
        return 0;
    }
    if (a.type === constants_2.CSSRuleType.STYLE_RULE) {
        var a2 = a;
        var b2 = b;
        if (a2.selectorText === b2.selectorText) {
            return 0;
        }
        return 1;
    }
    else if (a.type === constants_2.CSSRuleType.MEDIA_RULE) {
    }
    else if (a.type === constants_2.CSSRuleType.FONT_FACE_RULE) {
    }
    else if (a.type === constants_2.CSSRuleType.KEYFRAMES_RULE) {
    }
    else if (a.type === constants_2.CSSRuleType.KEYFRAME_RULE) {
    }
    else if (a.type === constants_2.CSSRuleType.UNKNOWN_RULE) {
    }
    return 1;
};
var _a, _b, _c;
//# sourceMappingURL=rules.js.map