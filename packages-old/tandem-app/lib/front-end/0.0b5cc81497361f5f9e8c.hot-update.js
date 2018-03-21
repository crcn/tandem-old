webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/src/environment/css/declaration.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/utils.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
exports.isValidCSSDeclarationProperty = function (property) { return !/^([\$_]|\d+$)/.test(property.charAt(0)) && !/^(uid|\$id|_struct|struct|parentRule|disabledProperties|_onChange|length)$/.test(property); };
var getJSPropName = function (name) {
    // if --, then it's a var, or vendor prefix
    return name.substr(0, 2) === "--" ? name : lodash_1.camelCase(name);
};
exports.cssPropNameToKebabCase = function (propName) {
    propName = propName.substr(0, 2) === "--" ? propName : lodash_1.kebabCase(propName);
    // vendor prefix
    if (/^(webkit|moz|ms|o)-/.test(propName)) {
        propName = "-" + propName;
    }
    return propName;
};
var NO_STYLE_MATCH = [null, null, null];
exports.parseStyleSource = function (source) {
    var props = {};
    source.split(";").forEach(function (decl) {
        // use regexp here to ensure that : that are part of the declaration value stay in tact
        var _a = decl.match(/(.+?):(.+)/) || NO_STYLE_MATCH, match = _a[0], key = _a[1], value = _a[2];
        if (!key || !value.length)
            return;
        var ccKey = getJSPropName(key.trim());
        props[ccKey] = value.trim();
    });
    return props;
};
exports.getSEnvCSSStyleDeclarationClass = aerial_common2_1.weakMemo(function (_a) {
    var _b = _a.getProxyUrl, getProxyUrl = _b === void 0 ? lodash_1.identity : _b;
    return /** @class */ (function () {
        function SEnvCSSStyleDeclaration(_onChange) {
            this._onChange = _onChange;
            this.$id = aerial_common2_1.generateDefaultId();
        }
        Object.defineProperty(SEnvCSSStyleDeclaration.prototype, "struct", {
            get: function () {
                if (this._struct) {
                    return this._struct;
                }
                var props = {};
                for (var i = 0; i < this.length; i++) {
                    props[i] = this[i];
                    props[this[i]] = this[this[i]];
                }
                return this._struct = state_1.createSyntheticCSSStyleDeclaration(__assign({ $id: this.$id, instance: this, length: this.length, disabledPropertyNames: this.disabledProperties && __assign({}, this.disabledProperties) }, props));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSStyleDeclaration.prototype, "length", {
            get: function () {
                return this.$length || 0;
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSStyleDeclaration.prototype.toggle = function (propertyName) {
            if (!this.disabledProperties) {
                this.disabledProperties = {};
            }
            if (this.disabledProperties[propertyName]) {
                this.setProperty(propertyName, this.disabledProperties[propertyName]);
                this.disabledProperties[propertyName] = undefined;
            }
            else {
                this.disabledProperties[propertyName] = this[propertyName];
                this.setProperty(propertyName, "");
            }
        };
        Object.defineProperty(SEnvCSSStyleDeclaration.prototype, "cssText", {
            get: function () {
                var buffer = [];
                for (var i = 0, n = this.length; i < n; i++) {
                    var key = this[i];
                    var value = this[key] || this.disabledProperties[key];
                    if (value) {
                        buffer.push(exports.cssPropNameToKebabCase(key), ": ", value, ";");
                    }
                }
                return buffer.join("");
            },
            set: function (value) {
                var props = exports.parseStyleSource(value);
                this.disabledProperties = {};
                for (var i = 0, n = this.length; i < n; i++) {
                    this[this[i]] = undefined;
                }
                Object.assign(this, props);
                this.$updatePropertyIndices();
                this.didChange(exports.cssStyleDeclarationSetProperties(this, props), true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSStyleDeclaration.prototype, "previewCSSText", {
            get: function () {
                var buffer = [];
                var _loop_1 = function (i, n) {
                    var key = this_1[i];
                    var value = this_1[key];
                    if (value) {
                        if (/url\(.*\)/.test(value)) {
                            var styleSheetHref_1 = this_1.parentRule.parentStyleSheet.href;
                            value = value.replace(/url\(.*?\)/g, function (token) {
                                var href = token.match(/url\(["']?(.*?)["']?\)/)[1];
                                var url = utils_1.getUri(href, styleSheetHref_1);
                                return "url(\"" + getProxyUrl(url) + "\")";
                            });
                        }
                        buffer.push(exports.cssPropNameToKebabCase(key), ": ", value, ";");
                    }
                };
                var this_1 = this;
                for (var i = 0, n = this.length; i < n; i++) {
                    _loop_1(i, n);
                }
                return buffer.join("");
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSStyleDeclaration.fromString = function (source) {
            var decl = new SEnvCSSStyleDeclaration();
            Object.assign(decl, exports.parseStyleSource(source));
            decl.$updatePropertyIndices();
            return decl;
        };
        SEnvCSSStyleDeclaration.fromObject = function (declaration) {
            var decl = new SEnvCSSStyleDeclaration();
            if (declaration.length != null) {
                for (var i = 0, n = declaration.length; i < n; i++) {
                    var key = declaration[i];
                    decl[key] = declaration[key];
                }
                decl.$updatePropertyIndices();
            }
            else {
                for (var key in declaration) {
                    if (exports.isValidCSSDeclarationProperty(key)) {
                        decl[getJSPropName(key)] = declaration[key];
                    }
                }
                decl.$updatePropertyIndices();
            }
            return decl;
        };
        SEnvCSSStyleDeclaration.prototype.didChange = function (mutation, notifyOwnerNode) {
            this._struct = undefined;
            if (this.parentRule) {
                this.parentRule.didChange(mutation, notifyOwnerNode);
            }
            if (this._onChange) {
                this._onChange();
            }
        };
        SEnvCSSStyleDeclaration.prototype.getPropertyPriority = function (propertyName) {
            return null;
        };
        SEnvCSSStyleDeclaration.prototype.getPropertyValue = function (propertyName) {
            return null;
        };
        SEnvCSSStyleDeclaration.prototype.item = function (index) {
            return null;
        };
        SEnvCSSStyleDeclaration.prototype.removeProperty = function (propertyName) {
            this.setProperty(propertyName, null, null);
            return null;
        };
        SEnvCSSStyleDeclaration.prototype.getProperties = function () {
            var props = [];
            for (var i = 0, n = this.length || 0; i < n; i++) {
                props.push(this[i]);
            }
            return props;
        };
        SEnvCSSStyleDeclaration.prototype.getPropertyIndex = function (name) {
            return this.getProperties().indexOf(name);
        };
        SEnvCSSStyleDeclaration.prototype.setProperty = function (name, newValue, priority, oldName, notifyOwnerNode) {
            if (notifyOwnerNode === void 0) { notifyOwnerNode = true; }
            if (!exports.isValidCSSDeclarationProperty(name))
                return false;
            // fix in case they"re kebab case
            name = getJSPropName(name);
            oldName = oldName != null ? getJSPropName(oldName) : oldName;
            var index = oldName ? this.getPropertyIndex(oldName) : this.getPropertyIndex(name);
            // ensure that internal keys are not set
            if (!/^\$/.test(name)) {
                this[~index ? index : this.length] = name;
            }
            if (name != null) {
                this[name] = newValue;
            }
            if (oldName != null) {
                this[oldName] = undefined;
            }
            this.$updatePropertyIndices();
            this.didChange(exports.cssStyleDeclarationSetProperty(this, name, newValue), notifyOwnerNode);
        };
        SEnvCSSStyleDeclaration.prototype.$updatePropertyIndices = function () {
            var model = {};
            for (var i_1 = 0; i_1 < this.length; i_1++) {
                var key = this[i_1];
                var value = this[key];
                if (value != null) {
                    model[key + ""] = value;
                }
                // reset for now
                this[i_1] = undefined;
            }
            for (var key in this) {
                if (!this.hasOwnProperty(key) || !exports.isValidCSSDeclarationProperty(key))
                    continue;
                if (this[key] == null)
                    continue;
                model[key + ""] = this[key];
            }
            var i = 0;
            for (var key in model) {
                this[i++] = key;
            }
            this.$length = Object.keys(model).length;
        };
        SEnvCSSStyleDeclaration.prototype.clone = function () {
            return SEnvCSSStyleDeclaration.fromObject(this);
        };
        return SEnvCSSStyleDeclaration;
    }());
});
exports.CSS_STYLE_DECLARATION_SET_PROPERTY = "CSS_STYLE_DECLARATION_SET_PROPERTY";
exports.CSS_STYLE_DECLARATION_RESET_PROPERTIES = "CSS_STYLE_DECLARATION_RESET_PROPERTIES";
exports.cssStyleDeclarationMutators = (_a = {},
    _a[exports.CSS_STYLE_DECLARATION_SET_PROPERTY] = function (target, mutation) {
        if (!mutation.newValue) {
            target.removeProperty(exports.cssPropNameToKebabCase(mutation.name));
        }
        else {
            target.setProperty(exports.cssPropNameToKebabCase(mutation.name), mutation.newValue, null, null, true);
        }
    },
    _a[exports.CSS_STYLE_DECLARATION_RESET_PROPERTIES] = function (target, mutation) {
        for (var property in target) {
            if (exports.isValidCSSDeclarationProperty(property)) {
                target[property] = undefined;
            }
        }
        for (var propery in mutation.newValue) {
            target[propery] = mutation.newValue[propery];
        }
        target.$updatePropertyIndices();
    },
    _a);
exports.cssStyleDeclarationSetProperty = function (target, key, value) { return source_mutation_1.createPropertyMutation(exports.CSS_STYLE_DECLARATION_SET_PROPERTY, target, key, value); };
exports.cssStyleDeclarationSetProperties = function (target, properties) { return source_mutation_1.createSetValueMutation(exports.CSS_STYLE_DECLARATION_RESET_PROPERTIES, target, properties); };
exports.diffCSStyleDeclaration = function (oldStyle, newStyle) {
    var oldKeys = Object.keys(oldStyle).filter(exports.isValidCSSDeclarationProperty);
    var newKeys = Object.keys(newStyle).filter(exports.isValidCSSDeclarationProperty);
    var diffs = source_mutation_1.diffArray(oldKeys, newKeys, function (a, b) { return a === b ? 0 : -1; });
    var mutations = [];
    source_mutation_1.eachArrayValueMutation(diffs, {
        insert: function (_a) {
            var key = _a.value;
            mutations.push(exports.cssStyleDeclarationSetProperty(oldStyle, key, newStyle[key]));
        },
        delete: function (_a) {
            var key = _a.value;
            mutations.push(exports.cssStyleDeclarationSetProperty(oldStyle, key, undefined));
        },
        update: function (_a) {
            var key = _a.newValue;
            if (oldStyle[key] !== newStyle[key]) {
                mutations.push(exports.cssStyleDeclarationSetProperty(oldStyle, key, newStyle[key]));
            }
        }
    });
    return mutations;
};
var _a;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/declaration.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/declaration.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/css/rules.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/constants.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
var declaration_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/declaration.ts");
var base_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/base.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/collections.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/utils.ts");
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/rules.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/rules.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/css/style-sheet.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/utils.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
var rules_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/rules.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/collections.ts");
var base_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/base.ts");
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/style-sheet.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/style-sheet.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/collections.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var base_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/base/index.ts");
exports.getSEnvHTMLCollectionClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var _Collection = base_1.getSEnvCollection(context);
    var SEnvStyleSheetList = /** @class */ (function (_super) {
        __extends(SEnvStyleSheetList, _super);
        function SEnvStyleSheetList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvStyleSheetList.prototype.item = function (index) {
            return this[index];
        };
        return SEnvStyleSheetList;
    }(_Collection));
    var SEnvDOMStringMap = /** @class */ (function () {
        function SEnvDOMStringMap() {
        }
        return SEnvDOMStringMap;
    }());
    var SEnvHTMLAllCollection = /** @class */ (function (_super) {
        __extends(SEnvHTMLAllCollection, _super);
        function SEnvHTMLAllCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvHTMLAllCollection.prototype.item = function (nameOrIndex) {
            return this.namedItem(nameOrIndex) || this[nameOrIndex];
        };
        SEnvHTMLAllCollection.prototype.namedItem = function (name) {
            return this.find(function (element) { return element.getAttribute("name") === name; });
        };
        return SEnvHTMLAllCollection;
    }(_Collection));
    var SEnvDOMTokenList = /** @class */ (function (_super) {
        __extends(SEnvDOMTokenList, _super);
        function SEnvDOMTokenList(value, _onChange) {
            var _this = _super.apply(this, value.split(" ")) || this;
            _this._onChange = _onChange;
            return _this;
        }
        SEnvDOMTokenList.prototype.add = function () {
            var token = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                token[_i] = arguments[_i];
            }
            this.push.apply(this, token);
            this._onChange(this.toString());
        };
        SEnvDOMTokenList.prototype.contains = function (token) {
            return this.indexOf(token) !== -1;
        };
        SEnvDOMTokenList.prototype.item = function (index) {
            return this[index];
        };
        SEnvDOMTokenList.prototype.remove = function () {
            var token = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                token[_i] = arguments[_i];
            }
            for (var i = token.length; i--;) {
                var i2 = this.indexOf(token[i]);
                if (i2 !== -1) {
                    this.splice(i, 1);
                }
            }
            this._onChange();
        };
        SEnvDOMTokenList.prototype.toggle = function (token, force) {
            if (this.indexOf(token) === -1) {
                this.add(token);
                return true;
            }
            else {
                this.remove(token);
                return false;
            }
        };
        SEnvDOMTokenList.prototype.toString = function () {
            return this.join(" ");
        };
        return SEnvDOMTokenList;
    }(_Collection));
    var SEnvHTMLCollection = /** @class */ (function (_super) {
        __extends(SEnvHTMLCollection, _super);
        function SEnvHTMLCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvHTMLCollection.prototype.$init = function (target) {
            this._target = target;
            this._stale = true;
            target.addEventListener(SEnvMutationEvent.MUTATION, this.__onChildMutation.bind(this));
            return this;
        };
        SEnvHTMLCollection.prototype.update = function () {
            var _this = this;
            if (this._stale) {
                this._stale = false;
                var diff = source_mutation_1.diffArray(this, Array.prototype.filter.call(this._target.childNodes, function (a) { return a.nodeType === constants_1.SEnvNodeTypes.ELEMENT; }), function (a, b) { return a === b ? 0 : -1; });
                source_mutation_1.eachArrayValueMutation(diff, {
                    insert: function (_a) {
                        var value = _a.value, index = _a.index;
                        _this.splice(index, 0, value);
                    },
                    delete: function (_a) {
                        var index = _a.index;
                        _this.splice(index, 1);
                    },
                    update: function () {
                    }
                });
            }
            return this;
        };
        SEnvHTMLCollection.prototype.namedItem = function (name) {
            return this.find(function (element) { return element.getAttribute("name") === name; });
        };
        SEnvHTMLCollection.prototype.item = function (index) {
            return this[index];
        };
        SEnvHTMLCollection.prototype.__onChildMutation = function (event) {
            if (event.target !== this._target) {
                return;
            }
            this._stale = true;
        };
        return SEnvHTMLCollection;
    }(_Collection));
    var SEnvNodeList = /** @class */ (function (_super) {
        __extends(SEnvNodeList, _super);
        function SEnvNodeList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvNodeList.prototype.item = function (index) {
            return this[index];
        };
        return SEnvNodeList;
    }(_Collection));
    var SEnvNamedNodeMap = /** @class */ (function (_super) {
        __extends(SEnvNamedNodeMap, _super);
        function SEnvNamedNodeMap() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvNamedNodeMap.prototype.getNamedItem = function (name) {
            return this.find(function (attr) { return attr.name === name; });
        };
        SEnvNamedNodeMap.prototype.getNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.item = function (index) {
            return this[index];
        };
        SEnvNamedNodeMap.prototype.removeNamedItem = function (name) {
            var attr = this.getNamedItem(name);
            if (attr) {
                this.splice(this.indexOf(attr), 1);
            }
            return attr;
        };
        SEnvNamedNodeMap.prototype.removeNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.setNamedItem = function (arg) {
            var existing = this.getNamedItem(arg.name);
            if (existing) {
                existing.value = arg.value;
            }
            else {
                this.push(arg);
                this[arg.name] = arg;
            }
            return existing;
        };
        SEnvNamedNodeMap.prototype.setNamedItemNS = function (arg) {
            return null;
        };
        return SEnvNamedNodeMap;
    }(_Collection));
    return {
        SEnvNodeList: SEnvNodeList,
        SEnvDOMTokenList: SEnvDOMTokenList,
        SEnvNamedNodeMap: SEnvNamedNodeMap,
        SEnvDOMStringMap: SEnvDOMStringMap,
        SEnvHTMLCollection: SEnvHTMLCollection,
        SEnvStyleSheetList: SEnvStyleSheetList,
        SEnvHTMLAllCollection: SEnvHTMLAllCollection,
    };
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/collections.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/collections.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/comment.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
exports.getSEnvCommentClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvValueNode = node_1.getSEnvValueNode(context);
    return /** @class */ (function (_super) {
        __extends(SEnvComment, _super);
        function SEnvComment() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.COMMENT;
            _this.structType = state_1.SYNTHETIC_COMMENT;
            _this.nodeName = "#comment";
            return _this;
        }
        Object.defineProperty(SEnvComment.prototype, "data", {
            get: function () {
                return this.nodeValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvComment.prototype, "text", {
            get: function () {
                return this.nodeValue;
            },
            enumerable: true,
            configurable: true
        });
        SEnvComment.prototype.cloneShallow = function () {
            var clone = this.ownerDocument.createComment(this.nodeValue);
            return clone;
        };
        SEnvComment.prototype.appendData = function (arg) { };
        SEnvComment.prototype.deleteData = function (offset, count) { };
        SEnvComment.prototype.insertData = function (offset, arg) { };
        SEnvComment.prototype.replaceData = function (offset, count, arg) { };
        SEnvComment.prototype.substringData = function (offset, count) {
            return null;
        };
        return SEnvComment;
    }(SEnvValueNode));
});
exports.diffComment = function (oldComment, newComment) {
    return node_1.diffValueNode(oldComment, newComment);
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/comment.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/comment.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/document.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
var parent_node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts");
var level3_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/level3/index.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
var text_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/text.ts");
var light_document_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/light-document.ts");
var comment_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/comment.ts");
var html_elements_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/html-elements.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/utils.ts");
var source_1 = __webpack_require__("../aerial-browser-sandbox/src/utils/source.ts");
var fragment_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/fragment.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
var CONSUME_TIMEOUT = 10;
exports.getSEnvDOMImplementationClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvDocument = exports.getSEnvDocumentClass(context);
    var SEnvDOMImplementation = /** @class */ (function () {
        function SEnvDOMImplementation(_view) {
            this._view = _view;
        }
        SEnvDOMImplementation.prototype.createDocument = function (namespaceURI, qualifiedName, doctype) {
            throw new Error("Unsupported");
        };
        SEnvDOMImplementation.prototype.createDocumentType = function (qualifiedName, publicId, systemId) {
            throw new Error("Unsupported");
        };
        SEnvDOMImplementation.prototype.createHTMLDocument = function (title) {
            var document = new SEnvDocument(this._view);
            document.appendChild(document.createElement("html"));
            document.documentElement.appendChild(document.createElement("head"));
            document.documentElement.appendChild(document.createElement("body"));
            return document;
        };
        SEnvDOMImplementation.prototype.hasFeature = function (feature, version) {
            return false;
        };
        return SEnvDOMImplementation;
    }());
    return SEnvDOMImplementation;
});
exports.getSEnvDocumentClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    var SEnvText = text_1.getSEnvTextClass(context);
    var SEnvComment = comment_1.getSEnvCommentClass(context);
    var SEnvMutationEvent = level3_1.getL3EventClasses(context).SEnvMutationEvent;
    var _a = events_1.getSEnvEventClasses(context), SEnvEvent = _a.SEnvEvent, SEnvMutationEvent2 = _a.SEnvMutationEvent;
    var SEnvDocumentFragment = fragment_1.getSEnvDocumentFragment(context);
    var SENvHTMLElement = html_elements_1.getSEnvHTMLElementClass(context);
    var _b = collections_1.getSEnvHTMLCollectionClasses(context), SEnvStyleSheetList = _b.SEnvStyleSheetList, SEnvHTMLAllCollection = _b.SEnvHTMLAllCollection;
    var LightDocument = light_document_1.getSenvLightDocumentClass(context);
    var eventMap = {
        MutationEvent: SEnvMutationEvent,
        Event: SEnvEvent,
        MouseEvent: SEnvEvent
    };
    var SEnvDocument = /** @class */ (function (_super) {
        __extends(SEnvDocument, _super);
        function SEnvDocument(defaultView) {
            var _this = _super.call(this) || this;
            _this.defaultView = defaultView;
            _this.structType = state_1.SYNTHETIC_DOCUMENT;
            _this.nodeType = constants_1.SEnvNodeTypes.DOCUMENT;
            _this.cookie = "";
            _this.nodeName = "#document";
            _this.implementation = defaultView.implementation;
            _this.addEventListener("readystatechange", function (e) { return _this.onreadystatechange && _this.onreadystatechange(e); });
            return _this;
        }
        Object.defineProperty(SEnvDocument.prototype, "links", {
            get: function () {
                return this.querySelectorAll("a,area");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "location", {
            get: function () {
                return this.defaultView.location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "all", {
            get: function () {
                return new (SEnvHTMLAllCollection.bind.apply(SEnvHTMLAllCollection, [void 0].concat(Array.from(this.querySelectorAll("*")))))();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "readyState", {
            get: function () {
                return this._readyState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "documentElement", {
            get: function () {
                return this.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "head", {
            get: function () {
                return this.documentElement.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "body", {
            get: function () {
                return this.documentElement.children[1];
            },
            enumerable: true,
            configurable: true
        });
        SEnvDocument.prototype.$load = function (content) {
            return __awaiter(this, void 0, void 0, function () {
                var expression, domContentLoadedEvent, e_1, loadEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.removeAllChildren();
                            // TODO - use sax parsing here instead
                            this.$$setReadyState("loading");
                            expression = utils_1.parseHTMLDocument(content);
                            return [4 /*yield*/, utils_1.mapExpressionToNode(expression, source_1.generateSourceHash(content), this, this, true)];
                        case 1:
                            _a.sent();
                            this.$$setReadyState("interactive");
                            domContentLoadedEvent = new SEnvEvent();
                            domContentLoadedEvent.initEvent("DOMContentLoaded", true, true);
                            this.dispatchEvent(domContentLoadedEvent);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, utils_1.whenLoaded(this)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _a.sent();
                            // catch anyways since we want to fire a load completion
                            this.defaultView.console.error(e_1);
                            return [3 /*break*/, 5];
                        case 5:
                            loadEvent = new SEnvEvent();
                            loadEvent.initEvent("load", true, true);
                            this.dispatchEvent(loadEvent);
                            this.$$setReadyState("complete");
                            return [2 /*return*/];
                    }
                });
            });
        };
        SEnvDocument.prototype.$$setReadyState = function (state) {
            if (this._readyState === state) {
                return;
            }
            this._readyState = state;
            var me = new SEnvMutationEvent2();
            me.initMutationEvent(createReadyStateChangeMutation(this, this.readyState));
            this.dispatchEvent(me);
            var event = new SEnvEvent();
            event.initEvent("readystatechange", true, true);
            this.dispatchEvent(event);
        };
        SEnvDocument.prototype.$$update = function () {
        };
        SEnvDocument.prototype.adoptNode = function (source) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.captureEvents = function () {
        };
        SEnvDocument.prototype.caretRangeFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.clear = function () {
        };
        SEnvDocument.prototype.close = function () {
        };
        SEnvDocument.prototype.createAttribute = function (name) {
            this._throwUnsupportedMethod();
            return null;
        };
        Object.defineProperty(SEnvDocument.prototype, "title", {
            get: function () {
                var titleEl = this.querySelector("title");
                return titleEl && titleEl.textContent;
            },
            enumerable: true,
            configurable: true
        });
        SEnvDocument.prototype.createStruct = function () {
            var titleEl = this.querySelector("title");
            return __assign({}, _super.prototype.createStruct.call(this), { title: this.title });
        };
        SEnvDocument.prototype.createAttributeNS = function (namespaceURI, qualifiedName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createCDATASection = function (data) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createComment = function (data) {
            return this.$$linkNode(new SEnvComment(data));
        };
        SEnvDocument.prototype.createDocumentFragment = function () {
            return this.$$linkNode(new SEnvDocumentFragment());
        };
        SEnvDocument.prototype.createEvent = function (eventInterface) {
            var eventClass = eventMap[eventInterface];
            if (!eventClass) {
                throw new Error("Unable to create new event for " + eventInterface);
            }
            return eventClass && Object.create(eventClass.prototype);
        };
        SEnvDocument.prototype.createElement = function (tagName) {
            return this.createElementNS(constants_1.HTML_XMLNS, tagName);
        };
        SEnvDocument.prototype.$$linkNode = function (node) {
            node["" + "$$setOwnerDocument"](this);
            return node;
        };
        SEnvDocument.prototype.createElementNS = function (namespaceURI, qualifiedName) {
            var elementClass = this.defaultView.customElements.get(qualifiedName) || SENvHTMLElement;
            return this.$$linkElement(new elementClass(), qualifiedName, namespaceURI);
        };
        SEnvDocument.prototype.$$linkElement = function (element, qualifiedName, namespaceURI) {
            this.$$linkNode(element);
            element["" + "tagName"] = qualifiedName;
            element["" + "nodeName"] = qualifiedName;
            element["" + "namespaceURI"] = namespaceURI;
            return element;
        };
        SEnvDocument.prototype.createExpression = function (expression, resolver) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createNodeIterator = function (root, whatToShowe, filter, entityReferenceExpansion) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createNSResolver = function (nodeResolver) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createProcessingInstruction = function (target, data) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createRange = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createTextNode = function (data) {
            return this.$$linkNode(new SEnvText(data));
        };
        SEnvDocument.prototype.createTouch = function (view, target, identifier, pageX, pageY, screenX, screenY) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createTouchList = function () {
            var touches = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                touches[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createTreeWalker = function (root, whatToShow, filter, entityReferenceExpansion) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.evaluate = function (expression, contextNode, resolver, type, result) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.execCommand = function (commandId, showUI, value) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.execCommandShowHelp = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.exitFullscreen = function () {
        };
        SEnvDocument.prototype.exitPointerLock = function () {
        };
        SEnvDocument.prototype.focus = function () {
        };
        SEnvDocument.prototype.hasFocus = function () {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.importNode = function (importedNode, deep) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.msElementsFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.msElementsFromRect = function (left, top, width, height) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.open = function (url, name, features, replace) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.queryCommandEnabled = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandIndeterm = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandState = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandSupported = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandText = function (commandId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.queryCommandValue = function (commandId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.releaseEvents = function () {
        };
        SEnvDocument.prototype.updateSettings = function () {
        };
        SEnvDocument.prototype.webkitCancelFullScreen = function () {
        };
        SEnvDocument.prototype.webkitExitFullscreen = function () {
        };
        SEnvDocument.prototype.write = function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
        };
        SEnvDocument.prototype.writeln = function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
        };
        return SEnvDocument;
    }(LightDocument));
    ;
    return SEnvDocument;
});
exports.READY_STATE_CHANGE = "READY_STATE_CHANGE";
exports.INSERT_STYLE_SHEET = "INSERT_STYLE_SHEET";
exports.REMOVE_STYLE_SHEET = "REMOVE_STYLE_SHEET";
exports.MOVE_STYLE_SHEET = "MOVE_STYLE_SHEET";
// export const createInsertStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index?: number) => createInsertChildMutation(INSERT_STYLE_SHEET, target, sheet, index);
// export const createRemoveStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index?: number) => createRemoveChildMutation(REMOVE_STYLE_SHEET, target, sheet, index);
// export const createMoveStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index: number, oldIndex) => createMoveChildMutation(MOVE_STYLE_SHEET, target, sheet, index, oldIndex);
var createReadyStateChangeMutation = function (target, readyState) { return source_mutation_1.createSetValueMutation(exports.READY_STATE_CHANGE, target, readyState); };
exports.diffDocument = function (oldDocument, newDocument) {
    var mutations = [];
    var endMutations = [];
    if (oldDocument.readyState !== newDocument.readyState) {
        endMutations.push(createReadyStateChangeMutation(oldDocument, newDocument.readyState));
    }
    // const cssDiffs = diffArray(
    //   Array.from(oldDocument.stylesheets), 
    //   Array.from(newDocument.stylesheets), 
    //   // TODO - check ids. cssText is a very poor rep here
    //   (a: CSSStyleSheet, b: CSSStyleSheet) => a.href === b.href ? 0 : a.cssText === b.cssText ? 0 : -1
    // );
    // eachArrayValueMutation(cssDiffs, {
    //   insert({ value, index }) {
    //     mutations.push(createRemoveStyleSheetMutation(oldDocument, value as CSSStyleSheet, index));
    //   },
    //   delete({ index }) {
    //     mutations.push(createRemoveStyleSheetMutation(oldDocument, oldDocument.stylesheets.item(index) as CSSStyleSheet, index));
    //   },
    //   update({ originalOldIndex, patchedOldIndex, newValue, index }) {
    //     if (patchedOldIndex !== index) {
    //       mutations.push(createMoveStyleSheetMutation(oldDocument, oldDocument.stylesheets.item(originalOldIndex) as CSSStyleSheet, index, patchedOldIndex));
    //     }
    //     // TODO - diff & patch style sheet 
    //     // const oldValue = originalOldIndex.childNodes[originalOldIndex];
    //     // mutations.push(...diffChildNode(oldValue, newValue));
    //   }
    // })
    return mutations.concat(parent_node_1.diffParentNode(oldDocument, newDocument, html_elements_1.diffHTMLNode), endMutations);
};
exports.documentMutators = __assign({}, parent_node_1.parentNodeMutators, html_elements_1.baseHTMLElementMutators, (_a = {}, _a[exports.READY_STATE_CHANGE] = function (target, mutation) {
    if (target.$$setReadyState) {
        target.$$setReadyState(mutation.newValue);
    }
}, _a));
exports.flattenDocumentSources = function (document) {
    return html_elements_1.flattenNodeSources(document);
};
// export const patchDocument = (oldDocument: SEnvDocumentInterface, mutation: Mutation<any>) => {
//   patchParentNode(oldDocument, mutation);
//   if (mutation.$type === READY_STATE_CHANGE) {
//     oldDocument.$$setReadyState((mutation as SetValueMutation<SEnvDocumentInterface>).newValue);
//   }
// };
exports.waitForDocumentComplete = function (window) { return new Promise(function (resolve) {
    if (window.document.readyState === "complete") {
        return resolve();
    }
    window.document.addEventListener("readystatechange", function () {
        if (window.document.readyState === "complete") {
            resolve();
        }
    });
}); };
var _a;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/document.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/document.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/element.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var comment_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/comment.ts");
var text_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/text.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var parent_node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var light_document_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/light-document.ts");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/utils.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
exports.getSEnvAttr = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvAttr, _super);
        function SEnvAttr(name, value, ownerElement) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.value = value;
            _this.ownerElement = ownerElement;
            _this.specified = true;
            return _this;
        }
        SEnvAttr.prototype.createStruct = function () {
            return __assign({}, _super.prototype.createStruct.call(this), { name: this.name, value: this.value });
        };
        return SEnvAttr;
    }(SEnvNode));
});
exports.getSEnvElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvAttr = exports.getSEnvAttr(context);
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    var SEnvNamedNodeMap = collections_1.getSEnvHTMLCollectionClasses(context).SEnvNamedNodeMap;
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var SEnvShadowRoot = light_document_1.getSEnvShadowRootClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvElement, _super);
        function SEnvElement() {
            var _this = _super.call(this) || this;
            _this.structType = state_1.SYNTHETIC_ELEMENT;
            _this.nodeType = constants_1.SEnvNodeTypes.ELEMENT;
            _this.className = "";
            _this.nodeType = constants_1.SEnvNodeTypes.ELEMENT;
            _this.attributes = new Proxy(new SEnvNamedNodeMap(), {
                get: function (target, key) {
                    return typeof target[key] === "function" ? target[key].bind(target) : target[key];
                },
                set: function (target, key, value, receiver) {
                    var oldItem = target.getNamedItem(value);
                    if (value == null) {
                        target.removeNamedItem(key);
                    }
                    else {
                        target.setNamedItem(new SEnvAttr(key, value, _this));
                    }
                    _this.attributeChangedCallback(key, oldItem && oldItem.value, value);
                    return true;
                }
            });
            return _this;
        }
        Object.defineProperty(SEnvElement.prototype, "slot", {
            get: function () {
                return this.getAttribute("slot");
            },
            set: function (value) {
                this.setAttribute("slot", value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "previousElementSibling", {
            get: function () {
                for (var i = Array.prototype.indexOf.call(this.parentNode.childNodes, this); i--;) {
                    if (this.parentNode.childNodes[i].nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
                        return this.parentNode.childNodes[i];
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "nextElementSibling", {
            get: function () {
                for (var i = Array.prototype.indexOf.call(this.parentNode.childNodes, this) + 1, length_1 = this.parentNode.childNodes.length; i < length_1; i++) {
                    if (this.parentNode.childNodes[i].nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
                        return this.parentNode.childNodes[i];
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "id", {
            get: function () {
                return this.getAttribute("id");
            },
            set: function (value) {
                this.setAttribute("id", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvElement.prototype.getAttribute = function (name) {
            return this.hasAttribute(name) ? this.attributes[name].value : null;
        };
        SEnvElement.prototype.getPreviewAttribute = function (name) {
            return this.getAttribute(name);
        };
        SEnvElement.prototype.getAttributeNode = function (name) {
            return this.attributes[name];
        };
        SEnvElement.prototype.getAttributeNodeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.getAttributeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.getBoundingClientRect = function () {
            return this.ownerDocument.defaultView.renderer.getBoundingClientRect(this);
        };
        SEnvElement.prototype.getClientRects = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        Object.defineProperty(SEnvElement.prototype, "outerHTML", {
            get: function () {
                var buffer = "<" + this.nodeName.toLowerCase();
                for (var i = 0, n = this.attributes.length; i < n; i++) {
                    var _a = this.attributes[i], name_1 = _a.name, value = _a.value;
                    buffer += " " + name_1 + "=\"" + value + "\"";
                }
                buffer += ">" + this.innerHTML + "</" + this.nodeName.toLowerCase() + ">";
                return buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "innerHTML", {
            get: function () {
                return Array.prototype.map.call(this.childNodes, function (child) {
                    switch (child.nodeType) {
                        case constants_1.SEnvNodeTypes.TEXT: return child.nodeValue;
                        case constants_1.SEnvNodeTypes.COMMENT: return "<!--" + child.nodeValue + "-->";
                        case constants_1.SEnvNodeTypes.ELEMENT: return child.outerHTML;
                    }
                    return "";
                }).join("");
            },
            set: function (value) {
                this.removeAllChildren();
                var documentFragment = utils_1.evaluateHTMLDocumentFragment(value, this.ownerDocument, this);
            },
            enumerable: true,
            configurable: true
        });
        SEnvElement.prototype.createStruct = function (parentNode) {
            return __assign({}, _super.prototype.createStruct.call(this, parentNode), { shadowRoot: this.shadowRoot && this.shadowRoot.struct, attributes: Array.prototype.map.call(this.attributes, function (attr) { return attr.struct; }) });
        };
        SEnvElement.prototype.hasAttribute = function (name) {
            return this.attributes[name] != null;
        };
        SEnvElement.prototype.hasAttributeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msGetRegionContent = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msGetUntransformedBounds = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msMatchesSelector = function (selectors) {
            return this.matches(selectors);
        };
        SEnvElement.prototype.msReleasePointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msSetPointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msZoomTo = function (args) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.releasePointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.removeAttribute = function (qualifiedName) {
            this.attributes[qualifiedName] = undefined;
        };
        SEnvElement.prototype.removeAttributeNode = function (oldAttr) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.removeAttributeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.requestFullscreen = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.requestPointerLock = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setAttribute = function (name, value) {
            if (this.getAttribute(name) !== value) {
                this.attributes[name] = value;
            }
        };
        SEnvElement.prototype.setAttributeNode = function (newAttr) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setAttributeNodeNS = function (newAttr) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setAttributeNS = function (namespaceURI, qualifiedName, value) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setPointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.webkitMatchesSelector = function (selectors) {
            return this.matches(selectors);
        };
        SEnvElement.prototype.webkitRequestFullscreen = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.webkitRequestFullScreen = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.matches = function (selector) {
            return utils_1.matchesSelector(this, selector);
        };
        SEnvElement.prototype.closest = function (selector) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scrollIntoView = function (arg) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scroll = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scrollTo = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scrollBy = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.insertAdjacentElement = function (position, insertedElement) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.insertAdjacentHTML = function (where, html) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.insertAdjacentText = function (where, text) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.attachShadow = function (shadowRootInitDict) {
            if (this.shadowRoot) {
                return this.shadowRoot;
            }
            // const SEnvDocument = getSEnvDocumentClass(context)
            return this.$$setShadowRoot(this.ownerDocument.$$linkNode(new SEnvShadowRoot()));
        };
        SEnvElement.prototype.$$setShadowRoot = function (shadowRoot) {
            this.shadowRoot = shadowRoot;
            if (this.connectedToDocument) {
                this.shadowRoot.$$setConnectedToDocument(true);
            }
            this.shadowRoot["" + "host"] = this;
            this.dispatchMutationEvent(exports.attachShadowRootMutation(this));
            this.shadowRoot.addEventListener(SEnvMutationEvent.MUTATION, this._onShadowMutation.bind(this));
            return this.shadowRoot;
        };
        SEnvElement.prototype._onShadowMutation = function (event) {
            this._onMutation(event);
            this.dispatchEvent(event);
        };
        SEnvElement.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
            this.dispatchMutationEvent(source_mutation_1.createPropertyMutation(constants_2.SET_ELEMENT_ATTRIBUTE_EDIT, this, name, newValue, oldValue));
        };
        SEnvElement.prototype.cloneNode = function (deep) {
            var clone = _super.prototype.cloneNode.call(this, deep);
            if (deep !== false && this.shadowRoot) {
                clone.attachShadow({ mode: "open" }).appendChild(this.shadowRoot.cloneNode(true));
            }
            return clone;
        };
        SEnvElement.prototype.cloneShallow = function () {
            // note that we're instantiating the constructor here instead
            // of calling document.createElement since document.createElement
            // may have a different class registered to this tag name at a different time. 
            var clone = this.ownerDocument.$$linkElement(new this.constructor(), this.tagName, this.namespaceURI);
            clone["" + "tagName"] = this.tagName;
            for (var i = 0, n = this.attributes.length; i < n; i++) {
                var attr = this.attributes[i];
                clone.setAttribute(attr.name, attr.value);
            }
            return clone;
        };
        return SEnvElement;
    }(SEnvParentNode));
});
exports.diffBaseNode = function (oldChild, newChild, diffChildNode) {
    if (diffChildNode === void 0) { diffChildNode = exports.diffBaseNode; }
    switch (oldChild.nodeType) {
        case constants_1.SEnvNodeTypes.ELEMENT: return exports.diffBaseElement(oldChild, newChild, diffChildNode);
        case constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT: return parent_node_1.diffParentNode(oldChild, newChild, diffChildNode);
        case constants_1.SEnvNodeTypes.TEXT: return text_1.diffTextNode(oldChild, newChild);
        case constants_1.SEnvNodeTypes.COMMENT: return comment_1.diffComment(oldChild, newChild);
    }
    return [];
};
exports.createSetElementTextContentMutation = function (target, value) {
    return source_mutation_1.createPropertyMutation(constants_2.SET_TEXT_CONTENT, target, "textContent", value);
};
exports.attachShadowRootMutation = function (target) {
    return source_mutation_1.createSetValueMutation(constants_2.ATTACH_SHADOW_ROOT_EDIT, target, target.shadowRoot);
};
exports.createSetElementAttributeMutation = function (target, name, value, oldName, index) {
    return source_mutation_1.createPropertyMutation(constants_2.SET_ELEMENT_ATTRIBUTE_EDIT, target, name, value, undefined, oldName, index);
};
exports.diffBaseElement = function (oldElement, newElement, diffChildNode) {
    if (diffChildNode === void 0) { diffChildNode = exports.diffBaseNode; }
    var mutations = [];
    if (oldElement.nodeName !== newElement.nodeName) {
        throw new Error("nodeName must match in order to diff");
    }
    var attrDiff = source_mutation_1.diffArray(Array.from(oldElement.attributes), Array.from(newElement.attributes), function (a, b) { return a.name === b.name ? 1 : -1; });
    source_mutation_1.eachArrayValueMutation(attrDiff, {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            mutations.push(exports.createSetElementAttributeMutation(oldElement, value.name, value.value, undefined, index));
        },
        delete: function (_a) {
            var index = _a.index;
            mutations.push(exports.createSetElementAttributeMutation(oldElement, oldElement.attributes[index].name, undefined));
        },
        update: function (_a) {
            var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
            if (oldElement.attributes[originalOldIndex].value !== newValue.value) {
                mutations.push(exports.createSetElementAttributeMutation(oldElement, newValue.name, newValue.value, undefined, index));
            }
        }
    });
    // TODO - open / close shadow root
    if (oldElement.shadowRoot && newElement.shadowRoot) {
        mutations.push.apply(mutations, diffChildNode(oldElement.shadowRoot, newElement.shadowRoot));
    }
    else if (oldElement.shadowRoot && !newElement.shadowRoot) {
        console.error("Attempting to diff unimplemented attachment of shadow root");
    }
    else if (!oldElement.shadowRoot && newElement.shadowRoot) {
        console.error("Attempting to diff unimplemented detattachment of shadow root");
    }
    mutations.push.apply(mutations, parent_node_1.diffParentNode(oldElement, newElement, diffChildNode));
    return mutations;
};
exports.baseElementMutators = __assign({}, parent_node_1.parentNodeMutators, (_a = {}, _a[constants_2.ATTACH_SHADOW_ROOT_EDIT] = function (oldElement, mutation) {
    if (oldElement.$$setShadowRoot) {
        oldElement.$$setShadowRoot(mutation.newValue.cloneNode(true));
    }
    else {
        oldElement.attachShadow({ mode: "open" });
    }
}, _a[constants_2.SET_ELEMENT_ATTRIBUTE_EDIT] = function (oldElement, mutation) {
    var _a = mutation, name = _a.name, oldName = _a.oldName, newValue = _a.newValue;
    // need to set the current value (property), and the default value (attribute)
    // TODO - this may need to be separated later on.
    if (oldElement.constructor.prototype.hasOwnProperty(name)) {
        oldElement[name] = newValue == null ? "" : newValue;
    }
    if (newValue == null) {
        oldElement.removeAttribute(name);
    }
    else {
        // An error will be thrown by the DOM if the name is invalid. Need to ignore
        // native exceptions so that other parts of the app do not break.
        try {
            oldElement.setAttribute(name, newValue);
        }
        catch (e) {
            console.warn(e);
        }
    }
    if (oldName) {
        if (oldElement.hasOwnProperty(oldName)) {
            oldElement[oldName] = undefined;
        }
        oldElement.removeAttribute(oldName);
    }
}, _a));
var _a;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/element.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/element.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/html-elements.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/utils.ts");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
var css_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/index.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var element_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/element.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
var getShadowRoot = function (node) {
    while (node.nodeName !== "#document" && node.nodeName !== "#shadow-root" && node.nodeName !== "#document-fragment") {
        node = node.parentNode;
    }
    return node;
};
exports.getSEnvHTMLElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvElement = element_1.getSEnvElementClass(context);
    var SEnvCSSStyleDeclaration = css_1.getSEnvCSSStyleDeclarationClass(context);
    var _a = collections_1.getSEnvHTMLCollectionClasses(context), SEnvDOMStringMap = _a.SEnvDOMStringMap, SEnvDOMTokenList = _a.SEnvDOMTokenList;
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLElement, _super);
        function SEnvHTMLElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._onClassListChange = function (value) {
                _this.setAttribute("class", value);
            };
            return _this;
        }
        SEnvHTMLElement.prototype._linkChild = function (child) {
            _super.prototype._linkChild.call(this, child);
            this._tryLoading(); // maybe text node
            child.$$parentElement = this;
        };
        Object.defineProperty(SEnvHTMLElement.prototype, "style", {
            get: function () {
                return this._styleProxy || this._resetStyleProxy();
            },
            set: function (value) {
                var buffer = [];
                if (typeof value === "object") {
                    for (var key in value) {
                        buffer.push(key, ":", value[key]);
                    }
                    value = buffer.join(";");
                }
                this.style.cssText = String(value);
                this.onStyleChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLElement.prototype, "dataset", {
            get: function () {
                var _this = this;
                return this._dataset || (this._dataset = new Proxy(new SEnvDOMStringMap(), {
                    get: function (target, key) {
                        return target[key];
                    },
                    set: function (target, key, value, handler) {
                        var attrName = key.toLowerCase();
                        _this.dataChangedCallback(attrName, target[attrName], value);
                        target[lodash_1.camelCase(attrName)] = value;
                        return true;
                    }
                }));
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLElement.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            this._tryLoading();
        };
        SEnvHTMLElement.prototype.canLoad = function () {
            return false;
        };
        SEnvHTMLElement.prototype._tryLoading = function () {
            if (!this._loaded && this.canLoad()) {
                this._loaded = true;
                this._load();
            }
        };
        SEnvHTMLElement.prototype._load = function () {
        };
        SEnvHTMLElement.prototype.attributeChangedCallback = function (propertyName, oldValue, newValue) {
            _super.prototype.attributeChangedCallback.call(this, propertyName, oldValue, newValue);
            if (propertyName === "style" && newValue !== this._getStyleString()) {
                this.style.cssText = newValue || "";
            }
            else if (propertyName.substr(0, 5) === "data-") {
                this.dataset[propertyName.substr(5).toLowerCase()] = newValue;
            }
            else if (propertyName === "class") {
                this.className = newValue;
                this.classList = new SEnvDOMTokenList(newValue || "", this._onClassListChange);
            }
        };
        SEnvHTMLElement.prototype.dataChangedCallback = function (propertyName, oldValue, newValue) {
            if (propertyName === "_source") {
                var source = JSON.parse(newValue);
                this.source = source;
            }
        };
        SEnvHTMLElement.prototype.blur = function () {
        };
        SEnvHTMLElement.prototype.click = function () {
        };
        SEnvHTMLElement.prototype.dragDrop = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLElement.prototype.focus = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLElement.prototype.msGetInputContext = function () {
            return null;
        };
        SEnvHTMLElement.prototype.remove = function () {
        };
        SEnvHTMLElement.prototype._resetStyleProxy = function () {
            var _this = this;
            if (!this._style) {
                this._style = new SEnvCSSStyleDeclaration(function () { return _this.onStyleChange(); });
                this._style.$owner = this;
            }
            // Proxy the style here so that any changes get synchronized back
            // to the attribute
            // element.
            return this._styleProxy = new Proxy(this._style, {
                get: function (target, propertyName, receiver) {
                    return target[propertyName];
                },
                set: function (target, propertyName, value, receiver) {
                    // normalize the value if it's a pixel unit. Numbers are invalid for CSS declarations.
                    if (typeof value === "number") {
                        value = Math.round(value) + "px";
                    }
                    target.setProperty(propertyName.toString(), value);
                    return true;
                }
            });
        };
        SEnvHTMLElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            clone["_loaded"] = true;
            return clone;
        };
        SEnvHTMLElement.prototype.onStyleChange = function () {
            this.setAttribute("style", this._getStyleString());
        };
        SEnvHTMLElement.prototype._getStyleString = function () {
            return this.style.cssText.replace(/[\n\t\s]+/g, " ").trim();
        };
        return SEnvHTMLElement;
    }(SEnvElement));
});
exports.getSEnvHTMLStyleElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvCSSStyleSheet = css_1.getSEnvCSSStyleSheetClass(context);
    var SEnvEvent = events_1.getSEnvEventClasses(context).SEnvEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLStyleElement, _super);
        function SEnvHTMLStyleElement() {
            var _this = _super.call(this) || this;
            _this.sheet = new SEnvCSSStyleSheet();
            _this.sheet.ownerNode = _this;
            return _this;
        }
        SEnvHTMLStyleElement.prototype.canLoad = function () {
            return !!this.textContent;
        };
        SEnvHTMLStyleElement.prototype._load = function () {
            var source = this.textContent;
            this.sheet.cssText = source;
            var e = new SEnvEvent();
            e.initEvent("load", true, true);
            this.dispatchEvent(e);
        };
        SEnvHTMLStyleElement.prototype.$$setSheet = function (sheet) {
            this.sheet = sheet;
            this.sheet.ownerNode = this;
        };
        SEnvHTMLStyleElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            var window = this.ownerDocument.defaultView;
            clone.$$setSheet(this.sheet.clone());
            return clone;
        };
        return SEnvHTMLStyleElement;
    }(SEnvHTMLElement));
});
exports.diffHTMLStyleElement = function (oldElement, newElement) { return exports.diffHTMLStyledElement(oldElement, newElement); };
exports.getSEnvHTMLLinkElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvCSSStyleSheet = css_1.getSEnvCSSStyleSheetClass(context);
    var SEnvEvent = events_1.getSEnvEventClasses(context).SEnvEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLLinkElement, _super);
        function SEnvHTMLLinkElement() {
            var _this = _super.call(this) || this;
            var sheet = _this.sheet = new SEnvCSSStyleSheet();
            _this.interactiveLoaded = new Promise(function (resolve, reject) {
                _this._resolveLoaded = resolve;
                _this._rejectLoaded = reject;
            });
            return _this;
        }
        SEnvHTMLLinkElement.prototype.canLoad = function () {
            return !!this.href && !!this._resolveLoaded;
        };
        Object.defineProperty(SEnvHTMLLinkElement.prototype, "rel", {
            get: function () {
                return this.getAttribute("rel");
            },
            set: function (value) {
                this.setAttribute("rel", value);
                this._load();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLLinkElement.prototype, "charset", {
            get: function () {
                return this.getAttribute("charset");
            },
            set: function (value) {
                this.setAttribute("charset", value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLLinkElement.prototype, "href", {
            get: function () {
                return this.getAttribute("href");
            },
            set: function (value) {
                this.setAttribute("href", value);
                this._load();
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLLinkElement.prototype._load = function () {
            var rel = this.rel;
            if (rel === "stylesheet") {
                return this._loadStylesheet();
            }
            this._resolveLoaded();
        };
        SEnvHTMLLinkElement.prototype.$$setSheet = function (sheet) {
            this.sheet = sheet;
            this.sheet.ownerNode = this;
        };
        SEnvHTMLLinkElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            if (this.sheet) {
                // TODO: clean this up -- clone stylesheet instead of using
                // cssText which will run the parser again (we don't want that because it's sloowwwwwww). (CC)
                var window_1 = this.ownerDocument.defaultView;
                clone.$$setSheet(this.sheet.clone());
            }
            return clone;
        };
        SEnvHTMLLinkElement.prototype._loadStylesheet = function () {
            return __awaiter(this, void 0, void 0, function () {
                var href, window_2, uri, response, text, event_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            href = this.href;
                            window_2 = this.ownerDocument.defaultView;
                            uri = utils_1.getUri(href, String(window_2.location));
                            return [4 /*yield*/, window_2.fetch(uri)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            text = _a.sent();
                            this._parseStylesheet(text);
                            event_1 = new SEnvEvent();
                            event_1.initEvent("load", true, true);
                            this._resolveLoaded();
                            this.dispatchEvent(event_1);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            this._rejectLoaded(e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SEnvHTMLLinkElement.prototype._parseStylesheet = function (text) {
            var sheet = this.sheet;
            sheet.href = this.href;
            sheet.ownerNode = this;
            var location = this.ownerDocument.defaultView.location;
            sheet.cssText = text;
        };
        return SEnvHTMLLinkElement;
    }(SEnvHTMLElement));
});
exports.SET_STYLED_ELEMENT_SHEET = "SET_STYLED_ELEMENT_SHEET";
exports.setStyledElementSheetMutation = function (target, sheet) { return source_mutation_1.createSetValueMutation(exports.SET_STYLED_ELEMENT_SHEET, target, sheet); };
exports.diffHTMLStyledElement = function (oldElement, newElement) {
    return element_1.diffBaseElement(oldElement, newElement).concat(css_1.diffCSSStyleSheet(oldElement.sheet, newElement.sheet));
};
exports.flattenNodeSources = aerial_common2_1.weakMemo(function (node) {
    var flattened = (_a = {}, _a[node.$id] = node.instance, _a);
    var nameLower = node.nodeName.toLowerCase();
    // TODO - use callback here
    if ((nameLower === "style" || nameLower === "link") && node.instance.sheet) {
        Object.assign(flattened, css_1.flattenSyntheticCSSStyleSheetSources(node.instance.sheet.struct));
    }
    if (node.nodeType === constants_1.SEnvNodeTypes.ELEMENT && node.instance.hasAttribute("style")) {
        var element = node.instance;
        flattened[element.style.$id] = element.style.struct.instance;
    }
    if (node.childNodes) {
        for (var i = 0, n = node.childNodes.length; i < n; i++) {
            Object.assign(flattened, exports.flattenNodeSources(node.childNodes[i]));
        }
    }
    if (node.nodeType === constants_1.SEnvNodeTypes.ELEMENT && node.instance.shadowRoot) {
        Object.assign(flattened, exports.flattenNodeSources(node.instance.shadowRoot.struct));
    }
    return flattened;
    var _a;
});
exports.diffHTMLLinkElement = function (oldElement, newElement) {
    if (oldElement.rel === "stylesheet") {
        return exports.diffHTMLStyledElement(oldElement, newElement);
    }
    else {
        return element_1.diffBaseElement(oldElement, newElement);
    }
};
var _scriptCache = {};
var compileScript = function (source) {
    if (_scriptCache[source]) {
        return _scriptCache[source];
    }
    var f = _scriptCache[source] = new Function("__context", "with(__context) {" + source + "}");
    return f;
};
var declarePropertiesFromScript = function (context, script) {
    // TODO - need to use acorn to figure out where all global vars are
    return context;
};
exports.getSenvHTMLScriptElementClass = aerial_common2_1.weakMemo(function (context) {
    var getProxyUrl = context.getProxyUrl;
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLScriptElement, _super);
        function SEnvHTMLScriptElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SEnvHTMLScriptElement.prototype, "src", {
            get: function () {
                return this.getAttribute("src");
            },
            set: function (value) {
                this.setAttribute("src", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLScriptElement.prototype.canLoad = function () {
            return Boolean(this.src || this.textContent);
        };
        SEnvHTMLScriptElement.prototype._load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var src, window_3, response, text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            src = this.src;
                            if (!src) return [3 /*break*/, 3];
                            window_3 = this.ownerDocument.defaultView;
                            this.contentLoaded = new Promise(function (resolve, reject) {
                                _this._resolveContentLoaded = resolve;
                                _this._rejectContentLoaded = reject;
                            });
                            return [4 /*yield*/, window_3.fetch(utils_1.getUri(src, String(window_3.location)))];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            text = _a.sent();
                            this._scriptSource = text;
                            this._filename = src;
                            this._evaluate();
                            return [3 /*break*/, 4];
                        case 3:
                            this._resolveContentLoaded = function () { };
                            this._rejectContentLoaded = function () { };
                            this._scriptSource = this.textContent;
                            this._filename = this.ownerDocument.defaultView.location.toString();
                            this._evaluate();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SEnvHTMLScriptElement.prototype._evaluate = function () {
            try {
                var run_1 = compileScript(this._scriptSource);
                run_1.call(this.ownerDocument.defaultView, declarePropertiesFromScript(this.ownerDocument.defaultView, this._scriptSource));
                // TODO - need to grab existing VM object
                // script.runInNewContext(vm.createContext({ __context: this.ownerDocument.defaultView }));
            }
            catch (e) {
                this.ownerDocument.defaultView.console.warn(e);
            }
            // temp for now. Needs to call reject if error is caught
            this._resolveContentLoaded();
        };
        return SEnvHTMLScriptElement;
    }(SEnvHTMLElement));
});
exports.getSEnvHTMLFormElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var SEnvHTMLFormElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLFormElement, _super);
        function SEnvHTMLFormElement() {
            var _this = _super.call(this) || this;
            _this.addEventListener(SEnvMutationEvent.MUTATION, _this._onMutation2.bind(_this));
            return _this;
        }
        SEnvHTMLFormElement.prototype.checkValidity = function () {
            return false;
        };
        SEnvHTMLFormElement.prototype.reportValidity = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLFormElement.prototype.item = function (name, index) { };
        SEnvHTMLFormElement.prototype.namedItem = function (name) { };
        SEnvHTMLFormElement.prototype.reset = function () { };
        SEnvHTMLFormElement.prototype.submit = function () { };
        SEnvHTMLFormElement.prototype._onMutation2 = function (event) {
            // TODO - *[name] does not work -- this is a quick fix
            var formItems = Array.from(this.querySelectorAll("*")).filter(function (element) { return element.hasAttribute("name"); });
            for (var _i = 0, formItems_1 = formItems; _i < formItems_1.length; _i++) {
                var formItem = formItems_1[_i];
                this[formItem.getAttribute("name")] = formItem;
            }
        };
        return SEnvHTMLFormElement;
    }(SEnvHTMLElement));
    ;
    return SEnvHTMLFormElement;
});
exports.SET_CANVAS_DATA_URL = "SET_CANVAS_DATA_URL";
var createSetCanvasDataUrlMutation = function (target, uri, width, height) { return source_mutation_1.createSetValueMutation(exports.SET_CANVAS_DATA_URL, target, { uri: uri, width: width, height: height }); };
var canvasMutators = (_a = {},
    _a[exports.SET_CANVAS_DATA_URL] = function (canvas, _a) {
        var _b = _a.newValue, uri = _b.uri, width = _b.width, height = _b.height;
        var image = new Image();
        image.onload = function () {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(image, 0, 0);
        };
        image.src = uri;
    },
    _a);
var difHTMLCanvasElement = function (oldElement, newElement) {
    var mutations = element_1.diffBaseNode(oldElement, newElement, exports.diffHTMLNode);
    var newDataUrl = newElement.toDataURL();
    // TODO - fix me - this is slow.
    if (oldElement.toDataURL() !== newDataUrl) {
        mutations.push(createSetCanvasDataUrlMutation(oldElement, newDataUrl, oldElement.width, oldElement.height));
    }
    return mutations;
};
exports.getSEnvHTMLCanvasElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvHTMLCanvasElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLCanvasElement, _super);
        function SEnvHTMLCanvasElement() {
            var _this = _super.call(this) || this;
            _this.$$setCanvas(document.createElement("canvas"));
            return _this;
        }
        Object.defineProperty(SEnvHTMLCanvasElement.prototype, "width", {
            get: function () {
                return Number(this.getAttribute("width"));
            },
            set: function (value) {
                this.setAttribute("width", String(value));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLCanvasElement.prototype, "height", {
            get: function () {
                return Number(this.getAttribute("height"));
            },
            set: function (value) {
                this.setAttribute("height", String(value));
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLCanvasElement.prototype.$$setCanvas = function (canvas) {
            // proxy canvas element for now -- API is too complicated -- should be okay diff / patching buffer. Node should use cairo for this.
            this._canvas = proxyOnChange(this._canvasNoProxy = canvas, lodash_1.debounce(this._onCanvasDraw.bind(this), 20));
        };
        SEnvHTMLCanvasElement.prototype.attributeChangedCallback = function (propertyName, oldValue, newValue) {
            _super.prototype.attributeChangedCallback.call(this, propertyName, oldValue, newValue);
            this._canvas.setAttribute(propertyName, newValue);
        };
        SEnvHTMLCanvasElement.prototype.getContext = function (contextId, contextAttributes) {
            return this._canvas.getContext(contextId, contextAttributes);
        };
        SEnvHTMLCanvasElement.prototype.msToBlob = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLCanvasElement.prototype.toDataURL = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this._canvasNoProxy).toDataURL.apply(_a, [type].concat(args));
            var _a;
        };
        SEnvHTMLCanvasElement.prototype.toBlob = function (callback, type) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            (_a = this._canvasNoProxy).toBlob.apply(_a, [callback, type].concat(args));
            var _a;
        };
        SEnvHTMLCanvasElement.prototype._onCanvasDraw = function () {
            var dataUrl = this._canvasNoProxy.toDataURL();
            this.dispatchMutationEvent(createSetCanvasDataUrlMutation(this, dataUrl, this._canvas.width, this._canvas.height));
        };
        SEnvHTMLCanvasElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            clone["" + "$$setCanvas"](this._canvasNoProxy.cloneNode(true));
            return clone;
        };
        return SEnvHTMLCanvasElement;
    }(SEnvHTMLElement));
    return SEnvHTMLCanvasElement;
});
var getSEnvHTMLInputElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvHTMLInputElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLInputElement, _super);
        function SEnvHTMLInputElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SEnvHTMLInputElement.prototype, "name", {
            get: function () {
                return this.getAttribute("name");
            },
            set: function (value) {
                this.setAttribute("name", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLInputElement.prototype.checkValidity = function () {
            return false;
        };
        Object.defineProperty(SEnvHTMLInputElement.prototype, "checked", {
            get: function () {
                return false;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLInputElement.prototype, "value", {
            get: function () {
                return this.getAttribute("value");
            },
            set: function (value) {
                this.setAttribute("value", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLInputElement.prototype.select = function () { };
        SEnvHTMLInputElement.prototype.setCustomValidity = function (error) { };
        SEnvHTMLInputElement.prototype.setSelectionRange = function (start, end, direction) { };
        SEnvHTMLInputElement.prototype.stepDown = function (n) { };
        SEnvHTMLInputElement.prototype.stepUp = function (n) { };
        return SEnvHTMLInputElement;
    }(SEnvHTMLElement));
    return SEnvHTMLInputElement;
});
var getSEnvHTMLIFrameElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvHTMLIFrameElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLIFrameElement, _super);
        function SEnvHTMLIFrameElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvHTMLIFrameElement.prototype.canLoad = function () {
            return false;
        };
        SEnvHTMLIFrameElement.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            if (this._startedIframe) {
                return;
            }
            this._startedIframe = true;
            var getSEnvWindowClass = __webpack_require__("../aerial-browser-sandbox/src/environment/window.ts").getSEnvWindowClass;
            var SEnvWindow = getSEnvWindowClass(context);
            this.contentWindow = new SEnvWindow("", this.ownerDocument.defaultView);
            this.contentWindow.renderer.start();
        };
        SEnvHTMLIFrameElement.prototype._load = function () {
        };
        Object.defineProperty(SEnvHTMLIFrameElement.prototype, "contentDocument", {
            get: function () {
                return this.contentWindow.document;
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLIFrameElement.prototype.getSVGDocument = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLIFrameElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            clone.contentWindow = this.contentWindow.clone(true);
            return clone;
        };
        return SEnvHTMLIFrameElement;
    }(SEnvHTMLElement));
    return SEnvHTMLIFrameElement;
});
var proxyOnChange = function (target, onChange) {
    var maybeProxy = function (v) {
        if (typeof v === "function") {
            return proxyOnChange(v.bind(target), onChange);
        }
        else if (typeof v === "object") {
            // return proxyOnChange(v, onChange);
            return v;
        }
        return v;
    };
    return new Proxy(target, {
        get: function (target, p, receiver) {
            return maybeProxy(target[p]);
        },
        apply: function (target, thisArg, argArray) {
            onChange(target.name, argArray);
            return maybeProxy(target.apply(thisArg, argArray));
        },
        set: function (target, p, value, receiver) {
            onChange(p, [value]);
            target[p] = value;
            return true;
        }
    });
};
var getSEnvHTMLSlotElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var SEnvHTMLSlotELement = /** @class */ (function (_super) {
        __extends(SEnvHTMLSlotELement, _super);
        function SEnvHTMLSlotELement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._onParentShadowMutation = function (event) {
                if (event.type === constants_2.INSERT_CHILD_NODE_EDIT) {
                    _this._updateSlots();
                }
                else if (event.type === constants_2.REMOVE_CHILD_NODE_EDIT) {
                    _this._updateSlots();
                }
            };
            return _this;
        }
        Object.defineProperty(SEnvHTMLSlotELement.prototype, "name", {
            get: function () {
                return this.getAttribute("name");
            },
            set: function (value) {
                this.setAttribute("name", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLSlotELement.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            this._assignedNodes = [];
            var shadow = this._parentShadow = getShadowRoot(this);
            shadow.addEventListener(SEnvMutationEvent.MUTATION, this._onParentShadowMutation.bind(this));
            this._updateSlots();
        };
        SEnvHTMLSlotELement.prototype.disconnectedCallback = function () {
            this._parentShadow = getShadowRoot(this);
            this._parentShadow.removeEventListener(SEnvMutationEvent.MUTATION, this._onParentShadowMutation.bind(this));
        };
        SEnvHTMLSlotELement.prototype.assignedNodes = function (options) {
            var _this = this;
            var shadowParent = this._parentShadow.host;
            if (!shadowParent)
                return [];
            return Array.prototype.filter.call(shadowParent.childNodes, function (child) {
                return child.slot == _this.name;
            });
        };
        SEnvHTMLSlotELement.prototype._updateSlots = function () {
            var shadowParent = this._parentShadow.host;
            if (!shadowParent)
                return;
            var assignedNodes = this.assignedNodes();
            var diffs = source_mutation_1.diffArray(this._assignedNodes, assignedNodes, function (a, b) { return a === b ? 0 : -1; });
            this._assignedNodes = assignedNodes;
            source_mutation_1.eachArrayValueMutation(diffs, {
                insert: function (_a) {
                    var value = _a.value, index = _a.index;
                    value.$$setAssignedSlot(this);
                },
                delete: function (_a) {
                    var value = _a.value;
                    value.$$setAssignedSlot(null);
                },
                update: function (_a) {
                }
            });
        };
        return SEnvHTMLSlotELement;
    }(SEnvHTMLElement));
    return SEnvHTMLSlotELement;
});
exports.getSEnvHTMLElementClasses = aerial_common2_1.weakMemo(function (context) {
    var getProxyUrl = context.getProxyUrl;
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    /*
  
    1.
  
    pbpaste | node -e "\
      const buffer = [];\
      process.stdin.resume();\
      process.stdin.setEncoding('utf8');\
      process.stdin.on('data', (chunk) => {\
        buffer.push(chunk);\
      });\
      process.stdin.on('end', (chunk) => {\
        transform(buffer.join(''));\
      });\
      const transform = (content) => {\
        content.match(/HTMLElementTagNameMap\s\{([\s\S\n]*?)\}/)[1].match(/\"(\w+)\":\s(\w+)/g).forEach((m) => {\
              const [match, name, className] = m.match(/\"(\w+)\":\s(\w+)/);\
              console.log(\`    \"\${name}\": class SEnv\${className} extends SEnvHTMLElement implements \${className} { },\`);\
        });\
      };\
      " | pbcopy
  
    2. copy lib.dom.d.ts
    3. run #1
    4. paste here
    5. fix interface issues
    5. cast returned value as ElementTagNameMap
  
    */
    return {
        // TODO - move to separate function
        "a": /** @class */ (function (_super) {
            __extends(SEnvHTMLAnchorElement, _super);
            function SEnvHTMLAnchorElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLAnchorElement;
        }(SEnvHTMLElement)),
        "applet": /** @class */ (function (_super) {
            __extends(SEnvHTMLAppletElement, _super);
            function SEnvHTMLAppletElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLAppletElement;
        }(SEnvHTMLElement)),
        "area": /** @class */ (function (_super) {
            __extends(SEnvHTMLAreaElement, _super);
            function SEnvHTMLAreaElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLAreaElement;
        }(SEnvHTMLElement)),
        "audio": /** @class */ (function (_super) {
            __extends(SEnvHTMLAudioElement, _super);
            function SEnvHTMLAudioElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLAudioElement.prototype.addTextTrack = function (kind, label, language) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLAudioElement.prototype.canPlayType = function (type) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLAudioElement.prototype.load = function () {
            };
            SEnvHTMLAudioElement.prototype.msClearEffects = function () {
            };
            SEnvHTMLAudioElement.prototype.msGetAsCastingSource = function () {
            };
            SEnvHTMLAudioElement.prototype.msInsertAudioEffect = function (activatableClassId, effectRequired, config) {
            };
            SEnvHTMLAudioElement.prototype.msSetMediaKeys = function (mediaKeys) {
            };
            SEnvHTMLAudioElement.prototype.msSetMediaProtectionManager = function (mediaProtectionManager) {
            };
            SEnvHTMLAudioElement.prototype.pause = function () {
            };
            SEnvHTMLAudioElement.prototype.play = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLAudioElement.prototype.setMediaKeys = function (mediaKeys) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLAudioElement;
        }(SEnvHTMLElement)),
        "base": /** @class */ (function (_super) {
            __extends(SEnvHTMLBaseElement, _super);
            function SEnvHTMLBaseElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBaseElement;
        }(SEnvHTMLElement)),
        "basefont": /** @class */ (function (_super) {
            __extends(SEnvHTMLBaseFontElement, _super);
            function SEnvHTMLBaseFontElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBaseFontElement;
        }(SEnvHTMLElement)),
        "blockquote": /** @class */ (function (_super) {
            __extends(SEnvHTMLQuoteElement, _super);
            function SEnvHTMLQuoteElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLQuoteElement;
        }(SEnvHTMLElement)),
        "slot": getSEnvHTMLSlotElementClass(context),
        "body": /** @class */ (function (_super) {
            __extends(SEnvHTMLBodyElement, _super);
            function SEnvHTMLBodyElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBodyElement;
        }(SEnvHTMLElement)),
        "br": /** @class */ (function (_super) {
            __extends(SEnvHTMLBRElement, _super);
            function SEnvHTMLBRElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBRElement;
        }(SEnvHTMLElement)),
        "button": /** @class */ (function (_super) {
            __extends(SEnvHTMLButtonElement, _super);
            function SEnvHTMLButtonElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLButtonElement.prototype.checkValidity = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLButtonElement.prototype.setCustomValidity = function (error) {
            };
            return SEnvHTMLButtonElement;
        }(SEnvHTMLElement)),
        "canvas": exports.getSEnvHTMLCanvasElementClass(context),
        "caption": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableCaptionElement, _super);
            function SEnvHTMLTableCaptionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableCaptionElement;
        }(SEnvHTMLElement)),
        "col": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableColElement, _super);
            function SEnvHTMLTableColElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableColElement;
        }(SEnvHTMLElement)),
        "colgroup": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableColElement, _super);
            function SEnvHTMLTableColElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableColElement;
        }(SEnvHTMLElement)),
        "data": /** @class */ (function (_super) {
            __extends(SEnvHTMLDataElement, _super);
            function SEnvHTMLDataElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDataElement;
        }(SEnvHTMLElement)),
        "datalist": /** @class */ (function (_super) {
            __extends(SEnvHTMLDataListElement, _super);
            function SEnvHTMLDataListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDataListElement;
        }(SEnvHTMLElement)),
        "del": /** @class */ (function (_super) {
            __extends(SEnvHTMLModElement, _super);
            function SEnvHTMLModElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLModElement;
        }(SEnvHTMLElement)),
        "dir": /** @class */ (function (_super) {
            __extends(SEnvHTMLDirectoryElement, _super);
            function SEnvHTMLDirectoryElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDirectoryElement;
        }(SEnvHTMLElement)),
        "div": /** @class */ (function (_super) {
            __extends(SEnvHTMLDivElement, _super);
            function SEnvHTMLDivElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDivElement;
        }(SEnvHTMLElement)),
        "dl": /** @class */ (function (_super) {
            __extends(SEnvHTMLDListElement, _super);
            function SEnvHTMLDListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDListElement;
        }(SEnvHTMLElement)),
        "embed": /** @class */ (function (_super) {
            __extends(SEnvHTMLEmbedElement, _super);
            function SEnvHTMLEmbedElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLEmbedElement.prototype.getSVGDocument = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLEmbedElement;
        }(SEnvHTMLElement)),
        "fieldset": /** @class */ (function (_super) {
            __extends(SEnvHTMLFieldSetElement, _super);
            function SEnvHTMLFieldSetElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLFieldSetElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLFieldSetElement.prototype.setCustomValidity = function (error) { };
            return SEnvHTMLFieldSetElement;
        }(SEnvHTMLElement)),
        "font": /** @class */ (function (_super) {
            __extends(SEnvHTMLFontElement, _super);
            function SEnvHTMLFontElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLFontElement;
        }(SEnvHTMLElement)),
        "form": exports.getSEnvHTMLFormElementClass(context),
        "frame": /** @class */ (function (_super) {
            __extends(SEnvHTMLFrameElement, _super);
            function SEnvHTMLFrameElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLFrameElement.prototype.getSVGDocument = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLFrameElement;
        }(SEnvHTMLElement)),
        "frameset": /** @class */ (function (_super) {
            __extends(SEnvHTMLFrameSetElement, _super);
            function SEnvHTMLFrameSetElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLFrameSetElement;
        }(SEnvHTMLElement)),
        "h1": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h2": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h3": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h4": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h5": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h6": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "head": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadElement, _super);
            function SEnvHTMLHeadElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadElement;
        }(SEnvHTMLElement)),
        "hr": /** @class */ (function (_super) {
            __extends(SEnvHTMLHRElement, _super);
            function SEnvHTMLHRElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHRElement;
        }(SEnvHTMLElement)),
        "html": /** @class */ (function (_super) {
            __extends(SEnvHTMLHtmlElement, _super);
            function SEnvHTMLHtmlElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHtmlElement;
        }(SEnvHTMLElement)),
        "iframe": getSEnvHTMLIFrameElementClass(context),
        "img": /** @class */ (function (_super) {
            __extends(SEnvHTMLImageElement, _super);
            function SEnvHTMLImageElement() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.nodeName = "img";
                return _this;
            }
            Object.defineProperty(SEnvHTMLImageElement.prototype, "src", {
                get: function () {
                    return this.getAttribute("src");
                },
                set: function (value) {
                    this.setAttribute("src", value);
                },
                enumerable: true,
                configurable: true
            });
            SEnvHTMLImageElement.prototype.msGetAsCastingSource = function () { };
            SEnvHTMLImageElement.prototype.getPreviewAttribute = function (name) {
                if (name === "src") {
                    var src = this.src;
                    return getProxyUrl(utils_1.getUri(src, this.ownerDocument.defaultView.location.toString()));
                }
                return _super.prototype.getPreviewAttribute.call(this, name);
            };
            return SEnvHTMLImageElement;
        }(SEnvHTMLElement)),
        "input": getSEnvHTMLInputElementClass(context),
        "ins": /** @class */ (function (_super) {
            __extends(SEnvHTMLModElement, _super);
            function SEnvHTMLModElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLModElement;
        }(SEnvHTMLElement)),
        "isindex": /** @class */ (function (_super) {
            __extends(SEnvHTMLUnknownElement, _super);
            function SEnvHTMLUnknownElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLUnknownElement;
        }(SEnvHTMLElement)),
        "label": /** @class */ (function (_super) {
            __extends(SEnvHTMLLabelElement, _super);
            function SEnvHTMLLabelElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLLabelElement;
        }(SEnvHTMLElement)),
        "legend": /** @class */ (function (_super) {
            __extends(SEnvHTMLLegendElement, _super);
            function SEnvHTMLLegendElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLLegendElement;
        }(SEnvHTMLElement)),
        "li": /** @class */ (function (_super) {
            __extends(SEnvHTMLLIElement, _super);
            function SEnvHTMLLIElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLLIElement;
        }(SEnvHTMLElement)),
        "link": exports.getSEnvHTMLLinkElementClass(context),
        "listing": /** @class */ (function (_super) {
            __extends(SEnvHTMLPreElement, _super);
            function SEnvHTMLPreElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPreElement;
        }(SEnvHTMLElement)),
        "map": /** @class */ (function (_super) {
            __extends(SEnvHTMLMapElement, _super);
            function SEnvHTMLMapElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMapElement;
        }(SEnvHTMLElement)),
        "marquee": /** @class */ (function (_super) {
            __extends(SEnvHTMLMarqueeElement, _super);
            function SEnvHTMLMarqueeElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLMarqueeElement.prototype.start = function () { };
            SEnvHTMLMarqueeElement.prototype.stop = function () { };
            return SEnvHTMLMarqueeElement;
        }(SEnvHTMLElement)),
        "menu": /** @class */ (function (_super) {
            __extends(SEnvHTMLMenuElement, _super);
            function SEnvHTMLMenuElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMenuElement;
        }(SEnvHTMLElement)),
        "meta": /** @class */ (function (_super) {
            __extends(SEnvHTMLMetaElement, _super);
            function SEnvHTMLMetaElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMetaElement;
        }(SEnvHTMLElement)),
        "meter": /** @class */ (function (_super) {
            __extends(SEnvHTMLMeterElement, _super);
            function SEnvHTMLMeterElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMeterElement;
        }(SEnvHTMLElement)),
        "nextid": /** @class */ (function (_super) {
            __extends(SEnvHTMLUnknownElement, _super);
            function SEnvHTMLUnknownElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLUnknownElement;
        }(SEnvHTMLElement)),
        "object": /** @class */ (function (_super) {
            __extends(SEnvHTMLObjectElement, _super);
            function SEnvHTMLObjectElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLObjectElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLObjectElement.prototype.setCustomValidity = function (error) { };
            SEnvHTMLObjectElement.prototype.getSVGDocument = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLObjectElement;
        }(SEnvHTMLElement)),
        "ol": /** @class */ (function (_super) {
            __extends(SEnvHTMLOListElement, _super);
            function SEnvHTMLOListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLOListElement;
        }(SEnvHTMLElement)),
        "optgroup": /** @class */ (function (_super) {
            __extends(SEnvHTMLOptGroupElement, _super);
            function SEnvHTMLOptGroupElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLOptGroupElement;
        }(SEnvHTMLElement)),
        "option": /** @class */ (function (_super) {
            __extends(SEnvHTMLOptionElement, _super);
            function SEnvHTMLOptionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLOptionElement;
        }(SEnvHTMLElement)),
        "output": /** @class */ (function (_super) {
            __extends(SEnvHTMLOutputElement, _super);
            function SEnvHTMLOutputElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLOutputElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLOutputElement.prototype.reportValidity = function () {
                return false;
            };
            SEnvHTMLOutputElement.prototype.setCustomValidity = function (error) {
            };
            return SEnvHTMLOutputElement;
        }(SEnvHTMLElement)),
        "p": /** @class */ (function (_super) {
            __extends(SEnvHTMLParagraphElement, _super);
            function SEnvHTMLParagraphElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLParagraphElement;
        }(SEnvHTMLElement)),
        "param": /** @class */ (function (_super) {
            __extends(SEnvHTMLParamElement, _super);
            function SEnvHTMLParamElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLParamElement;
        }(SEnvHTMLElement)),
        "picture": /** @class */ (function (_super) {
            __extends(SEnvHTMLPictureElement, _super);
            function SEnvHTMLPictureElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPictureElement;
        }(SEnvHTMLElement)),
        "pre": /** @class */ (function (_super) {
            __extends(SEnvHTMLPreElement, _super);
            function SEnvHTMLPreElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPreElement;
        }(SEnvHTMLElement)),
        "progress": /** @class */ (function (_super) {
            __extends(SEnvHTMLProgressElement, _super);
            function SEnvHTMLProgressElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLProgressElement;
        }(SEnvHTMLElement)),
        "q": /** @class */ (function (_super) {
            __extends(SEnvHTMLQuoteElement, _super);
            function SEnvHTMLQuoteElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLQuoteElement;
        }(SEnvHTMLElement)),
        "script": exports.getSenvHTMLScriptElementClass(context),
        "select": /** @class */ (function (_super) {
            __extends(SEnvHTMLSelectElement, _super);
            function SEnvHTMLSelectElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLSelectElement.prototype.add = function (element, before) {
            };
            SEnvHTMLSelectElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLSelectElement.prototype.item = function (name, index) { };
            SEnvHTMLSelectElement.prototype.namedItem = function (name) { };
            SEnvHTMLSelectElement.prototype.remove = function (index) { };
            SEnvHTMLSelectElement.prototype.setCustomValidity = function (error) { };
            return SEnvHTMLSelectElement;
        }(SEnvHTMLElement)),
        "source": /** @class */ (function (_super) {
            __extends(SEnvHTMLSourceElement, _super);
            function SEnvHTMLSourceElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLSourceElement;
        }(SEnvHTMLElement)),
        "span": /** @class */ (function (_super) {
            __extends(SEnvHTMLSpanElement, _super);
            function SEnvHTMLSpanElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLSpanElement;
        }(SEnvHTMLElement)),
        "style": exports.getSEnvHTMLStyleElementClass(context),
        "table": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableElement, _super);
            function SEnvHTMLTableElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableElement.prototype.createCaption = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.createTBody = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.createTFoot = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.createTHead = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.deleteCaption = function () { };
            SEnvHTMLTableElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableElement.prototype.deleteTFoot = function () { };
            SEnvHTMLTableElement.prototype.deleteTHead = function () { };
            SEnvHTMLTableElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableElement;
        }(SEnvHTMLElement)),
        "tbody": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableSectionElement, _super);
            function SEnvHTMLTableSectionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableSectionElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableSectionElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableSectionElement;
        }(SEnvHTMLElement)),
        "td": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableDataCellElement, _super);
            function SEnvHTMLTableDataCellElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableDataCellElement;
        }(SEnvHTMLElement)),
        "template": /** @class */ (function (_super) {
            __extends(SEnvHTMLTemplateElement, _super);
            function SEnvHTMLTemplateElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTemplateElement;
        }(SEnvHTMLElement)),
        "textarea": /** @class */ (function (_super) {
            __extends(SEnvHTMLTextAreaElement, _super);
            function SEnvHTMLTextAreaElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTextAreaElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLTextAreaElement.prototype.select = function () { };
            SEnvHTMLTextAreaElement.prototype.setCustomValidity = function (error) { };
            SEnvHTMLTextAreaElement.prototype.setSelectionRange = function (start, end) { };
            return SEnvHTMLTextAreaElement;
        }(SEnvHTMLElement)),
        "tfoot": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableSectionElement, _super);
            function SEnvHTMLTableSectionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableSectionElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableSectionElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableSectionElement;
        }(SEnvHTMLElement)),
        "th": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableHeaderCellElement, _super);
            function SEnvHTMLTableHeaderCellElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableHeaderCellElement;
        }(SEnvHTMLElement)),
        "thead": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableSectionElement, _super);
            function SEnvHTMLTableSectionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableSectionElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableSectionElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableSectionElement;
        }(SEnvHTMLElement)),
        "time": /** @class */ (function (_super) {
            __extends(SEnvHTMLTimeElement, _super);
            function SEnvHTMLTimeElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTimeElement;
        }(SEnvHTMLElement)),
        "title": /** @class */ (function (_super) {
            __extends(SEnvHTMLTitleElement, _super);
            function SEnvHTMLTitleElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTitleElement;
        }(SEnvHTMLElement)),
        "tr": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableRowElement, _super);
            function SEnvHTMLTableRowElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableRowElement.prototype.deleteCell = function (index) { };
            SEnvHTMLTableRowElement.prototype.insertCell = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableRowElement;
        }(SEnvHTMLElement)),
        "track": /** @class */ (function (_super) {
            __extends(SEnvHTMLTrackElement, _super);
            function SEnvHTMLTrackElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTrackElement;
        }(SEnvHTMLElement)),
        "ul": /** @class */ (function (_super) {
            __extends(SEnvHTMLUListElement, _super);
            function SEnvHTMLUListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLUListElement;
        }(SEnvHTMLElement)),
        "video": /** @class */ (function (_super) {
            __extends(SEnvHTMLVideoElement, _super);
            function SEnvHTMLVideoElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLVideoElement.prototype.addTextTrack = function (kind, label, language) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.canPlayType = function (type) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.load = function () { };
            SEnvHTMLVideoElement.prototype.msClearEffects = function () { };
            SEnvHTMLVideoElement.prototype.msGetAsCastingSource = function () { };
            SEnvHTMLVideoElement.prototype.msInsertAudioEffect = function (activatableClassId, effectRequired, config) { };
            SEnvHTMLVideoElement.prototype.msSetMediaKeys = function (mediaKeys) { };
            SEnvHTMLVideoElement.prototype.msSetMediaProtectionManager = function (mediaProtectionManager) {
            };
            SEnvHTMLVideoElement.prototype.pause = function () { };
            SEnvHTMLVideoElement.prototype.play = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.setMediaKeys = function (mediaKeys) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.getVideoPlaybackQuality = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.msFrameStep = function (forward) { };
            SEnvHTMLVideoElement.prototype.msInsertVideoEffect = function (activatableClassId, effectRequired, config) { };
            SEnvHTMLVideoElement.prototype.msSetVideoRectangle = function (left, top, right, bottom) { };
            SEnvHTMLVideoElement.prototype.webkitEnterFullscreen = function () { };
            SEnvHTMLVideoElement.prototype.webkitEnterFullScreen = function () { };
            SEnvHTMLVideoElement.prototype.webkitExitFullscreen = function () { };
            SEnvHTMLVideoElement.prototype.webkitExitFullScreen = function () { };
            return SEnvHTMLVideoElement;
        }(SEnvHTMLElement)),
        "xmp": /** @class */ (function (_super) {
            __extends(SEnvHTMLPreElement, _super);
            function SEnvHTMLPreElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPreElement;
        }(SEnvHTMLElement))
    };
});
exports.diffHTMLNode = function (oldElement, newElement) {
    if (oldElement.nodeName.toLowerCase() === "link") {
        return exports.diffHTMLLinkElement(oldElement, newElement);
    }
    else if (oldElement.nodeName.toLowerCase() === "style") {
        return exports.diffHTMLStyleElement(oldElement, newElement);
    }
    else if (oldElement.nodeName.toLowerCase() === "canvas") {
        return difHTMLCanvasElement(oldElement, newElement);
    }
    return element_1.diffBaseNode(oldElement, newElement, exports.diffHTMLNode);
};
exports.baseHTMLElementMutators = __assign({}, element_1.baseElementMutators, css_1.cssStyleSheetMutators, canvasMutators);
var _a;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/html-elements.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/html-elements.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/light-document.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var parent_node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
exports.getSenvLightDocumentClass = function (context) {
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    var _a = collections_1.getSEnvHTMLCollectionClasses(context), SEnvStyleSheetList = _a.SEnvStyleSheetList, SEnvHTMLAllCollection = _a.SEnvHTMLAllCollection;
    var SEnvLightDocument = /** @class */ (function (_super) {
        __extends(SEnvLightDocument, _super);
        function SEnvLightDocument() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvLightDocument.prototype.getSelection = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        Object.defineProperty(SEnvLightDocument.prototype, "stylesheets", {
            get: function () {
                return this._stylesheets || (this._stylesheets = this._createStyleSheetList());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvLightDocument.prototype, "innerHTML", {
            get: function () {
                return "";
            },
            set: function (value) {
                this._throwUnsupportedMethod();
            },
            enumerable: true,
            configurable: true
        });
        SEnvLightDocument.prototype._createStyleSheetList = function () {
            var styleSheets = [];
            Array.prototype.forEach.call(this.querySelectorAll("*"), function (element) {
                if (element.nodeType === constants_1.SEnvNodeTypes.ELEMENT && element["sheet"]) {
                    styleSheets.push(element["sheet"]);
                }
            });
            return new (SEnvStyleSheetList.bind.apply(SEnvStyleSheetList, [void 0].concat(styleSheets)))();
        };
        Object.defineProperty(SEnvLightDocument.prototype, "styleSheets", {
            get: function () {
                return this.stylesheets;
            },
            enumerable: true,
            configurable: true
        });
        SEnvLightDocument.prototype.elementFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvLightDocument.prototype.elementsFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvLightDocument.prototype.getElementById = function (elementId) {
            return this.querySelector("#" + elementId);
        };
        SEnvLightDocument.prototype._onMutation = function (event) {
            _super.prototype._onMutation.call(this, event);
            var mutation = event.mutation;
            if (mutation.type === constants_2.INSERT_CHILD_NODE_EDIT || mutation.type === constants_2.REMOVE_CHILD_NODE_EDIT) {
                this._stylesheets = null;
            }
        };
        return SEnvLightDocument;
    }(SEnvParentNode));
    return SEnvLightDocument;
};
exports.getHostDocument = function (node) {
    var p = node;
    // return shadow root since :host selector may be applied
    if (p["shadowRoot"]) {
        return p["shadowRoot"];
    }
    while (p && p.nodeType !== constants_1.SEnvNodeTypes.DOCUMENT && p.nodeType !== constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT) {
        p = p.parentNode;
    }
    return p;
};
exports.getSEnvShadowRootClass = function (context) {
    var SEnvLightDocument = exports.getSenvLightDocumentClass(context);
    var SEnvShadowRoot = /** @class */ (function (_super) {
        __extends(SEnvShadowRoot, _super);
        function SEnvShadowRoot() {
            var _this = _super.call(this) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT;
            _this.nodeName = "#document-fragment";
            return _this;
        }
        SEnvShadowRoot.prototype.cloneShallow = function () {
            return new SEnvShadowRoot();
        };
        SEnvShadowRoot.prototype.createStruct = function () {
            return __assign({}, _super.prototype.createStruct.call(this), { hostId: this.host ? this.host.$id : null });
        };
        return SEnvShadowRoot;
    }(SEnvLightDocument));
    return SEnvShadowRoot;
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/light-document.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/light-document.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/node.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var exceptions_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/exceptions.ts");
var events_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
var named_node_map_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/named-node-map.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
;
exports.getSEnvNodeClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvEventTarget = events_2.getSEnvEventTargetClass(context);
    var SEnvNamedNodeMap = named_node_map_1.getSEnvNamedNodeMapClass(context);
    var SEnvNodeList = collections_1.getSEnvHTMLCollectionClasses(context).SEnvNodeList;
    var SEnvDOMException = exceptions_1.getDOMExceptionClasses(context).SEnvDOMException;
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvNode, _super);
        function SEnvNode() {
            var _this = _super.call(this) || this;
            _this.$id = aerial_common2_1.generateDefaultId();
            _this.childNodes = _this.childNodesArray = new SEnvNodeList();
            // called specifically for elements
            if (_this._constructed) {
                throw new Error("Cannot call constructor twice.");
            }
            _this._constructed = true;
            _this.addEventListener(SEnvMutationEvent.MUTATION, _this._onMutation.bind(_this));
            return _this;
        }
        Object.defineProperty(SEnvNode.prototype, "assignedSlot", {
            get: function () {
                return this._assignedSlot;
            },
            enumerable: true,
            configurable: true
        });
        SEnvNode.prototype.$$setAssignedSlot = function (value) {
            this._assignedSlot = value;
            if (value) {
                this.slottedCallback();
            }
            else {
                this.unslottedCallback();
            }
        };
        Object.defineProperty(SEnvNode.prototype, "$id", {
            get: function () {
                return this._$id;
            },
            set: function (value) {
                this._$id = value;
                // TODO - probably want to dispatch a mutation change
                this._struct = undefined;
            },
            enumerable: true,
            configurable: true
        });
        SEnvNode.prototype.initialize = function () {
        };
        Object.defineProperty(SEnvNode.prototype, "ownerDocument", {
            get: function () {
                return this._ownerDocument;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "nextSibling", {
            get: function () {
                return this.parentNode.childNodes[Array.prototype.indexOf.call(this.parentNode.childNodes, this) + 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "previousSibling", {
            get: function () {
                return this.parentNode.childNodes[Array.prototype.indexOf.call(this.parentNode.childNodes, this) - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "offsetParent", {
            get: function () {
                // TODO - read the docs: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
                // Impl here is partial.
                return this.parentNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "parentNode", {
            get: function () {
                return this.$$parentNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "parentElement", {
            get: function () {
                return this.$$parentNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "firstChild", {
            get: function () {
                return this.childNodes[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "lastChild", {
            get: function () {
                return this.childNodes[this.childNodes.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "struct", {
            get: function () {
                if (!this._struct) {
                    this.updateStruct();
                }
                return this._struct;
            },
            enumerable: true,
            configurable: true
        });
        SEnvNode.prototype.setSource = function (source) {
            this.source = source;
            this.dispatchMutationEvent(exports.createSyntheticSourceChangeMutation(this, source));
        };
        SEnvNode.prototype.updateStruct = function () {
            this._struct = this.createStruct();
        };
        SEnvNode.prototype.createStruct = function () {
            return {
                parentId: this.parentNode ? this.parentNode.$id : null,
                nodeType: this.nodeType,
                nodeName: this.nodeName,
                source: this.source,
                instance: this,
                $type: this.structType,
                $id: this.$id
            };
        };
        SEnvNode.prototype._linkChild = function (child) {
        };
        SEnvNode.prototype.appendChild = function (newChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.cloneNode = function (deep) {
            var clone = this.cloneShallow();
            clone["" + "nodeName"] = this.nodeName;
            clone["" + "_initialized"] = this._initialized;
            clone.source = this.source;
            clone.$id = this.$id;
            if (deep !== false) {
                for (var i = 0, n = this.childNodes.length; i < n; i++) {
                    var child = this.childNodes[i].cloneNode(true);
                    // do NOT call appendChild to ensure that mutation events
                    // aren't triggered.
                    Array.prototype.push.call(clone.childNodes, child);
                    clone["" + "_linkChild"](child);
                }
            }
            return clone;
        };
        SEnvNode.prototype.cloneShallow = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.compareDocumentPosition = function (other) {
            return 0;
        };
        SEnvNode.prototype.contains = function (child) {
            return Array.prototype.indexOf.call(this.childNodes, child) !== -1;
        };
        SEnvNode.prototype.remove = function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
        SEnvNode.prototype.hasAttributes = function () {
            return this.attributes.length > 0;
        };
        SEnvNode.prototype.hasChildNodes = function () {
            return this.childNodes.length > 0;
        };
        SEnvNode.prototype.insertBefore = function (newChild, refChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.isDefaultNamespace = function (namespaceURI) {
            return false;
        };
        SEnvNode.prototype.isEqualNode = function (arg) {
            return false;
        };
        SEnvNode.prototype.isSameNode = function (other) {
            return false;
        };
        SEnvNode.prototype.lookupNamespaceURI = function (prefix) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.lookupPrefix = function (namespaceURI) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.normalize = function () { };
        SEnvNode.prototype.removeChild = function (oldChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.connectedCallback = function () {
            if (this._initialized) {
                this.initialize();
            }
        };
        SEnvNode.prototype.disconnectedCallback = function () {
        };
        SEnvNode.prototype.paintedCallback = function () {
            // override me
        };
        SEnvNode.prototype._onMutation = function (event) {
            this._struct = undefined;
        };
        // non-standard
        SEnvNode.prototype.slottedCallback = function () {
            for (var i = 0, length_1 = this.childNodes.length; i < length_1; i++) {
                this.childNodes[i].slottedCallback();
            }
        };
        SEnvNode.prototype.unslottedCallback = function () {
            for (var i = 0, length_2 = this.childNodes.length; i < length_2; i++) {
                this.childNodes[i].unslottedCallback();
            }
        };
        SEnvNode.prototype.replaceChild = function (newChild, oldChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype._throwUnsupportedMethod = function () {
            throw new SEnvDOMException("This node (" + this["constructor"].name + ") type does not support this method.");
        };
        SEnvNode.prototype.$$setConnectedToDocument = function (value) {
            if (this.connectedToDocument === value) {
                return;
            }
            this.connectedToDocument = value;
            if (value) {
                this.connectedCallback();
            }
            else {
                this.disconnectedCallback();
            }
            for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
                var child = _a[_i];
                child.$$setConnectedToDocument(value);
            }
        };
        SEnvNode.prototype._getDefaultView = function () {
            return this.nodeType === constants_1.SEnvNodeTypes.DOCUMENT ? this.defaultView : this.ownerDocument.defaultView;
        };
        SEnvNode.prototype.$$setOwnerDocument = function (document) {
            if (this.ownerDocument === document) {
                return;
            }
            this._ownerDocument = document;
            if (this.childNodes) {
                for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.$$setOwnerDocument(document);
                }
            }
        };
        SEnvNode.prototype.$$removedFromDocument = function () {
            this.connectedToDocument = false;
        };
        SEnvNode.prototype.dispatchEvent = function (event) {
            _super.prototype.dispatchEvent.call(this, event);
            // do not bubble if still constructing
            if (this.$$canBubbleParent && event.bubbles && this.$$parentNode) {
                this.$$parentNode.dispatchEvent(event);
            }
            return true;
        };
        SEnvNode.prototype.dispatchMutationEvent = function (mutation) {
            var e = new SEnvMutationEvent();
            e.initMutationEvent(mutation);
            this.dispatchEvent(e);
        };
        return SEnvNode;
    }(SEnvEventTarget));
});
exports.getSEnvValueNode = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = exports.getSEnvNodeClass(context);
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    return /** @class */ (function (_super) {
        __extends(SenvValueNode, _super);
        function SenvValueNode(_nodeValue) {
            var _this = _super.call(this) || this;
            _this._nodeValue = _nodeValue;
            return _this;
        }
        Object.defineProperty(SenvValueNode.prototype, "nodeValue", {
            get: function () {
                return this._nodeValue;
            },
            set: function (value) {
                this._nodeValue = value;
                this.dispatchMutationEvent(source_mutation_1.createPropertyMutation(constants_2.UPDATE_VALUE_NODE, this, "nodeValue", value, undefined));
            },
            enumerable: true,
            configurable: true
        });
        SenvValueNode.prototype.createStruct = function () {
            return __assign({}, _super.prototype.createStruct.call(this), { nodeValue: this._nodeValue });
        };
        return SenvValueNode;
    }(SEnvNode));
});
exports.SET_SYNTHETIC_SOURCE_CHANGE = "SET_SYNTHETIC_SOURCE_CHANGE";
exports.createSyntheticSourceChangeMutation = function (target, value) { return source_mutation_1.createPropertyMutation(exports.SET_SYNTHETIC_SOURCE_CHANGE, target, "source", value); };
exports.diffNodeBase = function (oldNode, newNode) {
    var mutations = [];
    if (!aerial_common2_1.expressionLocationEquals(oldNode.source, newNode.source)) {
        mutations.push(exports.createSyntheticSourceChangeMutation(oldNode, newNode.source));
    }
    return mutations;
};
exports.nodeMutators = (_a = {},
    _a[exports.SET_SYNTHETIC_SOURCE_CHANGE] = function (oldNode, _a) {
        var newValue = _a.newValue;
        // may not exist if oldNode is a DOM node
        if (oldNode.setSource) {
            oldNode.setSource(newValue && JSON.parse(JSON.stringify(newValue)));
        }
    },
    _a);
exports.createUpdateValueNodeMutation = function (oldNode, newValue) {
    return source_mutation_1.createSetValueMutation(constants_2.UPDATE_VALUE_NODE, oldNode, newValue);
};
exports.diffValueNode = function (oldNode, newNode) {
    var mutations = [];
    if (oldNode.nodeValue !== newNode.nodeValue) {
        mutations.push(exports.createUpdateValueNodeMutation(oldNode, newNode.nodeValue));
    }
    return mutations.concat(exports.diffNodeBase(oldNode, newNode));
};
exports.valueNodeMutators = (_b = {},
    _b[constants_2.UPDATE_VALUE_NODE] = function (oldNode, _a) {
        var newValue = _a.newValue;
        oldNode.nodeValue = newValue;
    },
    _b);
exports.baseNodeMutators = __assign({}, exports.nodeMutators, exports.valueNodeMutators);
var _a, _b;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/node.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/node.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/parent-node.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
var exceptions_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/exceptions.ts");
var level3_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/level3/index.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/utils.ts");
exports.getSEnvParentNodeClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvDOMException = exceptions_1.getDOMExceptionClasses(context).SEnvDOMException;
    var SEnvHTMLCollection = collections_1.getSEnvHTMLCollectionClasses(context).SEnvHTMLCollection;
    var SEnvMutationEvent = level3_1.getL3EventClasses(context).SEnvMutationEvent;
    var SEnvMutationEvent2 = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvParentNode, _super);
        function SEnvParentNode() {
            var _this = _super.call(this) || this;
            _this._children = new SEnvHTMLCollection().$init(_this);
            return _this;
        }
        Object.defineProperty(SEnvParentNode.prototype, "children", {
            get: function () {
                return this._children.update();
            },
            enumerable: true,
            configurable: true
        });
        SEnvParentNode.prototype.appendChild = function (child) {
            return this.insertChildAt(child, this.childNodes.length);
        };
        SEnvParentNode.prototype.insertBefore = function (newChild, refChild) {
            // if null, then append -- this is to spec. See MSDN docs about this.
            if (refChild == null) {
                return this.appendChild(newChild);
            }
            var index = Array.prototype.indexOf.call(this.childNodes, refChild);
            if (index === -1) {
                throw new SEnvDOMException("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
            }
            if (Array.prototype.indexOf.call(this.childNodes, newChild) !== -1) {
                throw new Error("Inserting child that already exists");
            }
            return this.insertChildAt(newChild, index);
        };
        SEnvParentNode.prototype.createStruct = function (parentNode) {
            return __assign({}, _super.prototype.createStruct.call(this), { childNodes: Array.prototype.map.call(this.childNodes, function (child) { return child.struct; }) });
        };
        SEnvParentNode.prototype.insertChildAt = function (child, index) {
            if (child.nodeType === constants_2.SEnvNodeTypes.DOCUMENT_FRAGMENT) {
                while (child.childNodes.length) {
                    this.insertChildAt(child.lastChild, index);
                }
                return child;
            }
            var c = child;
            if (c.$$parentNode) {
                c.$$parentNode.removeChild(child);
            }
            this.childNodesArray.splice(index, 0, child);
            var event2 = new SEnvMutationEvent2();
            // need to link child _now_ in case connectedCallback triggers additional
            // children to be created (web components). We do _not_ want those mutations
            // to dispatch a mutation that causes a patch to the DOM renderer
            this._linkChild(c);
            // dispatch insertion now after it's completely linked
            event2.initMutationEvent(exports.createParentNodeInsertChildMutation(this, child, index));
            this.dispatchEvent(event2);
            return child;
        };
        SEnvParentNode.prototype.removeChild = function (child) {
            var index = this.childNodesArray.indexOf(child);
            if (index === -1) {
                throw new SEnvDOMException("The node to be removed is not a child of this node.");
            }
            // needs to come after so that 
            this.childNodesArray.splice(index, 1);
            var event2 = new SEnvMutationEvent2();
            event2.initMutationEvent(exports.createParentNodeRemoveChildMutation(this, child, index));
            this.dispatchEvent(event2);
            this._unlinkChild(child);
            return child;
        };
        SEnvParentNode.prototype.querySelector = function (selectors) {
            return utils_1.querySelector(this, selectors);
        };
        SEnvParentNode.prototype.getElementsByName = function (elementName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvParentNode.prototype.getElementsByClassName = function (classNames) {
            // TODO - need to allow for multiple class names
            return this.querySelectorAll(classNames.split(/\s+/g).map(function (className) { return "." + className; }).join(","));
        };
        SEnvParentNode.prototype.getElementsByTagName = function (tagName) {
            return this.querySelectorAll(tagName);
        };
        SEnvParentNode.prototype.getElementsByTagNameNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvParentNode.prototype.querySelectorAll = function (selectors) {
            // TODO - not actually an array here
            return utils_1.querySelectorAll(this, selectors);
        };
        SEnvParentNode.prototype.replaceChild = function (newChild, oldChild) {
            var index = this.childNodesArray.indexOf(oldChild);
            if (index === -1) {
                throw new SEnvDOMException("The node to be replaced is not a child of this node.");
            }
            this.childNodesArray.splice(index, 1, newChild);
            return oldChild;
        };
        Object.defineProperty(SEnvParentNode.prototype, "firstElementChild", {
            get: function () {
                return this.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvParentNode.prototype, "textContent", {
            get: function () {
                return Array.prototype.map.call(this.childNodes, function (child) { return child.textContent; }).join("");
            },
            set: function (value) {
                this.removeAllChildren();
                var textNode = this.ownerDocument.createTextNode(value);
                this.appendChild(textNode);
            },
            enumerable: true,
            configurable: true
        });
        SEnvParentNode.prototype.removeAllChildren = function () {
            while (this.childNodes.length) {
                this.removeChild(this.childNodes[0]);
            }
        };
        Object.defineProperty(SEnvParentNode.prototype, "lastElementChild", {
            get: function () {
                return this.children[this.children.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvParentNode.prototype, "childElementCount", {
            get: function () {
                return this.children.length;
            },
            enumerable: true,
            configurable: true
        });
        SEnvParentNode.prototype._linkChild = function (child) {
            child.$$parentNode = this;
            child.$$setOwnerDocument(this.nodeType === constants_2.SEnvNodeTypes.DOCUMENT ? this : this.ownerDocument);
            child.$$setConnectedToDocument(this.nodeType === constants_2.SEnvNodeTypes.DOCUMENT ? true : this.connectedToDocument);
            child.$$canBubbleParent = true;
        };
        SEnvParentNode.prototype._unlinkChild = function (child) {
            child.$$canBubbleParent = false;
            child.$$parentNode = null;
            child.$$setConnectedToDocument(this.nodeType === constants_2.SEnvNodeTypes.DOCUMENT ? false : this.connectedToDocument);
            if (child.connectedToDocument) {
                child.$$removedFromDocument();
            }
        };
        return SEnvParentNode;
    }(SEnvNode));
});
exports.cloneNode = function (node, deep) {
    if (node.constructor === Object)
        return JSON.parse(JSON.stringify(node));
    return node.cloneNode(deep);
};
exports.createParentNodeInsertChildMutation = function (parent, child, index, cloneChild) {
    if (cloneChild === void 0) { cloneChild = true; }
    return source_mutation_1.createInsertChildMutation(constants_1.INSERT_CHILD_NODE_EDIT, parent, child, index, cloneChild);
};
exports.createParentNodeRemoveChildMutation = function (parent, child, index) {
    return source_mutation_1.createRemoveChildMutation(constants_1.REMOVE_CHILD_NODE_EDIT, parent, child, index != null ? index : Array.from(parent.childNodes).indexOf(child));
};
exports.createParentNodeMoveChildMutation = function (oldNode, child, index, patchedOldIndex) {
    return source_mutation_1.createMoveChildMutation(constants_1.MOVE_CHILD_NODE_EDIT, oldNode, child, patchedOldIndex || Array.from(oldNode.childNodes).indexOf(child), index);
};
exports.diffParentNode = function (oldNode, newNode, diffChildNode) {
    var mutations = [];
    var diff = source_mutation_1.diffArray(Array.from(oldNode.childNodes), Array.from(newNode.childNodes), function (oldNode, newNode) {
        if (oldNode.nodeName !== newNode.nodeName || oldNode.namespaceURI !== newNode.namespaceURI)
            return -1;
        return 1;
    });
    source_mutation_1.eachArrayValueMutation(diff, {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            mutations.push(exports.createParentNodeInsertChildMutation(oldNode, value, index));
        },
        delete: function (_a) {
            var index = _a.index;
            mutations.push(exports.createParentNodeRemoveChildMutation(oldNode, oldNode.childNodes[index]));
        },
        update: function (_a) {
            var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
            if (patchedOldIndex !== index) {
                mutations.push(exports.createParentNodeMoveChildMutation(oldNode, oldNode.childNodes[originalOldIndex], index, patchedOldIndex));
            }
            var oldValue = oldNode.childNodes[originalOldIndex];
            mutations.push.apply(mutations, diffChildNode(oldValue, newValue));
        }
    });
    mutations.push.apply(mutations, node_1.diffNodeBase(oldNode, newNode));
    return mutations;
};
var insertChildNodeAt = function (parent, child, index) {
    if (index >= parent.childNodes.length || parent.childNodes.length === 0) {
        parent.appendChild(child);
    }
    else {
        var before_1 = parent.childNodes[index];
        parent.insertBefore(child, before_1);
    }
};
exports.parentNodeMutators = __assign({}, node_1.baseNodeMutators, (_a = {}, _a[constants_1.REMOVE_CHILD_NODE_EDIT] = function (oldNode, _a) {
    var index = _a.index, child = _a.child;
    oldNode.removeChild(oldNode.childNodes[index]);
}, _a[constants_1.MOVE_CHILD_NODE_EDIT] = function (oldNode, _a) {
    var oldIndex = _a.oldIndex, index = _a.index;
    insertChildNodeAt(oldNode, oldNode.childNodes[oldIndex], index);
}, _a[constants_1.INSERT_CHILD_NODE_EDIT] = function (oldNode, _a) {
    var index = _a.index, child = _a.child, clone = _a.clone;
    insertChildNodeAt(oldNode, clone !== false ? exports.cloneNode(child, true) : child, index);
}, _a));
var _a;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/parent-node.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/parent-node.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/text.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
exports.getSEnvTextClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvValueNode = node_1.getSEnvValueNode(context);
    return /** @class */ (function (_super) {
        __extends(SEnvText, _super);
        function SEnvText() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.TEXT;
            _this.structType = state_1.SYNTHETIC_TEXT_NODE;
            _this.nodeName = "#text";
            return _this;
        }
        Object.defineProperty(SEnvText.prototype, "textContent", {
            get: function () {
                return this.nodeValue;
            },
            set: function (value) {
                this.nodeValue = value;
            },
            enumerable: true,
            configurable: true
        });
        SEnvText.prototype.cloneShallow = function () {
            return this.ownerDocument.createTextNode(this.nodeValue);
        };
        SEnvText.prototype.splitText = function (offset) {
            return null;
        };
        SEnvText.prototype.appendData = function (arg) { };
        SEnvText.prototype.deleteData = function (offset, count) { };
        SEnvText.prototype.insertData = function (offset, arg) { };
        SEnvText.prototype.replaceData = function (offset, count, arg) { };
        SEnvText.prototype.substringData = function (offset, count) {
            return null;
        };
        return SEnvText;
    }(SEnvValueNode));
});
exports.diffTextNode = function (oldNode, newNode) {
    return node_1.diffValueNode(oldNode, newNode);
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/text.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/text.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/renderers/mirror.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/renderers/base.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
var SEnvWrapperEvent = events_1.getSEnvEventClasses().SEnvWrapperEvent;
var SyntheticMirrorRenderer = /** @class */ (function (_super) {
    __extends(SyntheticMirrorRenderer, _super);
    function SyntheticMirrorRenderer(window) {
        var _this = _super.call(this, window) || this;
        _this.container = null;
        _this._onSourcePainted = function (event) {
            _this._sync();
        };
        _this._onSourceEvent = function (_a) {
            var nativeEvent = _a.nativeEvent, targetNodeId = _a.targetNodeId;
            var target = state_1.getSyntheticNodeById(_this._sourceWindow.struct, targetNodeId);
            if (target) {
                // TODO - need syncElement function
                target.instance.value = nativeEvent.target.value;
                var wrapperEvent = new SEnvWrapperEvent();
                wrapperEvent.init(nativeEvent);
                target.instance.dispatchEvent(wrapperEvent);
            }
            else {
                console.warn("Cannot dispatch synthetic event " + nativeEvent.type + " on element " + targetNodeId + ".");
            }
        };
        return _this;
    }
    SyntheticMirrorRenderer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(SyntheticMirrorRenderer.prototype, "source", {
        set: function (source) {
            this._disposeSourceListeners();
            this._source = source;
            if (this._source) {
                this._source.addEventListener(base_1.SyntheticWindowRendererEvent.PAINTED, this._onSourcePainted);
                this._source.addEventListener(base_1.SyntheticWindowRendererNativeEvent.NATIVE_EVENT, this._onSourceEvent);
                this._sync();
            }
        },
        enumerable: true,
        configurable: true
    });
    SyntheticMirrorRenderer.prototype.dispose = function () {
        this._disposeSourceListeners();
    };
    SyntheticMirrorRenderer.prototype._disposeSourceListeners = function () {
        if (this._source) {
            this._source.removeEventListener(base_1.SyntheticWindowRendererEvent.PAINTED, this._onSourcePainted);
            this._source.removeEventListener(base_1.SyntheticWindowRendererNativeEvent.NATIVE_EVENT, this._onSourceEvent);
        }
    };
    SyntheticMirrorRenderer.prototype._sync = function () {
        if (this._source.computedStyles) {
            this.setPaintedInfo(this._source.clientRects, this._source.computedStyles, this._source.scrollRect, this._source.scrollPosition);
        }
    };
    return SyntheticMirrorRenderer;
}(base_1.BaseSyntheticWindowRenderer));
exports.SyntheticMirrorRenderer = SyntheticMirrorRenderer;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/mirror.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/mirror.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/window.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
var location_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/location.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var renderers_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/renderers/index.ts");
var timers_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/timers.ts");
var media_match_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/media-match.ts");
var local_storage_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/local-storage.ts");
var css_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/index.ts");
var nodes_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/index.ts");
var custom_element_registry_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/custom-element-registry.ts");
var nwmatcher = __webpack_require__("../../../../../public/nwmatcher/src/nwmatcher.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
;
exports.mirrorWindow = function (target, source) {
    var _a = events_1.getSEnvEventClasses(), SEnvMutationEvent = _a.SEnvMutationEvent, SEnvWindowOpenedEvent = _a.SEnvWindowOpenedEvent, SEnvURIChangedEvent = _a.SEnvURIChangedEvent, SEnvWindowEvent = _a.SEnvWindowEvent;
    source.renderer.source = target.renderer;
    if (target.$id !== source.$id) {
        throw new Error("target must be a previous clone of the source.");
    }
    var sync = function () {
        exports.patchWindow(target, exports.diffWindow(target, source));
        // sync window Ids to ensure future mutation events. This
        // also doubles as a sanity check for patching. 
        exports.syncWindowIds(target, source);
    };
    // TODO - need to sync mutations from target to source since
    // the editor mutates the target -- changes need to be reflected in the source
    // so that incomming source mutations are properly mapped back to the target. 
    // happens with dynamic content.
    var onMutation = function (_a) {
        var mutation = _a.mutation;
        var childObjects = exports.flattenWindowObjectSources(target.struct);
        // likely a full window reload. In that case, need to diff & patch
        if (!childObjects[mutation.target.$id]) {
            console.warn("Could not find matching mutation target, slowly syncing windows.", mutation);
            sync();
        }
        else {
            exports.patchWindow(target, [mutation]);
        }
    };
    var mirrorEvent = function (event) {
        target.dispatchEvent(event);
    };
    var tryPatching = function () {
        if (source.document.readyState !== "complete") {
            return;
        }
        sync();
        source.addEventListener(SEnvMutationEvent.MUTATION, onMutation);
    };
    var onResize = function (event) {
        target.resizeTo(source.innerWidth, source.innerHeight);
    };
    var onMove = function (event) {
        target.moveTo(source.screenLeft, source.screenTop);
    };
    var onTargetMove = function (event) {
        source.moveTo(target.screenLeft, target.screenTop);
    };
    var onTargetResize = function (event) {
        source.resizeTo(target.innerWidth, target.innerHeight);
    };
    var onClose = function (event) {
        target.close();
    };
    var onResourceChanged = function (event) {
        target.$setExternalUris(source.externalResourceUris);
    };
    var onUriChanged = function (event) { return target.dispatchEvent(event); };
    source.resizeTo(target.innerWidth, target.innerHeight);
    source.moveTo(target.screenLeft, target.screenTop);
    source.addEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
    source.addEventListener("move", onMove);
    source.addEventListener("resize", onResize);
    source.addEventListener("close", onClose);
    source.addEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
    target.addEventListener("move", onTargetMove);
    target.addEventListener("resize", onTargetResize);
    source.document.addEventListener("readystatechange", tryPatching);
    source.addEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, onResourceChanged);
    tryPatching();
    return function () {
        source.removeEventListener(SEnvMutationEvent.MUTATION, onMutation);
        source.removeEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
        source.removeEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
        source.removeEventListener("move", onMove);
        source.removeEventListener("resize", onResize);
        source.removeEventListener("close", onClose);
        target.removeEventListener("move", onTargetMove);
        target.removeEventListener("resize", onTargetResize);
        target.removeEventListener("readystatechange", tryPatching);
        source.removeEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, onResourceChanged);
    };
};
var defaultFetch = (function (info) {
    throw new Error("Fetch not provided for " + info);
});
var throwUnsupportedMethod = function () {
    throw new Error("Unsupported");
};
exports.getSEnvWindowClass = aerial_common2_1.weakMemo(function (context) {
    var createRenderer = context.createRenderer, _a = context.fetch, fetch = _a === void 0 ? defaultFetch : _a, _b = context.getProxyUrl, getProxyUrl = _b === void 0 ? lodash_1.identity : _b;
    var SEnvEventTarget = events_1.getSEnvEventTargetClass(context);
    var SEnvDocument = nodes_1.getSEnvDocumentClass(context);
    var SEnvLocation = location_1.getSEnvLocationClass(context);
    var SEnvCustomElementRegistry = custom_element_registry_1.getSEnvCustomElementRegistry(context);
    var SEnvElement = nodes_1.getSEnvElementClass(context);
    var SEnvHTMLElement = nodes_1.getSEnvHTMLElementClass(context);
    var SEnvLocalStorage = local_storage_1.getSEnvLocalStorageClass(context);
    var SEnvDOMImplementation = nodes_1.getSEnvDOMImplementationClass(context);
    var SEnvTimers = timers_1.getSEnvTimerClasses(context).SEnvTimers;
    var _c = events_1.getSEnvEventClasses(context), SEnvEvent = _c.SEnvEvent, SEnvMutationEvent = _c.SEnvMutationEvent, SEnvWindowOpenedEvent = _c.SEnvWindowOpenedEvent, SEnvURIChangedEvent = _c.SEnvURIChangedEvent, SEnvWindowEvent = _c.SEnvWindowEvent;
    var _d = css_1.getSEnvCSSRuleClasses(context), SEnvCSSFontFace = _d.SEnvCSSFontFace, SEnvCSSKeyframesRule = _d.SEnvCSSKeyframesRule, SEnvCSSMediaRule = _d.SEnvCSSMediaRule, SEnvCSSStyleRule = _d.SEnvCSSStyleRule, SEnvUnknownGroupingRule = _d.SEnvUnknownGroupingRule;
    var SEnvCSSStyleDeclaration = css_1.getSEnvCSSStyleDeclarationClass(context);
    var SEnvCSSStyleSheet = css_1.getSEnvCSSStyleSheetClass(context);
    // register default HTML tag names
    var TAG_NAME_MAP = nodes_1.getSEnvHTMLElementClasses(context);
    var SEnvNavigator = /** @class */ (function () {
        function SEnvNavigator() {
            this.doNotTrack = null;
            this.appCodeName = "Tandem";
            this.appName = "Tandem";
            this.appVersion = "1.0";
            this.platform = "Tandem";
            this.product = "Tandem";
            this.productSub = "tandem";
            this.userAgent = "Tandem";
            this.vendor = "Tandem";
            this.vendorSub = "Tandem";
            this.cookieEnabled = true;
            this.onLine = true;
            this.language = "en/us";
            this.maxTouchPoints = 0;
            this.plugins = [];
            this.languages = ["en/us"];
        }
        SEnvNavigator.prototype.getUserMedia = function (constraints, successCallback, errorCallback) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.sendBeacon = function (url, data) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.msSaveBlob = function (blob, defaultName) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.msSaveOrOpenBlob = function (blob, defaultName) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.getGamepads = function () {
            throwUnsupportedMethod();
            return [];
        };
        SEnvNavigator.prototype.javaEnabled = function () {
            return false;
        };
        SEnvNavigator.prototype.msLaunchUri = function (uri, successCallback, noHandlerCallback) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.requestMediaKeySystemAccess = function (keySystem, supportedConfigurations) {
            return null;
        };
        SEnvNavigator.prototype.vibrate = function (pattern) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.confirmSiteSpecificTrackingException = function (args) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.confirmWebWideTrackingException = function (args) {
            throwUnsupportedMethod();
            return false;
        };
        SEnvNavigator.prototype.removeSiteSpecificTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.removeWebWideTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.storeSiteSpecificTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        SEnvNavigator.prototype.storeWebWideTrackingException = function (args) {
            throwUnsupportedMethod();
        };
        return SEnvNavigator;
    }());
    return /** @class */ (function (_super) {
        __extends(SEnvWindow, _super);
        function SEnvWindow(origin, browserId, top) {
            var _this = _super.call(this) || this;
            _this.browserId = browserId;
            _this.console = context.console;
            _this.$synthetic = true;
            _this.name = "";
            _this.scrollX = 0;
            _this.scrollY = 0;
            _this.CustomEvent = SEnvEvent;
            _this._scrollRect = { width: Infinity, height: Infinity };
            // classes
            _this.EventTarget = SEnvEventTarget;
            _this.Element = SEnvElement;
            _this.HTMLElement = SEnvHTMLElement;
            _this._childWindowCount = 0;
            _this._onRendererPainted = _this._onRendererPainted.bind(_this);
            _this.clearImmediate = _this.clearImmediate.bind(_this);
            _this.clearTimeout = _this.clearTimeout.bind(_this);
            _this.clearInterval = _this.clearInterval.bind(_this);
            _this.setImmediate = _this.setImmediate.bind(_this);
            _this.setTimeout = _this.setTimeout.bind(_this);
            _this.setInterval = _this.setInterval.bind(_this);
            _this._timers = new SEnvTimers();
            _this.CSSFontFaceRule = SEnvCSSFontFace;
            _this.CSSKeyframesRule = SEnvCSSKeyframesRule;
            _this.CSSKeyframeRule = SEnvCSSStyleRule;
            _this.CSSMediaRule = SEnvCSSMediaRule;
            _this.CSSStyleRule = SEnvCSSStyleRule;
            _this.UnknownGroupingRule = SEnvUnknownGroupingRule;
            _this.CSSStyleDeclaration = SEnvCSSStyleDeclaration;
            _this.CSSStyleSheet = SEnvCSSStyleSheet;
            _this.implementation = new SEnvDOMImplementation(_this);
            _this.URIChangedEvent = SEnvURIChangedEvent;
            _this.uid = _this.$id = aerial_common2_1.generateDefaultId();
            _this.location = new SEnvLocation(origin, context.reload);
            _this.window = _this.self = _this;
            _this.top = top || _this;
            _this.localStorage = new SEnvLocalStorage([]);
            _this.innerWidth = constants_1.DEFAULT_WINDOW_WIDTH;
            _this.innerHeight = constants_1.DEFAULT_WINDOW_HEIGHT;
            _this.moveTo(0, 0);
            _this.externalResourceUris = [];
            _this.navigator = new SEnvNavigator();
            _this.fetch = function (info) { return __awaiter(_this, void 0, void 0, function () {
                var inf, dir, fetchPromise, ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inf = String(info);
                            if (!/^http/.test(inf) && /^http/.test(origin)) {
                                if (inf.charAt(0) !== "/") {
                                    dir = this.location.pathname.split("/");
                                    dir.pop();
                                    inf = dir.join("/") + inf;
                                }
                                inf = this.location.protocol + "//" + this.location.host + inf;
                            }
                            fetchPromise = fetch(inf);
                            return [4 /*yield*/, fetchPromise];
                        case 1:
                            ret = _a.sent();
                            this.$setExternalUris(this.externalResourceUris.concat([info]));
                            return [2 /*return*/, ret];
                    }
                });
            }); };
            var customElements = _this.customElements = new SEnvCustomElementRegistry(_this);
            for (var tagName in TAG_NAME_MAP) {
                customElements.define(tagName, TAG_NAME_MAP[tagName]);
            }
            _this._matchMedia = media_match_1.createMediaMatcher(_this);
            _this.document = _this.implementation.createHTMLDocument(null);
            _this.renderer = (createRenderer || renderers_1.createNoopRenderer)(_this);
            _this.document.addEventListener(SEnvMutationEvent.MUTATION, _this._onDocumentMutation.bind(_this));
            return _this;
        }
        SEnvWindow.prototype.getSourceUri = function (uri) {
            return uri;
        };
        SEnvWindow.prototype.didChange = function () {
            this._struct = undefined;
        };
        Object.defineProperty(SEnvWindow.prototype, "renderer", {
            get: function () {
                return this._renderer;
            },
            set: function (value) {
                if (this._renderer) {
                    this._renderer.dispose();
                    this._renderer.removeEventListener(renderers_1.SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
                }
                this._renderer = value || renderers_1.createNoopRenderer(this);
                this._renderer.addEventListener(renderers_1.SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
            },
            enumerable: true,
            configurable: true
        });
        SEnvWindow.prototype.$setExternalUris = function (uris) {
            this.externalResourceUris = uris.slice();
            this._struct = undefined;
            this.dispatchEvent(new SEnvWindowEvent(SEnvWindowEvent.EXTERNAL_URIS_CHANGED));
        };
        Object.defineProperty(SEnvWindow.prototype, "struct", {
            get: function () {
                if (!this._struct) {
                    this._struct = state_1.createSyntheticWindow({
                        $id: this.$id,
                        browserId: this.browserId,
                        location: this.location.toString(),
                        document: this.document.struct,
                        instance: this,
                        renderContainer: this.renderer.container,
                        externalResourceUris: this.externalResourceUris.slice(),
                        scrollPosition: {
                            left: this.scrollX,
                            top: this.scrollY,
                        },
                        bounds: {
                            left: this.screenLeft,
                            top: this.screenTop,
                            right: this.screenLeft + this.innerWidth,
                            bottom: this.screenTop + this.innerHeight
                        }
                    });
                }
                return this._struct;
            },
            enumerable: true,
            configurable: true
        });
        SEnvWindow.prototype.dispose = function () {
            this.renderer.dispose();
            this._timers.dispose();
        };
        Object.defineProperty(SEnvWindow.prototype, "$selector", {
            get: function () {
                if (this._selector)
                    return this._selector;
                this._selector = nwmatcher(this);
                // VERBOSITY = false to prevent breaking on invalid selector rules
                this._selector.configure({ CACHING: true, VERBOSITY: false });
                return this._selector;
            },
            enumerable: true,
            configurable: true
        });
        SEnvWindow.prototype.reloadWhenUrisChange = function (uris) {
            this.$setExternalUris(this.externalResourceUris.concat(uris));
        };
        SEnvWindow.prototype.alert = function (message) { };
        SEnvWindow.prototype.blur = function () { };
        SEnvWindow.prototype.cancelAnimationFrame = function (handle) { };
        SEnvWindow.prototype.captureEvents = function () { };
        SEnvWindow.prototype.close = function () {
            this.closed = true;
            var event = new SEnvEvent();
            event.initEvent("close", true, true);
            this.dispatchEvent(event);
        };
        SEnvWindow.prototype.confirm = function (message) {
            return false;
        };
        SEnvWindow.prototype.atob = function (encodedString) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.btoa = function (rawString) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.departFocus = function (navigationReason, origin) {
        };
        SEnvWindow.prototype.focus = function () {
        };
        SEnvWindow.prototype.getComputedStyle = function (elt, pseudoElt) {
            return this.renderer.getComputedStyle(elt);
        };
        SEnvWindow.prototype.getMatchedCSSRules = function (elt, pseudoElt) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.getSelection = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.matchMedia = function (mediaQuery) {
            return {
                matches: this._matchMedia(mediaQuery),
                media: mediaQuery,
                addListener: null,
                removeListener: null,
            };
        };
        SEnvWindow.prototype.clearInterval = function (handle) {
            return this._timers.clearInterval(handle);
        };
        SEnvWindow.prototype.clearTimeout = function (handle) {
            return this._timers.clearTimeout(handle);
        };
        SEnvWindow.prototype.setInterval = function (handler, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this._timers).setInterval.apply(_a, [handler, ms].concat(args));
            var _a;
        };
        SEnvWindow.prototype.clone = function (deep) {
            var window = new SEnvWindow(this.location.toString(), this.browserId, this.top === this ? null : this.top);
            window.$id = this.$id;
            if (deep !== false) {
                window.document.$id = this.document.$id;
                exports.patchWindow(window, exports.diffWindow(window, this));
            }
            window.renderer.start();
            return window;
        };
        SEnvWindow.prototype.setTimeout = function (handler, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this._timers).setTimeout.apply(_a, [handler, ms].concat(args));
            var _a;
        };
        SEnvWindow.prototype.clearImmediate = function (handle) {
            return this._timers.clearImmediate(handle);
        };
        SEnvWindow.prototype.setImmediate = function (handler) {
            return this._timers.setImmediate(handler);
        };
        SEnvWindow.prototype.moveBy = function (x, y) {
        };
        SEnvWindow.prototype.moveTo = function (x, y) {
            if (x === void 0) { x = this.screenLeft; }
            if (y === void 0) { y = this.screenTop; }
            x = x && Math.round(x);
            y = y && Math.round(y);
            if (x === this.screenLeft && y === this.screenTop) {
                return;
            }
            this.screenLeft = this.screenY = x;
            this.screenTop = this.screenX = y;
            this.didChange();
            var e = new SEnvEvent();
            e.initEvent("move", true, true);
            this.dispatchEvent(e);
        };
        SEnvWindow.prototype.msWriteProfilerMark = function (profilerMarkName) {
        };
        SEnvWindow.prototype.open = function (url, target, features, replace) {
            var _this = this;
            var windowId = this.$id + "." + (++this._childWindowCount);
            var open = function () {
                var SEnvWindow = exports.getSEnvWindowClass({ console: console, fetch: fetch, reload: open });
                var window = new SEnvWindow(url, _this.browserId);
                window.$id = windowId;
                window.document.$id = window.$id + "-document";
                window.$load();
                var event = new SEnvWindowOpenedEvent();
                event.initWindowOpenedEvent(window);
                _this.dispatchEvent(event);
                return window;
            };
            return open();
        };
        SEnvWindow.prototype.postMessage = function (message, targetOrigin, transfer) {
        };
        SEnvWindow.prototype.print = function () {
        };
        SEnvWindow.prototype.prompt = function (message, _default) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.releaseEvents = function () {
        };
        SEnvWindow.prototype.requestAnimationFrame = function (callback) {
            if (!this._animationFrameRequests) {
                this._animationFrameRequests = [];
            }
            this._animationFrameRequests.push(callback);
            return -1;
        };
        SEnvWindow.prototype.resizeBy = function (x, y) {
        };
        SEnvWindow.prototype.resizeTo = function (x, y) {
            if (x === void 0) { x = this.innerWidth; }
            if (y === void 0) { y = this.innerHeight; }
            x = x && Math.round(x);
            y = y && Math.round(y);
            if (x === this.innerWidth && y === this.innerHeight) {
                return;
            }
            this.innerWidth = x;
            this.innerHeight = y;
            this.didChange();
            var event = new SEnvEvent();
            event.initEvent("resize", true, true);
            this.dispatchEvent(event);
        };
        SEnvWindow.prototype.scroll = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.scrollTo.apply(this, args);
        };
        SEnvWindow.prototype.scrollBy = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        SEnvWindow.prototype._throwUnsupportedMethod = function () {
            throw new Error("This node type does not support this method.");
        };
        SEnvWindow.prototype.scrollTo = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var left;
            var top;
            // scroll with options
            if (typeof args[0] === "object") {
            }
            else {
                left = args[0], top = args[1];
            }
            // TODO - use computed bounds here too
            left = lodash_1.clamp(left, 0, this._scrollRect.width);
            top = lodash_1.clamp(top, 0, this._scrollRect.height);
            var oldScrollX = this.scrollX;
            var oldScrollY = this.scrollY;
            // no change
            if (oldScrollX === left && oldScrollY === top) {
                return;
            }
            this.scrollX = left;
            this.scrollY = top;
            var event = new SEnvEvent();
            event.initEvent("scroll", true, true);
            this.dispatchEvent(event);
        };
        SEnvWindow.prototype.stop = function () {
        };
        SEnvWindow.prototype.webkitCancelAnimationFrame = function (handle) {
        };
        SEnvWindow.prototype.webkitConvertPointFromNodeToPage = function (node, pt) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.webkitConvertPointFromPageToNode = function (node, pt) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvWindow.prototype.webkitRequestAnimationFrame = function (callback) {
            this._throwUnsupportedMethod();
            return -1;
        };
        SEnvWindow.prototype.createImageBitmap = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.reject(null);
        };
        SEnvWindow.prototype.$load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var location, response, content;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            location = this.location.toString();
                            this.renderer.start();
                            if (!location) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.fetch(location)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            content = _a.sent();
                            return [4 /*yield*/, this.document.$load(content)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.document.$load("")];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SEnvWindow.prototype._onDocumentMutation = function (event) {
            this.didChange();
            var eventClone = new SEnvMutationEvent();
            eventClone.initMutationEvent(event.mutation);
            this.dispatchEvent(eventClone);
        };
        SEnvWindow.prototype._onRendererPainted = function (event) {
            this._scrollRect = event.scrollRect;
            // sync scroll position that may have changed
            // during window resize, otherwise 
            this.scrollTo(event.scrollPosition.left, event.scrollPosition.top);
            if (this._animationFrameRequests) {
                var animationFrameRequests = this._animationFrameRequests;
                this._animationFrameRequests = [];
                for (var i = 0, n = animationFrameRequests.length; i < n; i++) {
                    animationFrameRequests[i]();
                }
            }
        };
        return SEnvWindow;
    }(SEnvEventTarget));
});
exports.openSyntheticEnvironmentWindow = function (location, context) {
    var SEnvWindow = exports.getSEnvWindowClass(context);
    var window = new SEnvWindow(location, _this.browserId);
    window.$load();
    return window;
};
exports.diffWindow = function (oldWindow, newWindow) {
    return nodes_1.diffDocument(oldWindow.document, newWindow.document);
};
exports.flattenWindowObjectSources = function (window) {
    if (!window.document) {
        return {};
    }
    return nodes_1.flattenDocumentSources(window.document);
};
exports.windowMutators = __assign({}, nodes_1.documentMutators);
exports.patchWindow = function (oldWindow, mutations) {
    var childObjects = exports.flattenWindowObjectSources(oldWindow.struct);
    for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
        var mutation = mutations_1[_i];
        var target = childObjects[mutation.target.$id];
        if (!target) {
            throw new Error("Unable to find target for mutation " + mutation.type);
        }
        var mutate = exports.windowMutators[mutation.type];
        if (!mutate) {
            throw new Error("Unable to find window mutator for " + mutation.type);
        }
        mutate(target, mutation);
    }
};
/**
 * Synchronizes IDs between two windows to ensure that future mutations sync
 * properly - seen window mirror impl.
 */
exports.syncWindowIds = function (sourceWindow, targetWindow) {
    var sourceChildObjects = exports.flattenWindowObjectSources(sourceWindow.struct);
    var targetChildObjects = exports.flattenWindowObjectSources(targetWindow.struct);
    var sids = Object.keys(sourceChildObjects);
    var tids = Object.keys(targetChildObjects);
    if (sids.length !== tids.length) {
        throw new Error("child object count missmatch. Cannot synchronize ids");
    }
    // source & target windows should be synchronized, so it should
    // okay to just copy IDs over
    for (var i = 0, n = sids.length; i < n; i++) {
        var sco = sourceChildObjects[sids[i]];
        var nco = targetChildObjects[tids[i]];
        if (sco.$id === nco.$id) {
            continue;
        }
        if (sco.struct.type !== nco.struct.type) {
            throw new Error("Cannot set $id from type " + sco.struct.type + " to type " + nco.struct.type + ".");
        }
        // TODO - assert the type here --- should be identical
        nco.$id = sco.$id;
    }
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/window.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/window.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/state/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var environment_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/index.ts");
exports.SYNTHETIC_BROWSER_STORE = "SYNTHETIC_BROWSER_STORE";
exports.SYNTHETIC_BROWSER = "SYNTHETIC_BROWSER";
exports.SYNTHETIC_DOCUMENT = "SYNTHETIC_DOCUMENT";
exports.SYNTHETIC_TEXT_NODE = "SYNTHETIC_TEXT_NODE";
exports.SYNTHETIC_WINDOW = "SYNTHETIC_WINDOW";
exports.SYNTHETIC_ELEMENT = "SYNTHETIC_ELEMENT";
exports.SYNTHETIC_COMMENT = "SYNTHETIC_COMMENT";
exports.SYNTHETIC_CSS_STYLE_SHEET = "SYNTHETIC_CSS_STYLE_SHEET";
exports.SYNTHETIC_CSS_STYLE_RULE = "SYNTHETIC_CSS_STYLE_RULE";
exports.SYNTHETIC_CSS_MEDIA_RULE = "SYNTHETIC_CSS_MEDIA_RULE";
exports.SYNTHETIC_CSS_UNKNOWN_RULE = "SYNTHETIC_CSS_UNKNOWN_RULE";
exports.SYNTHETIC_CSS_KEYFRAME_RULE = "SYNTHETIC_CSS_KEYFRAME_RULE";
exports.SYNTHETIC_CSS_FONT_FACE_RULE = "SYNTHETIC_CSS_FONT_FACE_RULE";
exports.SYNTHETIC_CSS_KEYFRAMES_RULE = "SYNTHETIC_CSS_KEYFRAMES_RULE";
exports.SYNTHETIC_CSS_STYLE_DECLARATION = "SYNTHETIC_CSS_STYLE_DECLARATION";
exports.isSyntheticNodeType = function (value) {
    return [exports.SYNTHETIC_DOCUMENT, exports.SYNTHETIC_TEXT_NODE, exports.SYNTHETIC_COMMENT, exports.SYNTHETIC_ELEMENT].indexOf(value) !== -1;
};
exports.createSyntheticBrowserStore = function (syntheticBrowsers) { return aerial_common2_1.dsIndex(aerial_common2_1.createDataStore(syntheticBrowsers), "$id"); };
exports.createSyntheticWindow = aerial_common2_1.serializableKeysFactory(["scrollPosition", "bounds", "location", "$id", "browserId"], aerial_common2_1.createStructFactory(exports.SYNTHETIC_WINDOW, {
    externalResourceUris: []
}));
exports.createSyntheticBrowser = aerial_common2_1.createStructFactory(exports.SYNTHETIC_BROWSER, {
    windows: []
});
exports.createSyntheticBrowserRootState = function (syntheticBrowsers) {
    return {
        browserStore: exports.createSyntheticBrowserStore(syntheticBrowsers),
        fileCache: {},
    };
};
exports.addSyntheticBrowser = function (root, syntheticBrowser) {
    if (syntheticBrowser === void 0) { syntheticBrowser = exports.createSyntheticBrowser(); }
    var store = root.browserStore;
    return __assign({}, root, { browserStore: aerial_common2_1.dsInsert(root.browserStore, syntheticBrowser) });
};
exports.addSyntheticWindow = function (root, syntheticBrowserId, syntheticWindow) {
    var store = root.browserStore;
    var idQuery = getIdQuery(syntheticBrowserId);
    var windows = aerial_common2_1.dsFind(store, idQuery).windows;
    return __assign({}, root, { browserStore: aerial_common2_1.dsUpdateOne(store, idQuery, {
            windows: windows.concat([syntheticWindow])
        }) });
};
exports.getSyntheticBrowserItemBounds = aerial_common2_1.weakMemo(function (root, item) {
    if (!item)
        return null;
    if (item.bounds)
        return item.bounds;
    var window = exports.getSyntheticNodeWindow(root, item.$id);
    return window && window.allComputedBounds[item.$id] && aerial_common2_1.shiftBounds(window.allComputedBounds[item.$id], window.bounds);
});
exports.getSyntheticBrowserStoreItemByReference = aerial_common2_1.weakMemo(function (root, _a) {
    var type = _a[0], id = _a[1];
    if (type === exports.SYNTHETIC_TEXT_NODE || type === exports.SYNTHETIC_ELEMENT) {
        return getSyntheticNodeById(root, id);
    }
    else if (type === exports.SYNTHETIC_WINDOW) {
        return exports.getSyntheticWindow(root, id);
    }
});
exports.createSyntheticCSSStyleSheet = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_STYLE_SHEET);
exports.createSyntheticCSSStyleRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_STYLE_RULE, {
    type: constants_1.CSSRuleType.STYLE_RULE
});
exports.createSyntheticCSSMediaRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_MEDIA_RULE, {
    type: constants_1.CSSRuleType.MEDIA_RULE
});
exports.createSyntheticCSSFontFaceRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_FONT_FACE_RULE, {
    type: constants_1.CSSRuleType.FONT_FACE_RULE
});
exports.createSyntheticCSSKeyframeRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_KEYFRAME_RULE, {
    type: constants_1.CSSRuleType.KEYFRAME_RULE
});
exports.createSyntheticCSSKeyframesRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_KEYFRAMES_RULE, {
    type: constants_1.CSSRuleType.KEYFRAMES_RULE
});
exports.createSyntheticCSSUnknownGroupingRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_UNKNOWN_RULE, {
    type: constants_1.CSSRuleType.UNKNOWN_RULE
});
exports.getFileCacheItem = function (uri, state) { return state.fileCache && state.fileCache[uri]; };
exports.setFileCacheItem = function (uri, content, mtime, state) {
    if (exports.getFileCacheItem(uri, state) && exports.getFileCacheItem(uri, state).mtime.getTime() === mtime.getTime()) {
        return state;
    }
    return __assign({}, state, { fileCache: __assign({}, (state.fileCache || {}), (_a = {}, _a[uri] = {
            content: content,
            mtime: mtime
        }, _a)) });
    var _a;
};
exports.createSyntheticCSSStyleDeclaration = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_STYLE_DECLARATION);
exports.createSyntheticDocument = aerial_common2_1.nonSerializableFactory(aerial_common2_1.createStructFactory(exports.SYNTHETIC_DOCUMENT, {
    nodeName: "#document",
    nodeType: constants_1.SEnvNodeTypes.DOCUMENT
}));
exports.createSyntheticElement = aerial_common2_1.createStructFactory(exports.SYNTHETIC_ELEMENT, {
    nodeType: constants_1.SEnvNodeTypes.ELEMENT
});
exports.createSyntheticTextNode = aerial_common2_1.createStructFactory(exports.SYNTHETIC_TEXT_NODE, {
    nodeName: "#text",
    nodeType: constants_1.SEnvNodeTypes.TEXT
});
exports.createSyntheticComment = aerial_common2_1.createStructFactory(exports.SYNTHETIC_COMMENT, {
    nodeName: "#comment",
    nodeType: constants_1.SEnvNodeTypes.COMMENT
});
// TODO - move all utils here to utils folder
exports.isSyntheticDOMNode = function (value) { return value && value.constructor === Object && value.nodeType != null; };
exports.getSyntheticBrowsers = aerial_common2_1.weakMemo(function (root) { return root.browserStore.records; });
var getIdQuery = aerial_common2_1.weakMemo(function (id) { return ({
    $id: id
}); });
exports.getSyntheticBrowser = function (root, id) { return aerial_common2_1.dsFind(root.browserStore, getIdQuery(id)); };
exports.getSyntheticWindow = function (root, id) {
    var filter = function (window) { return window.$id === id; };
    return root.browserStore ? exports.eachSyntheticWindow(root, filter) : root.windows.find(filter);
};
exports.getSyntheticBrowserBounds = function (browser, filter) {
    if (filter === void 0) { filter = function (window) { return true; }; }
    var availWindows = browser.windows.filter(filter);
    return availWindows.length ? availWindows.map(function (window) { return window.bounds; }).reduce(function (a, b) { return ({
        left: Math.min(a.left, b.left),
        top: Math.min(a.top, b.top),
        right: Math.max(a.right, b.right),
        bottom: Math.max(a.bottom, b.bottom)
    }); }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }) : aerial_common2_1.createZeroBounds();
};
exports.updateSyntheticBrowser = function (root, browserId, properties) {
    var browser = exports.getSyntheticBrowser(root, browserId);
    return __assign({}, root, { browserStore: aerial_common2_1.dsUpdate(root.browserStore, { $id: browser.$id }, __assign({}, browser, properties)) });
};
exports.updateSyntheticWindow = function (root, windowId, properties) {
    var browser = exports.getSyntheticWindowBrowser(root, windowId);
    var window = exports.getSyntheticWindow(browser, windowId);
    return exports.updateSyntheticBrowser(root, browser.$id, {
        windows: aerial_common2_1.arrayReplaceItem(browser.windows, window, __assign({}, window, properties))
    });
};
exports.upsertSyntheticWindow = function (root, browserId, newWindow) {
    var browser = exports.getSyntheticBrowser(root, browserId);
    var window = exports.getSyntheticWindow(browser, newWindow.$id);
    if (window) {
        return exports.updateSyntheticWindow(root, window.$id, newWindow);
    }
    return exports.updateSyntheticBrowser(root, browser.$id, {
        windows: browser.windows.concat([
            __assign({}, newWindow)
        ])
    });
};
exports.getSyntheticWindowChildStructs = aerial_common2_1.weakMemo(function (window) {
    var instances = environment_1.flattenWindowObjectSources(window);
    var children = {};
    for (var $id in instances) {
        children[$id] = instances[$id].struct;
    }
    return children;
});
exports.getSyntheticWindowChild = function (window, id) { return exports.getSyntheticWindowChildStructs(window)[id]; };
exports.getSyntheticNodeAncestors = aerial_common2_1.weakMemo(function (node, window) {
    var prev = node;
    var current = node;
    var ancestors = [];
    var checkedShadowRoots = [];
    while (1) {
        // if (current.nodeType === SEnvNodeTypes.ELEMENT) {
        //   const element = current as SyntheticElement;
        //   if (element.shadowRoot && ancestors.indexOf(element.shadowRoot) === -1) {
        //   }
        // }
        prev = current;
        current = exports.getSyntheticWindowChild(window, current.parentId || current.hostId);
        if (!current) {
            break;
        }
        // dive into slots
        if (current.nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
            var element = current;
            if (!prev.hostId && element.shadowRoot && checkedShadowRoots.indexOf(element.shadowRoot) === -1) {
                checkedShadowRoots.push(element.shadowRoot);
                var slotName = prev.nodeType === constants_1.SEnvNodeTypes.ELEMENT ? exports.getSyntheticElementAttribute("slot", prev) : null;
                var slot = element.shadowRoot.instance.querySelector(slotName ? "slot[name=" + slotName + "]" : "slot");
                if (!slot) {
                    break;
                }
                current = slot.struct;
            }
        }
        ancestors.push(current);
    }
    return ancestors;
});
exports.getComputedStyle = aerial_common2_1.weakMemo(function (elementId, window) {
    return window.allComputedStyles[elementId];
});
exports.getSyntheticParentNode = function (node, window) { return exports.getSyntheticWindowChild(window, node.parentId); };
exports.removeSyntheticWindow = function (root, windowId) {
    var browser = exports.getSyntheticWindowBrowser(root, windowId);
    return exports.updateSyntheticBrowser(root, browser.$id, {
        windows: aerial_common2_1.arrayRemoveItem(browser.windows, exports.getSyntheticWindow(browser, windowId))
    });
};
exports.getSyntheticWindowBrowser = aerial_common2_1.weakMemo(function (root, windowId) {
    for (var _i = 0, _a = exports.getSyntheticBrowsers(root); _i < _a.length; _i++) {
        var browser = _a[_i];
        for (var _b = 0, _c = browser.windows; _b < _c.length; _b++) {
            var window_1 = _c[_b];
            if (window_1.$id === windowId)
                return browser;
        }
    }
    return null;
});
function getSyntheticNodeById(root, id) {
    var window = root.$type === exports.SYNTHETIC_WINDOW ? root : exports.getSyntheticNodeWindow(root, id);
    return window && exports.getSyntheticWindowChild(window, id);
}
exports.getSyntheticNodeById = getSyntheticNodeById;
;
exports.getSyntheticNodeTextContent = aerial_common2_1.weakMemo(function (node) {
    var text = "";
    aerial_common2_1.traverseObject(node, function (child) {
        if (exports.isSyntheticDOMNode(child) && child.nodeType === constants_1.SEnvNodeTypes.TEXT) {
            text += child.nodeValue;
        }
    });
    return text;
});
exports.eachSyntheticWindow = aerial_common2_1.weakMemo(function (_a, each) {
    var browserStore = _a.browserStore;
    for (var _i = 0, _b = browserStore.records; _i < _b.length; _i++) {
        var syntheticBrowser = _b[_i];
        for (var _c = 0, _d = syntheticBrowser.windows; _c < _d.length; _c++) {
            var window_2 = _d[_c];
            if (each(window_2) === true)
                return window_2;
        }
    }
    return null;
});
exports.getSyntheticNodeWindow = aerial_common2_1.weakMemo(function (root, nodeId) {
    var filter = function (window) { return exports.syntheticWindowContainsNode(window, nodeId); };
    return root.browserStore ? exports.eachSyntheticWindow(root, filter) : root.windows.find(filter);
});
exports.getMatchingElements = aerial_common2_1.weakMemo(function (window, selectorText) { return Array.prototype.map.call(window.document.instance.querySelectorAll(selectorText), function (element) { return element.struct; }); });
exports.elementMatches = aerial_common2_1.weakMemo(function (selectorText, element, window) { return element.instance.matches(selectorText); });
exports.syntheticWindowContainsNode = aerial_common2_1.weakMemo(function (window, nodeId) {
    return Boolean(exports.getSyntheticWindowChild(window, nodeId));
});
exports.syntheticNodeIsRelative = aerial_common2_1.weakMemo(function (window, nodeId, refNodeId) {
    var node = exports.getSyntheticWindowChild(window, nodeId);
    var refNode = exports.getSyntheticWindowChild(window, refNodeId);
    if (!node || !refNode) {
        return false;
    }
    var nodeAncestors = exports.getSyntheticNodeAncestors(node, window);
    var refNodeAncestors = exports.getSyntheticNodeAncestors(refNode, window);
    return refNodeAncestors.indexOf(node) !== -1 || nodeAncestors.indexOf(refNode) !== -1;
});
exports.isSyntheticBrowserItemMovable = function (root, item) {
    if (item.$type === exports.SYNTHETIC_WINDOW)
        return true;
    if (exports.isSyntheticNodeType(item.$type) && item.nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
        var element = item;
    }
    return false;
};
// TODO - use getElementLabel instead
exports.getSyntheticElementAttribute = function (name, element) {
    var attr = element.attributes.find(function (attribute) { return attribute.name === name; });
    return attr && attr.value;
};
exports.getSyntheticElementLabel = function (element) {
    var label = String(element.nodeName).toLowerCase();
    var className = exports.getSyntheticElementAttribute("class", element);
    var id = exports.getSyntheticElementAttribute("id", element);
    if (id) {
        label += "#" + id;
    }
    else if (className) {
        label += "." + className;
    }
    return label;
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/state/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/state/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/state/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var aerial_sandbox2_1 = __webpack_require__("../aerial-sandbox2/index.js");
var shortcuts_1 = __webpack_require__("./src/front-end/state/shortcuts.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
/**
 * Types
 */
exports.WORKSPACE = "WORKSPACE";
exports.APPLICATION_STATE = "APPLICATION_STATE";
exports.LIBRARY_COMPONENT = "LIBRARY_COMPONENT";
/**
 * Utilities
 */
exports.getFileExtension = function (file) { return file.sourceUri.split(".").pop(); };
exports.getSelectedWorkspaceFile = function (state, workspace) {
    return workspace.selectedFileId && aerial_sandbox2_1.getFileCacheItemById(state, workspace.selectedFileId);
};
exports.getSyntheticWindowWorkspace = function (root, windowId) { return exports.getSyntheticBrowserWorkspace(root, aerial_browser_sandbox_1.getSyntheticWindowBrowser(root, windowId).$id); };
exports.showWorkspaceTextEditor = function (root, workspaceId) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspaceStage(root, workspaceId, {
        showTextEditor: true
    });
};
exports.updateWorkspaceStage = function (root, workspaceId, stageProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspace(root, workspaceId, {
        stage: __assign({}, workspace.stage, stageProperties)
    });
};
exports.updateWorkspaceTextEditor = function (root, workspaceId, textEditorProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspace(root, workspaceId, {
        textEditor: __assign({}, workspace.textEditor, textEditorProperties)
    });
};
exports.getSyntheticBrowserWorkspace = aerial_common2_1.weakMemo(function (root, browserId) {
    return root.workspaces.find(function (workspace) { return workspace.browserId === browserId; });
});
exports.addWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(workspace.selectionRefs, selection));
};
exports.removeWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(workspace.selectionRefs.filter(function (type, id) { return !selection.find(function (type2, id2) { return id === id2; }); })));
};
/**
 * Utility to ensure that workspace selection items are within the same window object. This prevents users from selecting
 * the _same_ element across different window objects.
 */
