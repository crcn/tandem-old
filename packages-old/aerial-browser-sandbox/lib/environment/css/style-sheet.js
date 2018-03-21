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
var utils_1 = require("./utils");
var state_1 = require("../../state");
var rules_1 = require("./rules");
var aerial_common2_1 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
var collections_1 = require("./collections");
var base_1 = require("./base");
exports.getSEnvCSSStyleSheetClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvCSSRuleList = collections_1.getSEnvCSSCollectionClasses(context).SEnvCSSRuleList;
    var SEnvCSSBaseObject = base_1.getSEnvCSSBaseObjectClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvCSSStyleSheet, _super);
        function SEnvCSSStyleSheet(rules) {
            if (rules === void 0) { rules = []; }
            var _this = _super.call(this) || this;
            _this._reset(rules);
            return _this;
        }
        Object.defineProperty(SEnvCSSStyleSheet.prototype, "cssText", {
            get: function () {
                return Array.prototype.map.call(this.cssRules, function (rule) { return rule.cssText; }).join(" ");
            },
            set: function (value) {
                var styleSheet = utils_1.evaluateCSS(value, this.href, context, this.ownerNode && this.ownerNode.source && this.ownerNode.source.fingerprint);
                this.source = styleSheet.source;
                this._reset(styleSheet.cssRules);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSStyleSheet.prototype, "previewCSSText", {
            get: function () {
                return Array.prototype.map.call(this.cssRules, function (rule) { return rule.previewCSSText; }).join(" ");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSStyleSheet.prototype, "rules", {
            get: function () {
                return this._rules;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSStyleSheet.prototype, "cssRules", {
            get: function () {
                return this._rules;
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSStyleSheet.prototype.$createStruct = function () {
            return state_1.createSyntheticCSSStyleSheet({
                $id: this.$id,
                instance: this,
                source: this.source,
                cssRules: Array.prototype.map.call(this.cssRules, (function (rule) { return rule.struct; }))
            });
        };
        SEnvCSSStyleSheet.prototype._reset = function (rules) {
            if (rules === void 0) { rules = []; }
            this._rules = new (SEnvCSSRuleList.bind.apply(SEnvCSSRuleList, [void 0].concat(rules)))();
            for (var i = rules.length; i--;) {
                rules[i].$parentStyleSheet = this;
            }
        };
        SEnvCSSStyleSheet.prototype.addImport = function (bstrURL, lIndex) {
            throw new Error("not currently supported");
        };
        SEnvCSSStyleSheet.prototype.addPageRule = function (bstrSelector, bstrStyle, lIndex) {
            throw new Error("not currently supported");
        };
        SEnvCSSStyleSheet.prototype.addRule = function (bstrSelector, bstrStyle, lIndex) {
            throw new Error("not currently supported");
        };
        SEnvCSSStyleSheet.prototype.deleteRule = function (index) {
            return rules_1.cssDeleteRule(this, index);
        };
        SEnvCSSStyleSheet.prototype.insertRule = function (rule, index) {
            return rules_1.cssInsertRule(this, rule, index, context);
        };
        SEnvCSSStyleSheet.prototype.removeImport = function (lIndex) {
            throw new Error("not currently supported");
        };
        SEnvCSSStyleSheet.prototype.removeRule = function (lIndex) {
            return rules_1.cssDeleteRule(this, lIndex);
        };
        SEnvCSSStyleSheet.prototype.didChange = function (mutation, notifyOwnerNode) {
            this._struct = undefined;
            if (notifyOwnerNode !== false && this.ownerNode) {
                this.ownerNode.dispatchMutationEvent(mutation);
            }
        };
        SEnvCSSStyleSheet.prototype.clone = function () {
            return _super.prototype.clone.call(this);
        };
        SEnvCSSStyleSheet.prototype.cloneDeep = function () {
            var clone = new SEnvCSSStyleSheet(Array.prototype.map.call(this.rules, (function (rule) { return rule.clone(); })));
            clone.href = this.href;
            return clone;
        };
        return SEnvCSSStyleSheet;
    }(SEnvCSSBaseObject));
});
exports.STYLE_SHEET_INSERT_RULE = "STYLE_SHEET_INSERT_RULE";
exports.STYLE_SHEET_DELETE_RULE = "STYLE_SHEET_DELETE_RULE";
exports.STYLE_SHEET_MOVE_RULE = "STYLE_SHEET_MOVE_RULE";
exports.cssStyleSheetMutators = __assign({}, rules_1.cssParentMutators);
exports.styleSheetInsertRule = function (styleSheet, rule, newIndex) { return source_mutation_1.createInsertChildMutation(exports.STYLE_SHEET_MOVE_RULE, styleSheet, rule, newIndex); };
exports.styleSheetDeleteRule = function (styleSheet, rule, newIndex, index) { return source_mutation_1.createRemoveChildMutation(exports.STYLE_SHEET_MOVE_RULE, styleSheet, rule, index); };
exports.styleSheetMoveRule = function (styleSheet, rule, newIndex, oldIndex) { return source_mutation_1.createMoveChildMutation(exports.STYLE_SHEET_MOVE_RULE, styleSheet, rule, newIndex, oldIndex); };
exports.diffCSSStyleSheet = function (oldSheet, newSheet) {
    return rules_1.diffCSSParentObject(oldSheet, newSheet);
};
exports.flattenSyntheticCSSStyleSheetSources = aerial_common2_1.weakMemo(function (sheet) {
    var flattened = (_a = {}, _a[sheet.$id] = sheet.instance, _a);
    for (var i = 0, n = sheet.cssRules.length; i < n; i++) {
        Object.assign(flattened, rules_1.flattenCSSRuleSources(sheet.cssRules[i]));
    }
    return flattened;
    var _a;
});
exports.patchCSSStyleSheet = function (target, mutation) {
    var mutate = exports.cssStyleSheetMutators[mutation.type];
    if (!mutate) {
        throw new Error("Cannot apply mutation " + mutation.type + " on CSS object");
    }
    return mutate(target, mutation);
};
//# sourceMappingURL=style-sheet.js.map