var deselectOutOfScopeWorkpaceSelection = function (root, workspaceId, ref) {
    if (ref && ref[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW) {
        return root;
    }
    var window = aerial_browser_sandbox_1.getSyntheticNodeWindow(root, ref[1]);
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var updatedSelection = [];
    for (var _i = 0, _a = workspace.selectionRefs; _i < _a.length; _i++) {
        var selection = _a[_i];
        if (aerial_browser_sandbox_1.syntheticWindowContainsNode(window, selection[1])) {
            updatedSelection.push(selection);
        }
    }
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(updatedSelection));
};
/**
 * Prevents nodes that have a parent/child relationship from being selected.
 */
var deselectRelatedWorkspaceSelection = function (root, workspaceId, ref) {
    if (ref && ref[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW) {
        return root;
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var window = aerial_browser_sandbox_1.getSyntheticNodeWindow(root, ref[1]);
    var updatedSelection = [];
    for (var _i = 0, _a = workspace.selectionRefs; _i < _a.length; _i++) {
        var selection = _a[_i];
        if (!aerial_browser_sandbox_1.syntheticNodeIsRelative(window, ref[1], selection[1])) {
            updatedSelection.push(selection);
        }
    }
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(updatedSelection));
};
// deselect unrelated refs, ensures that selection is not a child of existing one. etc.
var cleanupWorkspaceSelection = function (state, workspaceId) {
    var workspace = exports.getWorkspaceById(state, workspaceId);
    if (workspace.selectionRefs.length > 0) {
        // use _last_ selected element since it's likely the one that was just clicked. Don't want to prevent the 
        // user from doing so
        state = deselectOutOfScopeWorkpaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
        state = deselectRelatedWorkspaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
    }
    return state;
};
exports.toggleWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var newSelection = [];
    var oldSelectionIds = workspace.selectionRefs.map(function (_a) {
        var type = _a[0], id = _a[1];
        return id;
    });
    var toggleSelectionIds = selection.map(function (_a) {
        var type = _a[0], id = _a[1];
        return id;
    });
    for (var _a = 0, _b = workspace.selectionRefs; _a < _b.length; _a++) {
        var ref = _b[_a];
        if (toggleSelectionIds.indexOf(ref[1]) === -1) {
            newSelection.push(ref);
        }
    }
    for (var _c = 0, selection_1 = selection; _c < selection_1.length; _c++) {
        var ref = selection_1[_c];
        if (oldSelectionIds.indexOf(ref[1]) === -1) {
            newSelection.push(ref);
        }
    }
    return cleanupWorkspaceSelection(exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(newSelection)), workspaceId);
};
exports.clearWorkspaceSelection = function (root, workspaceId) {
    return exports.updateWorkspaceStage(exports.updateWorkspace(root, workspaceId, {
        selectionRefs: [],
        hoveringRefs: []
    }), workspaceId, {
        secondarySelection: false
    });
};
exports.setWorkspaceSelection = function (root, workspaceId) {
    var selectionIds = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selectionIds[_i - 2] = arguments[_i];
    }
    return exports.updateWorkspace(root, workspaceId, {
        selectionRefs: lodash_1.uniq(selectionIds.slice())
    });
};
exports.updateWorkspace = function (root, workspaceId, newProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return __assign({}, root, { workspaces: aerial_common2_1.arrayReplaceIndex(root.workspaces, root.workspaces.indexOf(workspace), __assign({}, workspace, newProperties)) });
};
exports.createTargetSelector = function (uri, value) { return ({
    uri: uri,
    value: value
}); };
exports.toggleWorkspaceTargetCSSSelector = function (root, workspaceId, uri, selectorText) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var cssSelectors = (workspace.targetCSSSelectors || []);
    var index = cssSelectors.findIndex(function (targetSelector) {
        return targetSelector.uri === uri && targetSelector.value == selectorText;
    });
    return exports.updateWorkspace(root, workspaceId, {
        targetCSSSelectors: index === -1 ? cssSelectors.concat([exports.createTargetSelector(uri, selectorText)]) : aerial_common2_1.arraySplice(cssSelectors, index, 1)
    });
};
exports.addWorkspace = function (root, workspace) {
    return __assign({}, root, { workspaces: root.workspaces.concat([workspace]) });
};
exports.filterMatchingTargetSelectors = aerial_common2_1.weakMemo(function (targetCSSSelectors, element, window) { return filterApplicableTargetSelectors(targetCSSSelectors, window).filter(function (rule) { return aerial_browser_sandbox_1.elementMatches(rule.value, element, window); }); });
var filterApplicableTargetSelectors = aerial_common2_1.weakMemo(function (selectors, window) {
    var map = {};
    for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
        var selector = selectors_1[_i];
        map[selector.uri + selector.value] = selector;
    }
    var rules = [];
    var children = aerial_browser_sandbox_1.getSyntheticWindowChildStructs(window);
    for (var $id in children) {
        var child = children[$id];
        if (child.$type === aerial_browser_sandbox_1.SYNTHETIC_CSS_STYLE_RULE && child.source && map[child.source.uri + child.selectorText]) {
            rules.push(map[child.source.uri + child.selectorText]);
        }
    }
    return lodash_1.uniq(rules);
});
var getSelectorAffectedWindows = aerial_common2_1.weakMemo(function (targetCSSSelectors, browser) {
    var affectedWindows = [];
    for (var _i = 0, _a = browser.windows; _i < _a.length; _i++) {
        var window_1 = _a[_i];
        if (filterApplicableTargetSelectors(targetCSSSelectors, window_1).length) {
            affectedWindows.push(window_1);
        }
    }
    return affectedWindows;
});
exports.getObjectsWithSameSource = aerial_common2_1.weakMemo(function (itemId, browser, limitToElementWindow) {
    var target = aerial_browser_sandbox_1.getSyntheticNodeById(browser, itemId);
    var objects = {};
    var objectsWithSameSource = [];
    var windows = limitToElementWindow ? [aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, itemId)] : browser.windows;
    for (var _i = 0, windows_1 = windows; _i < windows_1.length; _i++) {
        var window_2 = windows_1[_i];
        var windowsObjects = aerial_browser_sandbox_1.getSyntheticWindowChildStructs(window_2);
        for (var $id in windowsObjects) {
            var child = windowsObjects[$id];
            if (child.source && target.source && aerial_common2_1.expressionLocationEquals(child.source, target.source)) {
                objectsWithSameSource.push(child);
            }
        }
    }
    return objectsWithSameSource;
});
exports.getSelectorAffectedElements = aerial_common2_1.weakMemo(function (elementId, targetCSSSelectors, browser, limitToElementWindow) {
    var affectedElements = [];
    if (!targetCSSSelectors.length) {
        affectedElements.push.apply(affectedElements, exports.getObjectsWithSameSource(elementId, browser, limitToElementWindow));
    }
    else {
        var affectedWindows = targetCSSSelectors.length ? getSelectorAffectedWindows(targetCSSSelectors, browser) : browser.windows;
        if (limitToElementWindow) {
            affectedWindows = [aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, elementId)];
        }
        for (var _i = 0, affectedWindows_1 = affectedWindows; _i < affectedWindows_1.length; _i++) {
            var window_3 = affectedWindows_1[_i];
            for (var _a = 0, targetCSSSelectors_1 = targetCSSSelectors; _a < targetCSSSelectors_1.length; _a++) {
                var selectorText = targetCSSSelectors_1[_a].value;
                affectedElements.push.apply(affectedElements, aerial_browser_sandbox_1.getMatchingElements(window_3, selectorText));
            }
        }
    }
    return lodash_1.uniq(affectedElements);
});
exports.getFrontEndItemByReference = function (root, ref) {
    return aerial_browser_sandbox_1.getSyntheticBrowserStoreItemByReference(root, ref);
};
exports.getSyntheticNodeWorkspace = aerial_common2_1.weakMemo(function (root, nodeId) {
    return exports.getSyntheticWindowWorkspace(root, aerial_browser_sandbox_1.getSyntheticNodeWindow(root, nodeId).$id);
});
exports.getBoundedWorkspaceSelection = aerial_common2_1.weakMemo(function (state, workspace) { return workspace.selectionRefs.map(function (ref) { return exports.getFrontEndItemByReference(state, ref); }).filter(function (item) { return aerial_browser_sandbox_1.getSyntheticBrowserItemBounds(state, item); }); });
exports.getWorkspaceSelectionBounds = aerial_common2_1.weakMemo(function (state, workspace) { return aerial_common2_1.mergeBounds.apply(void 0, exports.getBoundedWorkspaceSelection(state, workspace).map(function (boxed) { return aerial_browser_sandbox_1.getSyntheticBrowserItemBounds(state, boxed); })); });
exports.getStageZoom = function (stage) { return exports.getStageTranslate(stage).zoom; };
exports.getStageTranslate = function (stage) { return stage.translate; };
exports.getWorkspaceById = function (state, id) { return state.workspaces.find(function (workspace) { return workspace.$id === id; }); };
exports.getSelectedWorkspace = function (state) { return state.selectedWorkspaceId && exports.getWorkspaceById(state, state.selectedWorkspaceId); };
exports.getWorkspaceLastSelectionOwnerWindow = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = exports.getWorkspaceById(state, workspaceId);
    if (workspace.selectionRefs.length === 0) {
        return null;
    }
    var lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
    return exports.getWorkspaceLastSelectionOwnerWindow2(workspace, aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId));
};
exports.getWorkspaceLastSelectionOwnerWindow2 = function (workspace, browser) {
    if (workspace.selectionRefs.length === 0) {
        return null;
    }
    var lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
    return lastSelectionRef[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? aerial_browser_sandbox_1.getSyntheticWindow(browser, lastSelectionRef[1]) : aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, lastSelectionRef[1]);
};
exports.getWorkspaceWindow = function (state, workspaceId, index) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var browser = aerial_browser_sandbox_1.getSyntheticBrowser(state, exports.getWorkspaceById(state, workspaceId).browserId);
    return browser.windows[index == null ? browser.windows.length - 1 : 0];
};
/**
 * Factories
 */
exports.createWorkspace = aerial_common2_1.createStructFactory(exports.WORKSPACE, {
    // null to denote style attribute
    targetCSSSelectors: [],
    stage: {
        panning: false,
        secondarySelection: false,
        translate: { left: 0, top: 0, zoom: 1 },
        showTextEditor: false,
        showLeftGutter: true,
        showRightGutter: true,
    },
    textEditor: {},
    selectionRefs: [],
    hoveringRefs: [],
    draggingRefs: [],
    library: [],
    availableComponents: []
});
exports.createApplicationState = aerial_common2_1.createStructFactory(exports.APPLICATION_STATE, {
    workspaces: [],
    shortcuts: [
        shortcuts_1.createKeyboardShortcut("backspace", actions_1.deleteShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+b", actions_1.toggleLeftGutterPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+b", actions_1.toggleLeftGutterPressed()),
        shortcuts_1.createKeyboardShortcut("meta+/", actions_1.toggleRightGutterPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+/", actions_1.toggleRightGutterPressed()),
        shortcuts_1.createKeyboardShortcut("meta+e", actions_1.toggleTextEditorPressed()),
        shortcuts_1.createKeyboardShortcut("meta+f", actions_1.fullScreenShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+f", actions_1.fullScreenShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+=", actions_1.zoomInShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+-", actions_1.zoomOutShortcutPressed()),
        // ignore for now since project is scoped to Paperclip only. Windows
        // should be added in via the components pane.
        // createKeyboardShortcut("meta+t", openNewWindowShortcutPressed()),
        // createKeyboardShortcut("ctrl+t", openNewWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+enter", actions_1.cloneWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("escape", actions_1.escapeShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+shift+]", actions_1.nextWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+shift+[", actions_1.prevWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+meta+t", actions_1.toggleToolsShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("up", { type: actions_1.UP_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("up", { type: actions_1.UP_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("down", { type: actions_1.DOWN_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("down", { type: actions_1.DOWN_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("left", { type: actions_1.LEFT_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("left", { type: actions_1.LEFT_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("right", { type: actions_1.RIGHT_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("right", { type: actions_1.RIGHT_KEY_UP }, { keyup: true }),
    ],
    fileCacheStore: aerial_sandbox2_1.createFileCacheStore(),
    browserStore: aerial_browser_sandbox_1.createSyntheticBrowserStore()
});
exports.selectWorkspace = function (state, selectedWorkspaceId) { return (__assign({}, state, { selectedWorkspaceId: selectedWorkspaceId })); };
exports.getScaledMouseStagePosition = function (state, event) {
    var _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY, nativeEvent = _a.nativeEvent;
    var workspace = exports.getSelectedWorkspace(state);
    var stage = workspace.stage;
    var translate = exports.getStageTranslate(stage);
    var scaledPageX = ((pageX - translate.left) / translate.zoom);
    var scaledPageY = ((pageY - translate.top) / translate.zoom);
    return { left: scaledPageX, top: scaledPageY };
};
exports.getStageToolMouseNodeTargetReference = function (state, event) {
    var workspace = exports.getSelectedWorkspace(state);
    var stage = workspace.stage;
    var translate = exports.getStageTranslate(stage);
    var _a = exports.getScaledMouseStagePosition(state, event), scaledPageX = _a.left, scaledPageY = _a.top;
    var browser = aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId);
    var window = stage.fullScreen ? aerial_browser_sandbox_1.getSyntheticWindow(state, stage.fullScreen.windowId) : browser.windows.find(function (window) { return (aerial_common2_1.pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, window.bounds)); });
    if (!window)
        return null;
    var mouseX = scaledPageX - window.bounds.left;
    var mouseY = scaledPageY - window.bounds.top;
    var allComputedBounds = window.allComputedBounds;
    var intersectingBounds = [];
    var intersectingBoundsMap = new Map();
    for (var $id in allComputedBounds) {
        var bounds = allComputedBounds[$id];
        if (aerial_common2_1.pointIntersectsBounds({ left: mouseX, top: mouseY }, bounds)) {
            intersectingBounds.push(bounds);
            intersectingBoundsMap.set(bounds, $id);
        }
    }
    if (!intersectingBounds.length)
        return null;
    var smallestBounds = aerial_common2_1.getSmallestBounds.apply(void 0, intersectingBounds);
    return [aerial_browser_sandbox_1.SYNTHETIC_ELEMENT, intersectingBoundsMap.get(smallestBounds)];
};
exports.serializeApplicationState = function (_a) {
    var workspaces = _a.workspaces, selectedWorkspaceId = _a.selectedWorkspaceId, windowStore = _a.windowStore, browserStore = _a.browserStore;
    return ({
        workspaces: workspaces.map(exports.serializeWorkspace),
        selectedWorkspaceId: selectedWorkspaceId,
        windowStore: aerial_common2_1.serialize(windowStore),
        browserStore: aerial_common2_1.serialize(browserStore)
    });
};
exports.serializeWorkspace = function (workspace) { return ({
    $id: workspace.$id,
    $type: workspace.$type,
    targetCSSSelectors: workspace.targetCSSSelectors,
    selectionRefs: [],
    browserId: workspace.browserId,
    stage: serializeStage(workspace.stage),
    textEditor: workspace.textEditor,
    library: [],
    availableComponents: []
}); };
var serializeStage = function (_a) {
    var showTextEditor = _a.showTextEditor, showRightGutter = _a.showRightGutter, showLeftGutter = _a.showLeftGutter, showTools = _a.showTools, translate = _a.translate, fullScreen = _a.fullScreen;
    return ({
        panning: false,
        translate: translate,
        fullScreen: fullScreen,
        showTextEditor: showTextEditor,
        showRightGutter: showRightGutter,
        showLeftGutter: showLeftGutter,
        showTools: true
    });
};
__export(__webpack_require__("./src/front-end/state/shortcuts.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/state/index.ts"));
__export(__webpack_require__("./src/front-end/state/api.ts"));
__export(__webpack_require__("./src/front-end/state/dnd.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})