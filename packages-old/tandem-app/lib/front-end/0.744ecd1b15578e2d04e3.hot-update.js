webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/src/environment/constants.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var SEnvNodeTypes;
(function (SEnvNodeTypes) {
    SEnvNodeTypes[SEnvNodeTypes["ELEMENT"] = 1] = "ELEMENT";
    SEnvNodeTypes[SEnvNodeTypes["ATTR"] = 2] = "ATTR";
    SEnvNodeTypes[SEnvNodeTypes["TEXT"] = 3] = "TEXT";
    SEnvNodeTypes[SEnvNodeTypes["CDATA_SECTION"] = 4] = "CDATA_SECTION";
    SEnvNodeTypes[SEnvNodeTypes["ENTITY_REFERENCE"] = 5] = "ENTITY_REFERENCE";
    SEnvNodeTypes[SEnvNodeTypes["ENTITY"] = 6] = "ENTITY";
    SEnvNodeTypes[SEnvNodeTypes["PROCESSING_INSTRUCTION"] = 7] = "PROCESSING_INSTRUCTION";
    SEnvNodeTypes[SEnvNodeTypes["COMMENT"] = 8] = "COMMENT";
    SEnvNodeTypes[SEnvNodeTypes["DOCUMENT"] = 9] = "DOCUMENT";
    SEnvNodeTypes[SEnvNodeTypes["DOCUMENT_TYPE"] = 10] = "DOCUMENT_TYPE";
    SEnvNodeTypes[SEnvNodeTypes["DOCUMENT_FRAGMENT"] = 11] = "DOCUMENT_FRAGMENT";
    SEnvNodeTypes[SEnvNodeTypes["NOTATION"] = 12] = "NOTATION";
})(SEnvNodeTypes = exports.SEnvNodeTypes || (exports.SEnvNodeTypes = {}));
;
// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
var CSSRuleType;
(function (CSSRuleType) {
    CSSRuleType[CSSRuleType["STYLE_RULE"] = 0] = "STYLE_RULE";
    CSSRuleType[CSSRuleType["CHARSET_RULE"] = 1] = "CHARSET_RULE";
    CSSRuleType[CSSRuleType["IMPORT_RULE"] = 2] = "IMPORT_RULE";
    CSSRuleType[CSSRuleType["MEDIA_RULE"] = 3] = "MEDIA_RULE";
    CSSRuleType[CSSRuleType["FONT_FACE_RULE"] = 4] = "FONT_FACE_RULE";
    CSSRuleType[CSSRuleType["PAGE_RULE"] = 5] = "PAGE_RULE";
    CSSRuleType[CSSRuleType["KEYFRAMES_RULE"] = 6] = "KEYFRAMES_RULE";
    CSSRuleType[CSSRuleType["KEYFRAME_RULE"] = 7] = "KEYFRAME_RULE";
    CSSRuleType[CSSRuleType["__FUTURE_NS"] = 8] = "__FUTURE_NS";
    CSSRuleType[CSSRuleType["NAMESPACE_RULE"] = 9] = "NAMESPACE_RULE";
    CSSRuleType[CSSRuleType["COUNTER_STYLE_RULE"] = 10] = "COUNTER_STYLE_RULE";
    CSSRuleType[CSSRuleType["SUPPORTS_RULE"] = 11] = "SUPPORTS_RULE";
    CSSRuleType[CSSRuleType["DOCUMENT_RULE"] = 12] = "DOCUMENT_RULE";
    CSSRuleType[CSSRuleType["FONT_FEATURE_VALUES_RULE"] = 13] = "FONT_FEATURE_VALUES_RULE";
    CSSRuleType[CSSRuleType["VIEWPORT_RULE"] = 14] = "VIEWPORT_RULE";
    CSSRuleType[CSSRuleType["REGION_STYLE_RULE"] = 15] = "REGION_STYLE_RULE";
    CSSRuleType[CSSRuleType["UNKNOWN_RULE"] = 16] = "UNKNOWN_RULE";
})(CSSRuleType = exports.CSSRuleType || (exports.CSSRuleType = {}));
;
exports.DEFAULT_WINDOW_WIDTH = 1366;
exports.DEFAULT_WINDOW_HEIGHT = 768;
exports.SVG_XMLNS = "http://www.w3.org/2000/svg";
exports.HTML_XMLNS = "http://www.w3.org/1999/xhtml";


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/constants.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/constants.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/css/base.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
exports.getSEnvCSSBaseObjectClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvCSSBaseObject = /** @class */ (function () {
        function SEnvCSSBaseObject() {
            this._$id = aerial_common2_1.generateDefaultId();
        }
        Object.defineProperty(SEnvCSSBaseObject.prototype, "$id", {
            get: function () {
                return this._$id;
            },
            set: function (value) {
                this._$id = value;
                this._struct = undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvCSSBaseObject.prototype, "struct", {
            get: function () {
                return this._struct || this.resetStruct();
            },
            enumerable: true,
            configurable: true
        });
        SEnvCSSBaseObject.prototype.resetStruct = function () {
            return this._struct = this.$createStruct();
        };
        SEnvCSSBaseObject.prototype.clone = function () {
            var clone = this.cloneDeep();
            clone.source = this.source;
            clone["$id"] = this.$id;
            return clone;
        };
        return SEnvCSSBaseObject;
    }());
    return SEnvCSSBaseObject;
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/base.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/base.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/css/constants.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSS_STYLE_RULE_SET_SELECTOR_TEXT = "CSS_STYLE_RULE_SET_SELECTOR_TEXT";
exports.CSS_STYLE_RULE_SET_STYLE = "CSS_STYLE_RULE_SET_STYLE";
exports.CSS_STYLE_RULE_SET_STYLE_PROPERTY = "CSS_STYLE_RULE_SET_STYLE_PROPERTY";
exports.CSS_PARENT_INSERT_RULE = "CSS_PARENT_INSERT_RULE";
exports.CSS_PARENT_DELETE_RULE = "CSS_PARENT_DELETE_RULE";
exports.CSS_PARENT_MOVE_RULE = "CSS_PARENT_MOVE_RULE";
exports.CSS_INSERT_CSS_RULE_TEXT = "CSS_INSERT_CSS_RULE_TEXT";


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/constants.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/constants.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

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

/***/ "../aerial-browser-sandbox/src/environment/css/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/style-sheet.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/utils.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/declaration.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/base.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/rules.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/constants.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/mutation.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/css/mutation.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/constants.ts");
exports.insertCSSRuleText = function (target, childIndex, cssText) { return ({
    type: constants_1.CSS_INSERT_CSS_RULE_TEXT,
    target: target,
    childIndex: childIndex,
    cssText: cssText,
}); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/mutation.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/mutation.ts"); } } })();
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

/***/ "../aerial-browser-sandbox/src/environment/css/utils.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer, process) {
Object.defineProperty(exports, "__esModule", { value: true });
var postcss = __webpack_require__("./node_modules/postcss/lib/postcss.js");
var sm = __webpack_require__("./node_modules/source-map/source-map.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var style_sheet_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/style-sheet.ts");
var rules_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/rules.ts");
var declaration_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/declaration.ts");
var source_1 = __webpack_require__("../aerial-browser-sandbox/src/utils/source.ts");
// TODO - memoize this
exports.parseCSS = function (source, map) {
    var expression = postcss.parse(source, {
        map: map
    });
    return expression;
};
var getInlineSourceMap = function (source) {
    var contentMatch = source.match(/sourceMappingURL=data:application\/json;base64,([^\s]+)/);
    if (!contentMatch)
        return null;
    return JSON.parse(new Buffer(contentMatch[1], "base64").toString("utf8"));
};
// TODO - memoize this
exports.evaluateCSS = function (source, sourceURI, context, fingerprint, map) {
    var expression = exports.parseCSS(source, map || getInlineSourceMap(source));
    // todo - fingerprint must be passed in in certain cases
    if (!fingerprint) {
        fingerprint = source_1.generateSourceHash(source);
    }
    var sourceMapConsumer = map && new sm.SourceMapConsumer(map);
    var sourceRoot = map && map.sourceRoot || "";
    var SEnvCSSStyleSheet = style_sheet_1.getSEnvCSSStyleSheetClass(context);
    var SEnvCSSStyleDeclaration = declaration_1.getSEnvCSSStyleDeclarationClass(context);
    var _a = rules_1.getSEnvCSSRuleClasses(context), SEnvCSSFontFace = _a.SEnvCSSFontFace, SEnvCSSStyleRule = _a.SEnvCSSStyleRule, SEnvCSSMediaRule = _a.SEnvCSSMediaRule, SEnvCSSKeyframesRule = _a.SEnvCSSKeyframesRule, SEnvUnknownGroupingRule = _a.SEnvUnknownGroupingRule;
    function getStyleDeclaration(rules) {
        var obj = {};
        for (var i = 0, n = rules.length; i < n; i++) {
            var decl = rules[i];
            if (!decl.value)
                continue;
            // Priority level is not part of the value in regular CSSStyleDeclaration instances. We're
            // Adding it here because it's faster for the app, and easier to work with (for now).
            obj[lodash_1.camelCase(decl.prop)] = decl.value + (decl.important ? " !important" : "");
        }
        return SEnvCSSStyleDeclaration.fromObject(obj);
    }
    function link(expression, synthetic) {
        var uri = sourceURI;
        var start = expression.source.start;
        var end = expression.source.end;
        if (sourceMapConsumer) {
            var originalPosition = sourceMapConsumer.originalPositionFor({
                line: start.line,
                column: start.column
            });
            start = {
                line: originalPosition.line,
                // Bad. Fixes Discrepancy between postcss & source-map source information.
                // There's also an issue with sass and at rules when inlining styles (which isn't covered here). For example
                // @media { body { color: red; }} will produce incorrect source maps
                column: originalPosition.column + 1
            };
            // source-map will automatically prefix with file:// if root / is present, so replace file:// with the actual
            // source root. This MAY not be a bug, but I'm treating it as one for now.
            uri = originalPosition.source; // && originalPosition.source.replace("file:///", sourceRoot + "/"); 
            end = undefined;
        }
        synthetic.source = {
            kind: expression.type,
            // todo - this may not be correct.
            fingerprint: fingerprint,
            uri: uri,
            start: start,
            end: end,
        };
        return synthetic;
    }
    var mapRoot = function (root) {
        var ret = link(root, new SEnvCSSStyleSheet(acceptAll(root.nodes)));
        return ret;
    };
    var mapAtRule = function (atRule) {
        if (atRule.name === "keyframes") {
            return link(atRule, new SEnvCSSKeyframesRule(atRule.params, acceptAll(atRule.nodes)));
        }
        else if (atRule.name === "media") {
            return link(atRule, new SEnvCSSMediaRule(atRule.params, acceptAll(atRule.nodes)));
        }
        else if (atRule.name === "font-face") {
            return link(atRule, new SEnvCSSFontFace(getStyleDeclaration(atRule.nodes)));
        }
        return link(atRule, new SEnvUnknownGroupingRule(acceptAll(atRule.nodes)));
    };
    var mapComment = function (comment) {
        return null;
    };
    var mapDeclaration = function (declaration) {
        return null;
    };
    var mapRule = function (rule) {
        return link(rule, new SEnvCSSStyleRule(rule.selector, getStyleDeclaration(rule.nodes)));
    };
    var acceptAll = function (nodes) {
        return lodash_1.without((nodes || []).map(function (child) { return accept(child); }), null);
    };
    function accept(expression) {
        switch (expression.type) {
            case "root": return mapRoot(expression);
            case "rule": return mapRule(expression);
            case "atrule": return mapAtRule(expression);
            case "comment": return mapComment(expression);
            case "decl": return mapDeclaration(expression);
        }
    }
    return accept(expression);
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/utils.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/css/utils.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/buffer/index.js").Buffer, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/custom-element-registry.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
exports.getSEnvCustomElementRegistry = aerial_common2_1.weakMemo(function (options) {
    return /** @class */ (function () {
        function SEnvCustomElementRegistry(_window) {
            this._window = _window;
            this._registry = {};
            this._definedPromises = {};
            this._definedPromiseResolvers = {};
        }
        SEnvCustomElementRegistry.prototype.define = function (name, constructor, options) {
            // TODO - throw error if already registered
            this._registry[name] = constructor;
            if (this._definedPromiseResolvers[name]) {
                this._definedPromiseResolvers[name]();
            }
        };
        SEnvCustomElementRegistry.prototype.get = function (name) {
            return this._registry[name.toLowerCase()];
        };
        SEnvCustomElementRegistry.prototype.whenDefined = function (name) {
            var _this = this;
            if (this._registry[name])
                return Promise.resolve();
            return this._definedPromises[name] || (this._definedPromises[name] = new Promise(function (resolve) {
                _this._definedPromiseResolvers[name] = function () {
                    _this._definedPromises[name] = _this._definedPromiseResolvers[name] = undefined;
                    resolve();
                };
            }));
        };
        return SEnvCustomElementRegistry;
    }());
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/custom-element-registry.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/custom-element-registry.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/events/event-target.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var callEventListener = function (listener, event) {
    if (typeof listener === "function") {
        listener(event);
    }
    else if (listener) {
        listener.handleEvent(event);
    }
    ;
};
exports.getSEnvEventTargetClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvEventTarget = /** @class */ (function () {
        function SEnvEventTarget() {
            this.___eventListeners = {};
        }
        SEnvEventTarget.prototype.addEventListener = function (type, listener, options) {
            if (!this.___eventListeners[type]) {
                this.___eventListeners[type] = listener;
            }
            else if (!Array.isArray(this.___eventListeners[type])) {
                this.___eventListeners[type] = [this.___eventListeners[type], listener];
            }
            else {
                this.___eventListeners[type].push(listener);
            }
        };
        SEnvEventTarget.prototype.dispatchEvent = function (event) {
            var eva = event;
            eva.$currentTarget = this;
            if (!eva.$target) {
                eva.$target = this;
            }
            var listeners = this.___eventListeners[event.type];
            if (!listeners)
                return false;
            if (Array.isArray(listeners)) {
                for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                    var listener = listeners_1[_i];
                    // -- TODO -- check for stopImmediatePropagation
                    callEventListener(listener, event);
                }
            }
            else {
                callEventListener(listeners, event);
            }
            return true;
        };
        SEnvEventTarget.prototype.removeEventListener = function (type, listener, options) {
            var listeners = this.___eventListeners[type];
            if (!listeners)
                return;
            if (listeners === listener) {
                this.___eventListeners[type] = undefined;
            }
            else if (Array.isArray(listeners)) {
                var index = listeners.indexOf(listener);
                listeners.splice(index, 1);
                if (listeners.length === 1) {
                    this.___eventListeners[type] = listeners[0];
                }
            }
        };
        return SEnvEventTarget;
    }());
    SEnvEventTarget.prototype["___eventListeners"] = {};
    return SEnvEventTarget;
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/events/event-target.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/events/event-target.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/events/event.ts":
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
exports.getSEnvEventClasses = aerial_common2_1.weakMemo(function (context) {
    if (context === void 0) { context = {}; }
    var SEnvEvent = /** @class */ (function () {
        function SEnvEvent() {
            this.defaultPrevented = false;
            this.isTrusted = true;
            this.timeStamp = Date.now();
            this.scoped = false;
        }
        SEnvEvent.prototype.initEvent = function (eventTypeArg, canBubbleArg, cancelableArg) {
            this._type = eventTypeArg;
            this._bubbles = canBubbleArg;
            this._cancelable = cancelableArg;
        };
        Object.defineProperty(SEnvEvent.prototype, "srcElement", {
            get: function () {
                return this.$target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "target", {
            get: function () {
                return this.$target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "currentTarget", {
            get: function () {
                return this.$currentTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "bubbles", {
            get: function () {
                return this._bubbles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvEvent.prototype, "cancelable", {
            get: function () {
                return this._cancelable;
            },
            enumerable: true,
            configurable: true
        });
        SEnvEvent.prototype.preventDefault = function () {
        };
        SEnvEvent.prototype.stopImmediatePropagation = function () {
        };
        SEnvEvent.prototype.stopPropagation = function () {
        };
        SEnvEvent.prototype.deepPath = function () {
            return [];
        };
        ;
        return SEnvEvent;
    }());
    var SEnvWrapperEvent = /** @class */ (function (_super) {
        __extends(SEnvWrapperEvent, _super);
        function SEnvWrapperEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvWrapperEvent.prototype.init = function (source) {
            _super.prototype.initEvent.call(this, source.type, true, true);
            Object.assign(this, source);
            this.$currentTarget = null;
            this.$target = null;
        };
        return SEnvWrapperEvent;
    }(SEnvEvent));
    var SEnvMutationEvent = /** @class */ (function (_super) {
        __extends(SEnvMutationEvent, _super);
        function SEnvMutationEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvMutationEvent.prototype.initMutationEvent = function (mutation) {
            this.mutation = mutation;
            _super.prototype.initEvent.call(this, SEnvMutationEvent.MUTATION, true, true);
        };
        SEnvMutationEvent.MUTATION = "MUTATION";
        return SEnvMutationEvent;
    }(SEnvEvent));
    var SEnvWindowOpenedEvent = /** @class */ (function (_super) {
        __extends(SEnvWindowOpenedEvent, _super);
        function SEnvWindowOpenedEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvWindowOpenedEvent.prototype.initWindowOpenedEvent = function (window) {
            _super.prototype.initEvent.call(this, SEnvWindowOpenedEvent.WINDOW_OPENED, true, true);
            this.window = window;
        };
        SEnvWindowOpenedEvent.WINDOW_OPENED = "WINDOW_OPENED";
        return SEnvWindowOpenedEvent;
    }(SEnvEvent));
    var SEnvURIChangedEvent = /** @class */ (function (_super) {
        __extends(SEnvURIChangedEvent, _super);
        function SEnvURIChangedEvent(uri) {
            var _this = _super.call(this) || this;
            _this.uri = uri;
            _this.initEvent(SEnvURIChangedEvent.URI_CHANGED, true, true);
            return _this;
        }
        SEnvURIChangedEvent.URI_CHANGED = "URI_CHANGED";
        return SEnvURIChangedEvent;
    }(SEnvEvent));
    var SEnvWindowEvent = /** @class */ (function (_super) {
        __extends(SEnvWindowEvent, _super);
        function SEnvWindowEvent(type) {
            var _this = _super.call(this) || this;
            _this.initEvent(type, true, true);
            return _this;
        }
        SEnvWindowEvent.EXTERNAL_URIS_CHANGED = "EXTERNAL_URIS_CHANGED";
        return SEnvWindowEvent;
    }(SEnvEvent));
    return {
        SEnvEvent: SEnvEvent,
        SEnvWrapperEvent: SEnvWrapperEvent,
        SEnvURIChangedEvent: SEnvURIChangedEvent,
        SEnvWindowEvent: SEnvWindowEvent,
        SEnvMutationEvent: SEnvMutationEvent,
        SEnvWindowOpenedEvent: SEnvWindowOpenedEvent
    };
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/events/event.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/events/event.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/events/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/events/event-target.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/events/event.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/events/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/events/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/index.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/window.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/css/index.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/renderers/index.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/utils.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/level3/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/level3/event.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/level3/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/level3/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/local-storage.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
exports.getSEnvLocalStorageClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvLocalStorage = /** @class */ (function () {
        function SEnvLocalStorage(entries, _onChange) {
            if (_onChange === void 0) { _onChange = function () { }; }
            this._onChange = _onChange;
            this._data = new Map(entries);
        }
        Object.defineProperty(SEnvLocalStorage.prototype, "length", {
            get: function () {
                return this._data.size;
            },
            enumerable: true,
            configurable: true
        });
        SEnvLocalStorage.prototype.clear = function () {
            this._data.clear();
            this._didChange();
        };
        SEnvLocalStorage.prototype.getItem = function (key) {
            return this._data.get(key);
        };
        SEnvLocalStorage.prototype.key = function (index) {
            var entries = Array.from(this._data.entries());
            return entries[index] && entries[index][0];
        };
        SEnvLocalStorage.prototype.removeItem = function (key) {
            this._data.delete(key);
            this._didChange();
        };
        SEnvLocalStorage.prototype.setItem = function (key, data) {
            this._data.set(key, data);
            this._didChange();
        };
        SEnvLocalStorage.prototype._didChange = function () {
            this._onChange(Array.from(this._data.entries()));
        };
        return SEnvLocalStorage;
    }());
    return SEnvLocalStorage;
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/local-storage.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/local-storage.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/location.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var Url = __webpack_require__("./node_modules/url/url.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
exports.getSEnvLocationClass = aerial_common2_1.weakMemo(function (context) {
    return /** @class */ (function () {
        function SEnvLocation(_urlStr, _reload) {
            this._urlStr = _urlStr;
            this._reload = _reload;
            this.hash = "";
            this.hostname = "";
            this.href = "";
            this.pathname = "";
            this.port = "";
            this.protocol = "";
            this.search = "";
            this.host = "";
            var parts = Url.parse(_urlStr);
            for (var key in parts) {
                this[key] = parts[key] || "";
            }
            this.origin = this.protocol + "//" + this.host;
        }
        SEnvLocation.prototype.assign = function (url) {
            // TODO
        };
        SEnvLocation.prototype.reload = function (forceReload) {
            if (this._reload) {
                this._reload();
            }
        };
        SEnvLocation.prototype.replace = function (uri) {
        };
        SEnvLocation.prototype.toString = function () {
            return this._urlStr;
        };
        return SEnvLocation;
    }());
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/location.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/location.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/media-match.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var getMediaTextTokens = function (mediaText) {
    var tokens = [];
    var cursor = 0;
    while (cursor < mediaText.length) {
        var c = mediaText.charAt(cursor);
        var rest = mediaText.substr(cursor);
        var match = rest.match(/^([a-zA-Z0-9-\.\-\\]+|\(|\)|\:|\s|\t|\,|\/|\+|\-)/);
        if (!match) {
            throw new Error("Syntax error, unexpected token " + c + " in " + mediaText + ".");
        }
        // do not add ws chars
        if (!/^[\s\t]+$/.test(match[1])) {
            tokens.push(match[1]);
        }
        cursor += match[1].length;
    }
    return tokens;
};
// only support pixels for now
var calcMeasurement = function (value, window) { return value.replace("px", ""); };
var MEDIA_PROP_CONVERSION = {
    "min-width": ["context.innerWidth", ">"],
    "max-width": ["context.innerWidth", "<"],
    "min-height": ["context.innerHeight", ">"],
    "max-height": ["context.innerHeight", "<"],
    "-webkit-min-device-pixel-ratio": ["false", "&&"],
    "min--moz-device-pixel-ratio": ["false", "&&"],
    "-o-min-device-pixel-ratio": ["false", "&&"],
    "min-device-pixel-ratio": ["false", "&&"],
    "min-resolution": ["false", "&&"]
};
var getMediaJSExpression = function (cursor, tokens, until) {
    var buffer = [];
    while (cursor < tokens.length) {
        var token = tokens[cursor];
        if (token === until) {
            break;
        }
        cursor++;
        // eat these
        if (/^(only|\(\))$/.test(token)) {
            continue;
        }
        // unsupported media types for now
        if (/^(print)$/.test(token)) {
            buffer.push("false");
        }
        else if (token === "screen") {
            // for now -- later we can do context.type === "screen"
            buffer.push("true");
        }
        else if (MEDIA_PROP_CONVERSION[token]) {
            var chunk = getMediaJSExpression(++cursor, tokens, ")");
            cursor += chunk.length;
            buffer.push.apply(buffer, MEDIA_PROP_CONVERSION[token].concat(["calcMeasurement(\"" + chunk.join(" ") + "\"", ", context)"]));
        }
        else if (token === "and") {
            buffer.push("&&");
        }
        else if (token === "or" || token === ",") {
            buffer.push("&&");
        }
        else {
            buffer.push(token);
        }
    }
    return buffer;
};
var translateMediaText = function (mediaText) {
    return getMediaJSExpression(0, getMediaTextTokens(mediaText)).join(" ");
};
var compileMediaText = aerial_common2_1.weakMemo(function (mediaText) { return new Function("context", "calcMeasurement", "return " + translateMediaText(mediaText)); });
exports.createMediaMatcher = function (window) { return function (mediaText) {
    return compileMediaText(mediaText)(window, calcMeasurement);
}; };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/media-match.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/media-match.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/bound-utils.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
function translateAbsoluteToRelativePoint(event, relativeElement) {
    var zoom = relativeElement;
    var left = event.clientX || event.left;
    var top = event.clientY || event.top;
    var bounds = relativeElement.getBoundingClientRect();
    var rx = left - bounds.left;
    var ry = top - bounds.top;
    return { left: rx, top: ry };
}
exports.translateAbsoluteToRelativePoint = translateAbsoluteToRelativePoint;
function calculateCSSMeasurments(style) {
    var calculated = {};
    for (var key in style) {
        if (hasMeasurement(key)) {
            calculated[key] = Number(style[key].replace("px", ""));
        }
    }
    return calculated;
}
exports.calculateCSSMeasurments = calculateCSSMeasurments;
/**
 * Robust method for fetching parent nodes outside
 * of an iframe
 */
function getParentNode(node) {
    var parentNode = node.parentNode;
    // if (parentNode) {
    //   if (parentNode.nodeName === "#document") {
    //     const localWindow  = node.ownerDocument.defaultView;
    //     if (localWindow && localWindow !== window) {
    //       const parentWindow = localWindow.parent;
    //       return Array.prototype.find.call(parentWindow.document.querySelectorAll("iframe"), (iframe) => {
    //         return iframe.contentWindow === localWindow;
    //       });
    //     }
    //   // shadow root
    //   } else if (parentNode.nodeName === "#document-fragment" && parentNode["host"]) {
    //     return parentNode["host"];
    //   }
    // }
    return parentNode;
}
function parseCSSMatrixValue(value) {
    return value.replace(/matrix\((.*?)\)/, "$1").split(/,\s/).map(function (value) { return Number(value); });
}
function calculateTransform(node, includeIframes) {
    if (includeIframes === void 0) { includeIframes = true; }
    var cnode = node;
    var matrix = [0, 0, 0, 0, 0, 0];
    while (cnode) {
        if (cnode.nodeName === "IFRAME" && cnode !== node && !includeIframes) {
            break;
        }
        if (cnode.nodeType === 1) {
            // TODO - this needs to be memoized - getComputedStyle is expensive.
            var style = cnode.ownerDocument.defaultView.getComputedStyle(cnode);
            if (style.transform !== "none") {
                var cnodeMatrix = parseCSSMatrixValue(style.transform);
                for (var i = cnodeMatrix.length; i--;) {
                    matrix[i] += cnodeMatrix[i];
                }
            }
        }
        cnode = getParentNode(cnode);
    }
    return [matrix[0] || 1, matrix[1], matrix[2], matrix[3] || 1, matrix[4], matrix[5]];
}
function calculateUntransformedBoundingRect(node) {
    var rect = node.getBoundingClientRect();
    var bounds = aerial_common2_1.createBounds(rect.left, rect.right, rect.top, rect.bottom);
    var matrix = calculateTransform(node, false);
    return aerial_common2_1.zoomBounds(aerial_common2_1.shiftBounds(bounds, { left: -matrix[4], top: -matrix[5] }), 1 / matrix[0]);
}
exports.calculateUntransformedBoundingRect = calculateUntransformedBoundingRect;
function hasMeasurement(key) {
    return /left|top|right|bottom|width|height|padding|margin|border/.test(key);
}
function roundMeasurements(style) {
    var roundedStyle = {};
    for (var key in style) {
        var measurement = roundedStyle[key] = style[key];
        if (hasMeasurement(key)) {
            var value = measurement.match(/^(-?[\d\.]+)/)[1];
            var unit = measurement.match(/([a-z]+)$/)[1];
            // ceiling is necessary here for zoomed in elements
            roundedStyle[key] = Math.round(Number(value)) + unit;
        }
    }
    return roundedStyle;
}
exports.getRelativeElementPosition = function (element) {
    var style = element.ownerDocument.defaultView.getComputedStyle(element);
};
function calculateAbsoluteBounds(node) {
    var rect = calculateUntransformedBoundingRect(node);
    return rect;
}
exports.calculateAbsoluteBounds = calculateAbsoluteBounds;
function calculateElementTransforms(node) {
    var computedStyle = calculateCSSMeasurments(node.ownerDocument.defaultView.getComputedStyle(node));
    var oldWidth = node.style.width;
    var oldTop = node.style.top;
    var oldLeft = node.style.left;
    var oldBoundsSizing = node.style.boxSizing;
    node.style.left = "0px";
    node.style.top = "0px";
    node.style.width = "100px";
    node.style.boxSizing = "border-bounds";
    var bounds = this.bounds;
    var scale = bounds.width / 100;
    var left = bounds.left;
    var top = bounds.top;
    node.style.left = oldLeft;
    node.style.top = oldTop;
    node.style.width = oldWidth;
    node.style.boxSizing = oldBoundsSizing;
    return { scale: scale, left: left, top: top };
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/bound-utils.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/bound-utils.ts"); } } })();
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

/***/ "../aerial-browser-sandbox/src/environment/nodes/constants.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
exports.ATTACH_SHADOW_ROOT_EDIT = "attachShadowRootEdit";
exports.SET_TEXT_CONTENT = "setTextContent";
exports.INSERT_HTML_EDIT = "INSERT_HTML_EDIT";
exports.INSERT_CHILD_NODE_EDIT = "INSERT_CHILD_NODE_EDIT";
exports.REMOVE_CHILD_NODE_EDIT = "REMOVE_CHILD_NODE_EDIT";
exports.MOVE_CHILD_NODE_EDIT = "MOVE_CHILD_NODE_EDIT";
exports.UPDATE_VALUE_NODE = "UPDATE_VALUE_NODE";


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/constants.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/constants.ts"); } } })();
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

/***/ "../aerial-browser-sandbox/src/environment/nodes/exceptions.ts":
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
exports.getDOMExceptionClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvDOMException = /** @class */ (function (_super) {
        __extends(SEnvDOMException, _super);
        function SEnvDOMException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SEnvDOMException;
    }(Error));
    return {
        SEnvDOMException: SEnvDOMException
    };
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/exceptions.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/exceptions.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/fragment.ts":
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
var parent_node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
exports.getSEnvDocumentFragment = aerial_common2_1.weakMemo(function (context) {
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvDocumentFragment, _super);
        function SEnvDocumentFragment() {
            var _this = _super.call(this) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT;
            _this.nodeName = "#document-fragment";
            return _this;
        }
        SEnvDocumentFragment.prototype.getElementById = function (elementId) {
            return this.querySelector("#" + elementId);
        };
        SEnvDocumentFragment.prototype.cloneShallow = function () {
            var clone = this.ownerDocument.createDocumentFragment();
            return clone;
        };
        return SEnvDocumentFragment;
    }(SEnvParentNode));
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/fragment.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/fragment.ts"); } } })();
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

/***/ "../aerial-browser-sandbox/src/environment/nodes/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/document.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/element.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/html-elements.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/named-node-map.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/exceptions.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/text.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/comment.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/utils.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/bound-utils.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/light-document.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/mutation.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/index.ts"); } } })();
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

/***/ "../aerial-browser-sandbox/src/environment/nodes/mutation.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
exports.createInsertHTMLMutation = function (target, childIndex, html) { return ({
    type: constants_1.INSERT_HTML_EDIT,
    html: html,
    childIndex: childIndex,
    target: target
}); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/mutation.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/mutation.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/named-node-map.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
exports.getSEnvNamedNodeMapClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvEventTarget = events_1.getSEnvEventTargetClass(context);
    return /** @class */ (function () {
        function SEnvNamedNodeMap() {
        }
        SEnvNamedNodeMap.prototype.getNamedItem = function (name) {
            return null;
        };
        SEnvNamedNodeMap.prototype.getNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.item = function (index) {
            return null;
        };
        SEnvNamedNodeMap.prototype.removeNamedItem = function (name) {
            return null;
        };
        SEnvNamedNodeMap.prototype.removeNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.setNamedItem = function (arg) {
            return null;
        };
        SEnvNamedNodeMap.prototype.setNamedItemNS = function (arg) {
            return null;
        };
        return SEnvNamedNodeMap;
    }());
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/named-node-map.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/named-node-map.ts"); } } })();
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

/***/ "../aerial-browser-sandbox/src/environment/nodes/utils.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
// TODO - break this into other util files
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
var parse5 = __webpack_require__("./node_modules/parse5/lib/index.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var source_1 = __webpack_require__("../aerial-browser-sandbox/src/utils/source.ts");
var VOID_ELEMENTS = __webpack_require__("./node_modules/void-elements/index.js");
exports.parseHTMLDocument = aerial_common2_1.weakMemo(function (content) {
    var ast = parse5.parse(content, { locationInfo: true });
    return ast;
});
exports.parseHTMLDocumentFragment = aerial_common2_1.weakMemo(function (content) {
    var ast = parse5.parseFragment(content, { locationInfo: true });
    return ast;
});
exports.evaluateHTMLDocumentFragment = function (source, document, parentNode) { return exports.mapExpressionToNode(exports.parseHTMLDocumentFragment(source), source_1.generateSourceHash(source), document, parentNode); };
exports.getHTMLASTNodeLocation = function (expression) {
    var loc = expression.__location;
    if (!loc)
        return undefined;
    if (loc.startTag) {
        return { line: loc.startTag.line, column: loc.startTag.col };
    }
    else {
        return { line: loc.line, column: loc.col };
    }
};
var addNodeSource = function (node, fingerprint, expressionOrLocation) {
    var start = expressionOrLocation.__location ? exports.getHTMLASTNodeLocation(expressionOrLocation) : { line: expressionOrLocation.line, column: expressionOrLocation.col };
    var window = node.ownerDocument.defaultView;
    node.source = {
        uri: window.getSourceUri(node.ownerDocument && node.ownerDocument.defaultView.location.toString()),
        fingerprint: fingerprint,
        start: start
    };
    return node;
};
var p = Promise.resolve().then(function () {
    return new Promise(function (resolve) {
    });
});
exports.mapChildExpressionsToNodes = function (promise, childExpressions, fingerprint, document, parentNode, async) {
    if (async === void 0) { async = false; }
    var _loop_1 = function (childExpression) {
        if (async) {
            promise = promise.then(function () {
                var p = exports.mapExpressionToNode(childExpression, fingerprint, document, parentNode, async);
                return p;
            });
        }
        else {
            exports.mapExpressionToNode(childExpression, fingerprint, document, parentNode, async);
        }
    };
    for (var _i = 0, childExpressions_1 = childExpressions; _i < childExpressions_1.length; _i++) {
        var childExpression = childExpressions_1[_i];
        _loop_1(childExpression);
    }
    return promise;
};
exports.mapExpressionToNode = function (expression, fingerprint, document, parentNode, async) {
    if (async === void 0) { async = false; }
    var promise = Promise.resolve();
    switch (expression.nodeName) {
        case "#document-fragment": {
            var fragmentExpression = expression;
            var fragment = document.createDocumentFragment();
            promise = exports.mapChildExpressionsToNodes(promise, fragmentExpression.childNodes, fingerprint, document, fragment, async);
            addNodeSource(fragment, fingerprint, expression);
            parentNode.appendChild(fragment);
            break;
        }
        case "#text": {
            var textNode = addNodeSource(document.createTextNode(expression.value), fingerprint, expression);
            parentNode.appendChild(textNode);
            break;
        }
        case "#comment": {
            var comment = addNodeSource(document.createComment(expression.data), fingerprint, expression);
            parentNode.appendChild(comment);
            break;
        }
        case "#documentType": {
            break;
        }
        case "#document": {
            var documentExpression = expression;
            promise = exports.mapChildExpressionsToNodes(promise, documentExpression.childNodes, fingerprint, document, parentNode, async);
            break;
        }
        default: {
            var elementExpression = expression;
            var element_1 = document.createElement(elementExpression.nodeName);
            for (var _i = 0, _a = elementExpression.attrs; _i < _a.length; _i++) {
                var attr = _a[_i];
                element_1.setAttribute(attr.name, attr.value);
            }
            addNodeSource(element_1, fingerprint, expression);
            promise = exports.mapChildExpressionsToNodes(promise, elementExpression.childNodes, fingerprint, document, element_1, async);
            if (async) {
                // append to document so that connectedCallback called, triggering a load
                parentNode.appendChild(element_1);
                promise = promise.then(function () {
                    return element_1.contentLoaded;
                });
            }
            else {
                parentNode.appendChild(element_1);
            }
        }
    }
    return promise;
};
exports.whenLoaded = function (node) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, node.interactiveLoaded];
            case 1:
                _a.sent();
                return [4 /*yield*/, Promise.all(Array.prototype.map.call(node.childNodes, function (child) { return exports.whenLoaded(child); }))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var querySelectorFilter = function (selector) { return function (node) {
    return node.nodeType === constants_1.SEnvNodeTypes.ELEMENT
        && node.ownerDocument.defaultView.$selector.match(node, selector);
}; };
exports.matchesSelector = function (node, selector) {
    return node.nodeType === constants_1.SEnvNodeTypes.ELEMENT
        && node.ownerDocument.defaultView.$selector.match(node, selector);
};
exports.querySelector = function (node, selector) {
    return exports.findNode(node, querySelectorFilter(selector));
};
exports.querySelectorAll = function (node, selector) {
    return exports.filterNodes(node, querySelectorFilter(selector));
};
exports.findNode = function (parent, filter) {
    if (filter(parent)) {
        return parent;
    }
    var found;
    for (var _i = 0, _a = Array.prototype.slice.call(parent.childNodes); _i < _a.length; _i++) {
        var child = _a[_i];
        found = exports.findNode(child, filter);
        if (found) {
            return found;
        }
    }
};
exports.filterNodes = function (parent, filter, ary) {
    if (ary === void 0) { ary = []; }
    if (filter(parent)) {
        ary.push(parent);
    }
    ;
    for (var _i = 0, _a = Array.prototype.slice.call(parent.childNodes); _i < _a.length; _i++) {
        var child = _a[_i];
        exports.filterNodes(child, filter, ary);
    }
    return ary;
};
function traverseDOMNodeExpression(target, each) {
    if (target.nodeName === "#document" || target.nodeName === "#document-fragment") {
    }
    for (var _i = 0, _a = target["childNodes"] || []; _i < _a.length; _i++) {
        var child = _a[_i];
        if (each(child) === false)
            return;
        traverseDOMNodeExpression(child, each);
    }
}
exports.traverseDOMNodeExpression = traverseDOMNodeExpression;
function findDOMNodeExpression(target, filter) {
    var found;
    traverseDOMNodeExpression(target, function (expression) {
        if (filter(expression)) {
            found = expression;
            return false;
        }
    });
    return found;
}
exports.findDOMNodeExpression = findDOMNodeExpression;
function filterDOMNodeExpressions(target, filter) {
    var found = [];
    traverseDOMNodeExpression(target, function (expression) {
        if (filter(expression)) {
            found.push(expression);
        }
    });
    return found;
}
exports.filterDOMNodeExpressions = filterDOMNodeExpressions;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/utils.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/utils.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/renderers/base.ts":
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
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var EventTarget = events_1.getSEnvEventTargetClass();
var _a = events_1.getSEnvEventClasses(), SEnvEvent = _a.SEnvEvent, SEnvMutationEvent = _a.SEnvMutationEvent;
;
;
var SyntheticWindowRendererEvent = /** @class */ (function (_super) {
    __extends(SyntheticWindowRendererEvent, _super);
    function SyntheticWindowRendererEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticWindowRendererEvent.prototype.initRendererEvent = function (type, rects, styles, scrollRect, scrollPosition) {
        _super.prototype.initEvent.call(this, type, true, true);
        this.rects = rects;
        this.styles = styles;
        this.scrollRect = scrollRect;
        this.scrollPosition = scrollPosition;
    };
    SyntheticWindowRendererEvent.PAINTED = "PAINTED";
    return SyntheticWindowRendererEvent;
}(SEnvEvent));
exports.SyntheticWindowRendererEvent = SyntheticWindowRendererEvent;
var SyntheticWindowRendererNativeEvent = /** @class */ (function (_super) {
    __extends(SyntheticWindowRendererNativeEvent, _super);
    function SyntheticWindowRendererNativeEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticWindowRendererNativeEvent.prototype.init = function (type, targetNodeId, event) {
        _super.prototype.initEvent.call(this, type, true, true);
        this.targetNodeId = targetNodeId;
        this.nativeEvent = event;
    };
    SyntheticWindowRendererNativeEvent.NATIVE_EVENT = "NATIVE_EVENT";
    return SyntheticWindowRendererNativeEvent;
}(SEnvEvent));
exports.SyntheticWindowRendererNativeEvent = SyntheticWindowRendererNativeEvent;
var REQUEST_UPDATE_TIMEOUT = 50;
var BaseSyntheticWindowRenderer = /** @class */ (function (_super) {
    __extends(BaseSyntheticWindowRenderer, _super);
    function BaseSyntheticWindowRenderer(_sourceWindow) {
        var _this = _super.call(this) || this;
        _this._sourceWindow = _sourceWindow;
        _this._id = Math.random();
        _this._runningPromise = Promise.resolve();
        _this._onDocumentLoad = _this._onDocumentLoad.bind(_this);
        _this._onDocumentReadyStateChange = _this._onDocumentReadyStateChange.bind(_this);
        _this._onWindowResize = _this._onWindowResize.bind(_this);
        _this._onWindowScroll = _this._onWindowScroll.bind(_this);
        _this._onWindowMutation = _this._onWindowMutation.bind(_this);
        _this._addTargetListeners();
        _this.reset();
        return _this;
    }
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "allBoundingClientRects", {
        get: function () {
            return this._rects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "clientRects", {
        get: function () {
            return this._rects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "computedStyles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "scrollRect", {
        get: function () {
            return this._scrollRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "scrollPosition", {
        get: function () {
            return this._scrollPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticWindowRenderer.prototype, "sourceWindow", {
        get: function () {
            return this._sourceWindow;
        },
        enumerable: true,
        configurable: true
    });
    BaseSyntheticWindowRenderer.prototype.getBoundingClientRect = function (element) {
        return this._rects && this._rects[element.$id];
    };
    BaseSyntheticWindowRenderer.prototype.getComputedStyle = function (element, pseudoElement) {
        return this._styles && this._styles[element.$id];
    };
    BaseSyntheticWindowRenderer.prototype._removeTargetListeners = function () {
    };
    BaseSyntheticWindowRenderer.prototype.dispose = function () {
        this._disposed = true;
        this._sourceWindow.document.removeEventListener("readystatechange", this._onDocumentReadyStateChange);
        this._sourceWindow.removeEventListener("resize", this._onWindowResize);
        this._sourceWindow.removeEventListener("scroll", this._onWindowScroll);
        this._sourceWindow.removeEventListener(SEnvMutationEvent.MUTATION, this._onWindowMutation);
    };
    BaseSyntheticWindowRenderer.prototype._addTargetListeners = function () {
        this._sourceWindow.document.addEventListener("readystatechange", this._onDocumentReadyStateChange);
        this._sourceWindow.addEventListener("resize", this._onWindowResize);
        this._sourceWindow.addEventListener("scroll", this._onWindowScroll);
    };
    BaseSyntheticWindowRenderer.prototype.start = function () {
        if (this._started || this._disposed) {
            return;
        }
        this._started = true;
        this.requestRender();
        // document load is when the page is visible to the user, so only listen for 
        // mutations after stuff is loaded in (They'll be fired as the document is loaded in) (CC)
        this._sourceWindow.addEventListener(SEnvMutationEvent.MUTATION, this._onWindowMutation);
    };
    BaseSyntheticWindowRenderer.prototype._onDocumentReadyStateChange = function (event) {
        if (this._sourceWindow.document.readyState === "complete") {
            this._onDocumentLoad(event);
        }
    };
    BaseSyntheticWindowRenderer.prototype.whenRunning = function () {
        return this._runningPromise;
    };
    BaseSyntheticWindowRenderer.prototype.resume = function () {
        if (this._resolveRunningPromise) {
            var resolve = this._resolveRunningPromise;
            this._resolveRunningPromise = undefined;
            resolve();
        }
    };
    BaseSyntheticWindowRenderer.prototype.pause = function () {
        var _this = this;
        if (!this._resolveRunningPromise) {
            this._runningPromise = new Promise(function (resolve) {
                _this._resolveRunningPromise = resolve;
            });
        }
    };
    BaseSyntheticWindowRenderer.prototype._onDocumentLoad = function (event) {
        this.reset();
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype.requestRender = function () {
        var _this = this;
        if (!this._sourceWindow)
            return;
        if (this._currentRenderPromise) {
            this._shouldRenderAgain = true;
        }
        return this._currentRenderPromise || (this._currentRenderPromise = new Promise(function (resolve, reject) {
            var done = function () {
                _this._currentRenderPromise = undefined;
            };
            // renderer here doesn't need to be particularly fast since the user
            // doesn't get to interact with visual content. Provide a slowish
            // timeout to ensure that we don't kill CPU from unecessary renders.
            var render = function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._sourceWindow || this._disposed)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.whenRunning()];
                        case 1:
                            _a.sent();
                            this._shouldRenderAgain = false;
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.getRequestUpdateTimeout()); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.render()];
                        case 3:
                            _a.sent();
                            if (!this._shouldRenderAgain) return [3 /*break*/, 5];
                            this._shouldRenderAgain = false;
                            return [4 /*yield*/, render()];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            render().then(resolve, reject).then(done, done);
        }));
    };
    BaseSyntheticWindowRenderer.prototype.reset = function () {
    };
    BaseSyntheticWindowRenderer.prototype._onWindowResize = function (event) {
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype._onWindowScroll = function (event) {
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype._onWindowMutation = function (event) {
        this.requestRender();
    };
    BaseSyntheticWindowRenderer.prototype.getRequestUpdateTimeout = function () {
        // OVERRIDE ME - used for dynamic render throttling
        return REQUEST_UPDATE_TIMEOUT;
    };
    BaseSyntheticWindowRenderer.prototype.setPaintedInfo = function (rects, styles, scrollRect, scrollPosition) {
        this._rects = rects;
        this._styles = styles;
        this._scrollRect = scrollRect;
        this._scrollPosition = scrollPosition;
        var event = new SyntheticWindowRendererEvent();
        event.initRendererEvent(SyntheticWindowRendererEvent.PAINTED, rects, styles, scrollRect, scrollPosition);
        this.dispatchEvent(event);
    };
    return BaseSyntheticWindowRenderer;
}(EventTarget));
exports.BaseSyntheticWindowRenderer = BaseSyntheticWindowRenderer;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/base.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/base.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/renderers/dom.ts":
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
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var nodes_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/index.ts");
var window_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/window.ts");
var nodes_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/index.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var base_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/renderers/base.ts");
var NODE_NAME_MAP = {
    head: "span",
    html: "span",
    body: "span",
    link: "style",
    script: "span",
    iframe: "span"
};
var SEnvWrapperEvent = events_1.getSEnvEventClasses().SEnvWrapperEvent;
var RECOMPUTE_TIMEOUT = 1;
function getHostStylesheets(node) {
    var p = node.parentNode;
    while (p.parentNode)
        p = p.parentNode;
    return p.styleSheets || [];
}
// See https://github.com/crcn/tandem/blob/318095f9e8672935be4bffea6c7c72aa6d8b95cb/src/@tandem/synthetic-browser/renderers/dom/index.ts
// TODO - this should contain an iframe
var SyntheticDOMRenderer = /** @class */ (function (_super) {
    __extends(SyntheticDOMRenderer, _super);
    function SyntheticDOMRenderer(sourceWindow, targetDocument) {
        var _this = _super.call(this, sourceWindow) || this;
        _this.targetDocument = targetDocument;
        _this.onElementChange = function () {
            _this.requestRender();
        };
        _this._deferResetComputedInfo = lodash_1.throttle(function () {
            _this._resetComputedInfo();
        }, 10);
        _this.container = targetDocument.createElement("iframe");
        Object.assign(_this.container.style, {
            border: "none",
            width: "100%",
            height: "100%"
        });
        _this._onContainerResize = _this._onContainerResize.bind(_this);
        _this.mount = targetDocument.createElement("div");
        _this.container.onload = function () {
            _this.container.contentWindow.document.body.appendChild(_this.mount);
            _this.container.contentWindow.addEventListener("resize", _this._onContainerResize);
            _this.requestRender();
        };
        return _this;
    }
    SyntheticDOMRenderer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._documentElement) {
                    this._documentElement = renderHTMLNode(this.sourceWindow.document, {
                        nodes: this._elementDictionary = {},
                        sheets: this._cssRuleDictionary = {}
                    }, this.onElementChange, this.targetDocument);
                    this.mount.appendChild(this._documentElement);
                }
                this._resetComputedInfo();
                return [2 /*return*/];
            });
        });
    };
    SyntheticDOMRenderer.prototype._updateCSSRules = function (staleStyleSheet, syntheticStyleSheet) {
        while (staleStyleSheet.rules.length) {
            staleStyleSheet.deleteRule(0);
        }
        for (var i = 0, n = syntheticStyleSheet.cssRules.length; i < n; i++) {
            var rule = syntheticStyleSheet.cssRules[i];
            try {
                staleStyleSheet.insertRule(rule.previewCSSText, staleStyleSheet.cssRules.length);
            }
            catch (e) {
                // browser may throw errors if it cannot parse the rule -- this will
                // happen unsupported vendor prefixes.
            }
        }
    };
    SyntheticDOMRenderer.prototype._getSourceCSSText = function () {
        return Array.prototype.map.call(this.sourceWindow.document.stylesheets, function (ss) { return (ss.previewCSSText); }).join("\n");
    };
    SyntheticDOMRenderer.prototype._onContainerResize = function (event) {
        this._resetComputedInfo();
    };
    SyntheticDOMRenderer.prototype._onWindowMutation = function (event) {
        _super.prototype._onWindowMutation.call(this, event);
        var mutation = event.mutation;
        if (nodes_1.documentMutators[mutation.type]) {
            var _a = this.getElementDictItem(mutation.target), nativeNode = _a[0], syntheticObject = _a[1];
            // if(!nativeNode) {
            //   console.warn(`Unable to find DOM node for mutation ${mutation.$type}`);
            //   console.log(mutation.target);
            //   console.log(Object.assign({}, this._elementDictionary));
            // }
            if (nativeNode) {
                if (mutation.type === nodes_1.REMOVE_CHILD_NODE_EDIT) {
                    var removeMutation = mutation;
                    window_1.windowMutators[mutation.type](nativeNode, mutation);
                }
                else if (mutation.type === nodes_1.INSERT_CHILD_NODE_EDIT) {
                    var insertMutation = mutation;
                    var child = renderHTMLNode(insertMutation.child, {
                        nodes: this._elementDictionary,
                        sheets: this._cssRuleDictionary
                    }, this.onElementChange, this.targetDocument);
                    window_1.windowMutators[mutation.type](nativeNode, nodes_2.createParentNodeInsertChildMutation(nativeNode, child, insertMutation.index, false));
                }
                else if (mutation.type === nodes_1.ATTACH_SHADOW_ROOT_EDIT) {
                    var shadow = nativeNode.attachShadow({ mode: "open" });
                    this._elementDictionary[mutation.target.shadowRoot.$id] = [shadow, mutation.target.shadowRoot];
                }
                else {
                    window_1.windowMutators[mutation.type](nativeNode, mutation);
                }
            }
            else {
                // MUST replace the entire CSS text here since vendor prefixes get stripped out
                // depending on the browser. This is the simplest method for syncing changes.
                var parentStyleSheet = ((mutation.target.parentRule && mutation.target.parentRule.parentStyleSheet) || mutation.target.parentStyleSheet);
                if (parentStyleSheet) {
                    var _b = this.getCSSObjectDictItem(parentStyleSheet), getNativeStyleSheet = _b[0], syntheticStyleSheet = _b[1];
                    this._updateCSSRules(getNativeStyleSheet(), syntheticStyleSheet);
                }
            }
        }
    };
    SyntheticDOMRenderer.prototype.getElementDictItem = function (synthetic) {
        return this._elementDictionary && this._elementDictionary[synthetic.$id] || [undefined, undefined];
    };
    SyntheticDOMRenderer.prototype.getCSSObjectDictItem = function (synthetic) {
        return this._cssRuleDictionary && this._cssRuleDictionary[synthetic.$id] || [undefined, undefined];
    };
    SyntheticDOMRenderer.prototype._onWindowScroll = function (event) {
        _super.prototype._onWindowScroll.call(this, event);
        // TODO - possibly move this to render
        this.container.contentWindow.scroll(this._sourceWindow.scrollX, this._sourceWindow.scrollY);
    };
    SyntheticDOMRenderer.prototype._resetComputedInfo = function () {
        var rects = {};
        var styles = {};
        var targetWindow = this.targetDocument.defaultView;
        var containerWindow = this.container.contentWindow;
        var containerBody = containerWindow && containerWindow.document.body;
        if (!containerBody) {
            return;
        }
        for (var $id in this._elementDictionary) {
            var _a = this._elementDictionary[$id] || [undefined, undefined], native = _a[0], synthetic = _a[1];
            if (synthetic && synthetic.nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
                var rect = native.getBoundingClientRect() || { width: 0, height: 0, left: 0, top: 0 };
                if (rect.width || rect.height || rect.left || rect.top) {
                    rects[$id] = rect;
                }
                // just attach whatever's returned by the DOM -- don't wrap this in a synthetic, or else
                // there'll be massive performance penalties.
                styles[$id] = targetWindow.getComputedStyle(native);
            }
        }
        if (containerBody) {
            this.setPaintedInfo(rects, styles, {
                width: containerBody.scrollWidth,
                height: containerBody.scrollHeight
            }, {
                left: containerWindow.scrollX,
                top: containerWindow.scrollY
            });
        }
    };
    SyntheticDOMRenderer.prototype.reset = function () {
        var _this = this;
        this._documentElement = undefined;
        this._cssRuleDictionary = {};
        this._elementDictionary = {};
        var mount = this.mount;
        if (mount) {
            mount.innerHTML = "";
            mount.onclick =
                mount.ondblclick =
                    mount.onsubmit =
                        mount.onmousedown =
                            mount.onmouseenter =
                                mount.onmouseleave =
                                    mount.onmousemove =
                                        mount.onmouseout =
                                            mount.onmouseover =
                                                mount.onmouseup =
                                                    mount.onmousewheel =
                                                        mount.onkeydown =
                                                            mount.onkeypress =
                                                                mount.onkeyup = function (event) {
                                                                    for (var $id in _this._elementDictionary) {
                                                                        var _a = _this._elementDictionary[$id] || [undefined, undefined], native = _a[0], synthetic = _a[1];
                                                                        if (native === event.target) {
                                                                            _this.onDOMEvent(synthetic, event);
                                                                        }
                                                                    }
                                                                };
        }
    };
    SyntheticDOMRenderer.prototype.onDOMEvent = function (element, event) {
        // need to cast as synthetic event. This is fine for now though.
        var e = new SEnvWrapperEvent();
        e.init(event);
        element.dispatchEvent(e);
        event.stopPropagation();
        if (/submit/.test(event.type)) {
            event.preventDefault();
        }
        var ne = new base_1.SyntheticWindowRendererNativeEvent();
        ne.init(base_1.SyntheticWindowRendererNativeEvent.NATIVE_EVENT, element.$id, e);
        if (element.tagName.toLowerCase() === "input") {
            element.value = event.target.value;
        }
        this.dispatchEvent(ne);
    };
    return SyntheticDOMRenderer;
}(base_1.BaseSyntheticWindowRenderer));
exports.SyntheticDOMRenderer = SyntheticDOMRenderer;
var eachMatchingElement = function (a, b, each) {
    each(a, b);
    Array.prototype.forEach.call(a.childNodes, function (ac, i) {
        eachMatchingElement(ac, b.childNodes[i], each);
    });
};
var renderHTMLNode = function (node, dicts, onChange, document) {
    switch (node.nodeType) {
        case constants_1.SEnvNodeTypes.TEXT:
            var value = node.textContent;
            var textNode = document.createTextNode(/^[\s\r\n\t]+$/.test(value) ? "" : value);
            dicts.nodes[node.$id] = [textNode, node];
            return textNode;
        case constants_1.SEnvNodeTypes.COMMENT:
            var comment = document.createComment(node.nodeValue);
            dicts.nodes[node.$id] = [comment, node];
            return comment;
        case constants_1.SEnvNodeTypes.ELEMENT:
            var syntheticElement = node;
            var tagNameLower = syntheticElement.tagName.toLowerCase();
            var element_1 = renderHTMLElement(tagNameLower, syntheticElement, dicts, onChange, document);
            element_1.onload = onChange;
            for (var i = 0, n = syntheticElement.attributes.length; i < n; i++) {
                var syntheticAttribute = syntheticElement.attributes[i];
                if (syntheticAttribute.name === "class") {
                    element_1.className = syntheticAttribute.value;
                }
                else {
                    // some cases where the attribute name may be invalid - especially as the app is updating
                    // as the user is typing. E.g: <i </body> will be parsed, but will thrown an error since "<" will be
                    // defined as an attribute of <i>
                    try {
                        // get preview attribute value instead here
                        var value_1 = syntheticElement.getPreviewAttribute(syntheticAttribute.name);
                        element_1.setAttribute(syntheticAttribute.name, value_1);
                    }
                    catch (e) {
                        console.warn(e.stack);
                    }
                }
            }
            if (tagNameLower === "iframe") {
                var iframe = syntheticElement;
                element_1.appendChild(iframe.contentWindow.renderer.container);
            }
            if (tagNameLower === "style" || tagNameLower === "link") {
                var el = syntheticElement;
                element_1.type = "text/css";
                element_1.appendChild(document.createTextNode(el.sheet.previewCSSText));
                // define function since sheet is not set until it's added to the document
                dicts.sheets[el.sheet.$id] = [function () { return element_1.sheet; }, el.sheet];
            }
            // add a placeholder for these blacklisted elements so that diffing & patching work properly. !!!!Note that we STILL want to append child nodes so that DOM mutations can be synchronized. !!!
            if (/^(script|head)$/.test(tagNameLower)) {
                element_1.style.display = "none";
            }
            return appendChildNodes(element_1, syntheticElement.childNodes, dicts, onChange, document);
        case constants_1.SEnvNodeTypes.DOCUMENT:
        case constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT:
            var syntheticContainer = node;
            var containerElement = renderHTMLElement("span", syntheticContainer, dicts, onChange, document);
            return appendChildNodes(containerElement, syntheticContainer.childNodes, dicts, onChange, document);
    }
};
var renderHTMLElement = function (tagName, source, dicts, onChange, document) {
    var mappedTagName = NODE_NAME_MAP[tagName.toLowerCase()] || tagName;
    var element = document.createElementNS(source.namespaceURI === constants_1.SVG_XMLNS ? constants_1.SVG_XMLNS : constants_1.HTML_XMLNS, mappedTagName.toLowerCase());
    if (source.shadowRoot) {
        var shadowRoot = element.attachShadow({ mode: "open" });
        dicts.nodes[source.shadowRoot.$id] = [shadowRoot, source.shadowRoot];
        appendChildNodes(shadowRoot, source.shadowRoot.childNodes, dicts, onChange, document);
    }
    dicts.nodes[source.$id] = [element, source];
    return element;
};
var appendChildNodes = function (container, syntheticChildNodes, dicts, onChange, document) {
    for (var i = 0, n = syntheticChildNodes.length; i < n; i++) {
        var childNode = renderHTMLNode(syntheticChildNodes[i], dicts, onChange, document);
        // ignored
        if (childNode == null)
            continue;
        container.appendChild(childNode);
    }
    return container;
};
exports.createSyntheticDOMRendererFactory = function (targetDocument) { return function (window) { return new SyntheticDOMRenderer(window, targetDocument); }; };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/dom.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/dom.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/renderers/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/renderers/base.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/renderers/dom.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/renderers/noop.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/renderers/mirror.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/index.ts"); } } })();
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

/***/ "../aerial-browser-sandbox/src/environment/renderers/noop.ts":
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
var NoopRendererer = /** @class */ (function (_super) {
    __extends(NoopRendererer, _super);
    function NoopRendererer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        return _this;
    }
    NoopRendererer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return NoopRendererer;
}(base_1.BaseSyntheticWindowRenderer));
exports.NoopRendererer = NoopRendererer;
exports.createNoopRenderer = function (window) {
    return new NoopRendererer(window);
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/noop.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/renderers/noop.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/timers.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(clearImmediate, setImmediate, process) {
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
exports.getSEnvTimerClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvTimers = /** @class */ (function () {
        function SEnvTimers() {
            this._timers = [];
        }
        SEnvTimers.prototype.setTimeout = function (callback, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var timer = setTimeout.apply(void 0, [callback, ms].concat(args));
            this._timers.push(timer);
            return timer;
        };
        SEnvTimers.prototype.clearTimeout = function (timer) {
            clearTimeout(timer);
            this.clearTimer(timer);
        };
        SEnvTimers.prototype.setInterval = function (callback, ms) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var timer = setInterval.apply(void 0, [callback, ms].concat(args));
            this._timers.push(timer);
            return timer;
        };
        SEnvTimers.prototype.clearInterval = function (timer) {
            clearInterval(timer);
            this.clearTimer(timer);
        };
        SEnvTimers.prototype.clearImmediate = function (timer) {
            clearImmediate(timer);
            this.clearTimer(timer);
        };
        SEnvTimers.prototype.clearTimer = function (timer) {
            var index = this._timers.indexOf(timer);
            if (index !== -1) {
                clearTimeout(timer);
                this._timers.splice(index, 1);
            }
        };
        SEnvTimers.prototype.setImmediate = function (callback) {
            var timer = setImmediate(callback);
            this._timers.push(timer);
            return timer;
        };
        SEnvTimers.prototype.dispose = function () {
            for (var i = this._timers.length; i--;) {
                clearInterval(this._timers[i]);
                clearTimeout(this._timers[i]);
                clearImmediate(this._timers[i]);
            }
            this._timers = [];
        };
        return SEnvTimers;
    }());
    return { SEnvTimers: SEnvTimers };
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/timers.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/timers.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/timers-browserify/main.js").clearImmediate, __webpack_require__("./node_modules/timers-browserify/main.js").setImmediate, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/utils.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var Url = __webpack_require__("./node_modules/url/url.js");
// console.log("PAT", path.normalize("http://google.com/a/../b"), Url.resolve("http://google.com/test/index.html", "a.js"), Url.resolve("http://google.com/test", "/a.js"));
// const joinPath = (...parts: string[]) => parts.reduce((a, b) => {
//   return a + (b.charAt(0) === "/" || a.charAt(a.length - 1) === "/" ? b : "/" + b);
// });
exports.getUri = function (href, locationStr) {
    if (locationStr.charAt(0) === "/") {
        return href;
    }
    return Url.resolve(locationStr, href);
    // const location = Url.parse(locationStr);
    // const origin = location.protocol + "//" + location.host;
    // const relativeDir = location.pathname && /.\w+$/.test(location.pathname) ? path.dirname(location.pathname) : location.pathname;
    // return hasURIProtocol(href) ? href : /^\/\//.test(href) ? location.protocol + href : href.charAt(0) === "/" ? joinPath(origin, href) : joinPath(origin, relativeDir, href);
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/utils.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/utils.ts"); } } })();
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
var CACHE = {};
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
            // perf optimization offered for paperclip
            _this.cache = CACHE;
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

/***/ "../aerial-browser-sandbox/src/utils/source.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var md5 = __webpack_require__("./node_modules/md5/md5.js");
exports.generateSourceHash = function (source) { return md5(source); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/utils/source.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/utils/source.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/actions/index.ts":
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
exports.RESIZER_MOVED = "RESIZER_MOVED";
exports.LOADED_SAVED_STATE = "LOADED_SAVED_STATE";
exports.TRIED_LOADING_APP_STATE = "TRIED_LOADING_APP_STATE";
exports.RESIZER_STOPPED_MOVING = "RESIZER_STOPPED_MOVING";
exports.RESIZER_MOUSE_DOWN = "RESIZER_MOUSE_DOWN";
exports.WINDOW_PANE_ROW_CLICKED = "WINDOW_PANE_ROW_CLICKED";
exports.PROMPTED_NEW_WINDOW_URL = "PROMPTED_NEW_WINDOW_URL";
exports.KEYBOARD_SHORTCUT_ADDED = "KEYBOARD_SHORTCUT_ADDED";
exports.DELETE_SHORCUT_PRESSED = "DELETE_SHORCUT_PRESSED";
exports.FULL_SCREEN_SHORTCUT_PRESSED = "FULL_SCREEN_SHORTCUT_PRESSED";
exports.EMPTY_WINDOWS_URL_ADDED = "EMPTY_WINDOWS_URL_ADDED";
exports.ZOOM_IN_SHORTCUT_PRESSED = "ZOOM_IN_SHORTCUT_PRESSED";
exports.ZOOM_OUT_SHORTCUT_PRESSED = "ZOOM_OUT_SHORTCUT_PRESSED";
exports.OPEN_NEW_WINDOW_SHORTCUT_PRESSED = "OPEN_NEW_WINDOW_SHORTCUT_PRESSED";
exports.WINDOW_SELECTION_SHIFTED = "WINDOW_SELECTION_SHIFTED";
exports.CLONE_WINDOW_SHORTCUT_PRESSED = "CLONE_WINDOW_SHORTCUT_PRESSED";
exports.ESCAPE_SHORTCUT_PRESSED = "ESCAPE_SHORTCUT_PRESSED";
exports.NEXT_WINDOW_SHORTCUT_PRESSED = "NEXT_WINDOW_SHORTCUT_PRESSED";
exports.PREV_WINDOW_SHORTCUT_PRESSED = "PREV_WINDOW_SHORTCUT_PRESSED";
exports.TOGGLE_TOOLS_SHORTCUT_PRESSED = "TOGGLE_TOOLS_SHORTCUT_PRESSED";
exports.FULL_SCREEN_TARGET_DELETED = "FULL_SCREEN_TARGET_DELETED";
exports.TOGGLE_TEXT_EDITOR_PRESSED = "TOGGLE_TEXT_EDITOR_PRESSED";
exports.TOGGLE_LEFT_GUTTER_PRESSED = "TOGGLE_LEFT_GUTTER_PRESSED";
exports.TOGGLE_RIGHT_GUTTER_PRESSED = "TOGGLE_RIGHT_GUTTER_PRESSED";
exports.RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
exports.RESIZER_PATH_MOUSE_STOPPED_MOVING = "RESIZER_PATH_MOUSE_STOPPED_MOVING";
exports.TEXT_EDITOR_CHANGED = "TEXT_EDITOR_CHANGED";
exports.CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED = "CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED";
exports.CANVAS_MOTION_RESTED = "CANVAS_MOTION_RESTED";
exports.TREE_NODE_LABEL_CLICKED = "TREE_NODE_LABE_CLICKED";
exports.FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED";
exports.FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
exports.OPEN_EXTERNAL_WINDOWS_REQUESTED = "OPEN_EXTERNAL_WINDOWS_REQUESTED";
exports.FILE_REMOVED = "FILE_REMOVED";
exports.COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
exports.COMPONENTS_PANE_ADD_COMPONENT_CLICKED = "COMPONENTS_PANE_ADD_COMPONENT_CLICKED";
exports.COMPONENTS_PANE_COMPONENT_CLICKED = "COMPONENTS_PANE_COMPONENT_CLICKED";
exports.BREADCRUMB_ITEM_CLICKED = "BREADCRUMB_ITEM_CLICKED";
exports.BREADCRUMB_ITEM_MOUSE_ENTER = "BREADCRUMB_ITEM_MOUSE_ENTER";
exports.BREADCRUMB_ITEM_MOUSE_LEAVE = "BREADCRUMB_ITEM_MOUSE_LEAVE";
exports.FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED";
exports.STAGE_MOUSE_MOVED = "STAGE_MOUSE_MOVED";
exports.STAGE_MOUSE_CLICKED = "STAGE_MOUSE_CLICKED";
exports.VISUAL_EDITOR_WHEEL = "VISUAL_EDITOR_WHEEL";
exports.STAGE_TOOL_WINDOW_TITLE_CLICKED = "STAGE_TOOL_WINDOW_TITLE_CLICKED";
exports.DOWN_KEY_DOWN = "DOWN_KEY_DOWN";
exports.DOWN_KEY_UP = "DOWN_KEY_UP";
exports.UP_KEY_DOWN = "UP_KEY_DOWN";
exports.UP_KEY_UP = "UP_KEY_UP";
exports.LEFT_KEY_DOWN = "LEFT_KEY_DOWN";
exports.LEFT_KEY_UP = "LEFT_KEY_UP";
exports.RIGHT_KEY_DOWN = "RIGHT_KEY_DOWN";
exports.RIGHT_KEY_UP = "RIGHT_KEY_UP";
exports.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED = "STAGE_TOOL_WINDOW_BACKGROUND_CLICKED";
exports.DISPLAY_SOURCE_CODE_REQUESTED = "DISPLAY_SOURCE_CODE_REQUESTED";
exports.STAGE_TOOL_OVERLAY_MOUSE_LEAVE = "STAGE_TOOL_OVERLAY_MOUSE_LEAVE";
exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_START = "STAGE_TOOL_OVERLAY_MOUSE_PAN_START";
exports.STAGE_TOOL_OVERLAY_MOUSE_PANNING = "STAGE_TOOL_OVERLAY_MOUSE_PANNING";
exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_END = "STAGE_TOOL_OVERLAY_MOUSE_PAN_END";
exports.STAGE_TOOL_WINDOW_KEY_DOWN = "STAGE_TOOL_WINDOW_KEY_DOWN";
exports.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED = "OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED";
exports.WORKSPACE_DELETION_SELECTED = "WORKSPACE_DELETION_SELECTED";
exports.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED = "STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED";
exports.SELECTOR_DOUBLE_CLICKED = "SELECTOR_DOUBLE_CLICKED";
exports.STAGE_TOOL_EDIT_TEXT_CHANGED = "STAGE_TOOL_EDIT_TEXT_CHANGED";
exports.STAGE_TOOL_EDIT_TEXT_KEY_DOWN = "STAGE_TOOL_EDIT_TEXT_KEY_DOWN";
exports.STAGE_TOOL_EDIT_TEXT_BLUR = "STAGE_TOOL_EDIT_TEXT_BLUR";
exports.STAGE_MOUNTED = "STAGE_MOUNTED";
exports.CSS_DECLARATION_NAME_CHANGED = "CSS_DECLARATION_NAME_CHANGED";
exports.CSS_DECLARATION_VALUE_CHANGED = "CSS_DECLARATION_VALUE_CHANGED";
exports.WINDOW_FOCUSED = "WINDOW_FOCUSED";
exports.CSS_DECLARATION_CREATED = "CSS_DECLARATION_CREATED";
exports.CSS_DECLARATION_TITLE_MOUSE_ENTER = "CSS_DECLARATION_TITLE_MOUSE_ENTER";
exports.SOURCE_CLICKED = "SOURCE_CLICKED";
exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE = "CSS_DECLARATION_TITLE_MOUSE_LEAVE";
exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED = "TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED";
exports.API_COMPONENTS_LOADED = "API_COMPONENTS_LOADED";
exports.DND_STARTED = "DND_STARTED";
exports.DND_ENDED = "DND_ENDED";
exports.DND_HANDLED = "DND_HANDLED";
/**
 * Factories
 */
exports.canvasElementsComputedPropsChanged = function (syntheticWindowId, allComputedBounds, allComputedStyles) { return ({
    syntheticWindowId: syntheticWindowId,
    type: exports.CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
    allComputedBounds: allComputedBounds,
    allComputedStyles: allComputedStyles
}); };
exports.componentsPaneAddComponentClicked = function () { return ({
    type: exports.COMPONENTS_PANE_ADD_COMPONENT_CLICKED
}); };
exports.componentsPaneComponentClicked = function (componentId, sourceEvent) { return ({
    type: exports.COMPONENTS_PANE_COMPONENT_CLICKED,
    sourceEvent: sourceEvent,
    componentId: componentId
}); };
exports.canvasMotionRested = function () { return ({
    type: exports.CANVAS_MOTION_RESTED
}); };
exports.treeNodeLabelClicked = function (node) { return ({ type: exports.TREE_NODE_LABEL_CLICKED, node: node }); };
exports.stageToolWindowTitleClicked = function (windowId, sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_TITLE_CLICKED, windowId: windowId, sourceEvent: sourceEvent }); };
exports.stageToolWindowKeyDown = function (windowId, sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_KEY_DOWN, windowId: windowId, sourceEvent: sourceEvent }); };
exports.openExternalWindowButtonClicked = function (windowId, sourceEvent) { return ({ type: exports.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED, windowId: windowId, sourceEvent: sourceEvent }); };
exports.stageToolWindowBackgroundClicked = function (sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED, sourceEvent: sourceEvent }); };
// TODO - possible include CSS url, or windowId
exports.toggleCSSTargetSelectorClicked = function (itemId, windowId) { return ({
    type: exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED,
    windowId: windowId,
    itemId: itemId,
}); };
exports.resizerMoved = function (workspaceId, point) { return ({
    workspaceId: workspaceId,
    point: point,
    type: exports.RESIZER_MOVED,
}); };
exports.dndStarted = function (ref, sourceEvent) { return ({
    type: exports.DND_STARTED,
    sourceEvent: sourceEvent,
    ref: ref
}); };
exports.dndEnded = function (ref, sourceEvent) { return ({
    type: exports.DND_ENDED,
    sourceEvent: sourceEvent,
    ref: ref
}); };
exports.dndHandled = function () { return ({
    type: exports.DND_HANDLED
}); };
exports.cssDeclarationNameChanged = function (name, value, declarationId, windowId) { return ({
    declarationId: declarationId,
    windowId: windowId,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_NAME_CHANGED
}); };
exports.cssDeclarationValueChanged = function (name, value, declarationId, windowId) { return ({
    declarationId: declarationId,
    windowId: windowId,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_VALUE_CHANGED
}); };
exports.cssDeclarationCreated = function (name, value, declarationId, windowId) { return ({
    windowId: windowId,
    name: name,
    value: value,
    declarationId: declarationId,
    type: exports.CSS_DECLARATION_CREATED
}); };
exports.cssDeclarationTitleMouseEnter = function (ruleId, windowId) { return ({
    windowId: windowId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_ENTER
}); };
exports.sourceClicked = function (itemId, windowId) { return ({
    windowId: windowId,
    itemId: itemId,
    type: exports.SOURCE_CLICKED
}); };
exports.cssDeclarationTitleMouseLeave = function (ruleId, windowId) { return ({
    windowId: windowId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE
}); };
exports.resizerStoppedMoving = function (workspaceId, point) { return ({
    workspaceId: workspaceId,
    point: point,
    type: exports.RESIZER_STOPPED_MOVING,
}); };
exports.breadcrumbItemClicked = function (nodeId, windowId) { return ({
    nodeId: nodeId,
    windowId: windowId,
    type: exports.BREADCRUMB_ITEM_CLICKED
}); };
exports.breadcrumbItemMouseEnter = function (nodeId, windowId) { return ({
    nodeId: nodeId,
    windowId: windowId,
    type: exports.BREADCRUMB_ITEM_MOUSE_ENTER
}); };
exports.breadcrumbItemMouseLeave = function (nodeId, windowId) { return ({
    nodeId: nodeId,
    windowId: windowId,
    type: exports.BREADCRUMB_ITEM_MOUSE_LEAVE
}); };
exports.windowSelectionShifted = function (windowId) { return ({
    windowId: windowId,
    type: exports.WINDOW_SELECTION_SHIFTED,
}); };
exports.resizerMouseDown = function (workspaceId, sourceEvent) { return ({
    workspaceId: workspaceId,
    sourceEvent: sourceEvent,
    type: exports.RESIZER_MOUSE_DOWN,
}); };
exports.stageToolOverlayMouseLeave = function (sourceEvent) { return ({
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_LEAVE,
    sourceEvent: sourceEvent
}); };
exports.stageToolOverlayMousePanStart = function (windowId) { return ({
    windowId: windowId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
}); };
exports.windowFocused = function (windowId) { return ({
    type: exports.WINDOW_FOCUSED,
    windowId: windowId
}); };
exports.stageToolOverlayMousePanning = function (windowId, center, deltaY, velocityY) { return ({
    windowId: windowId,
    center: center,
    deltaY: deltaY,
    velocityY: velocityY,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PANNING,
}); };
exports.stageToolOverlayMousePanEnd = function (windowId) { return ({
    windowId: windowId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
}); };
exports.fullScreenTargetDeleted = function () { return ({
    type: exports.FULL_SCREEN_TARGET_DELETED
}); };
exports.loadedSavedState = function (state) { return ({
    type: exports.LOADED_SAVED_STATE,
    state: state
}); };
exports.triedLoadedSavedState = function () { return ({
    type: exports.TRIED_LOADING_APP_STATE,
}); };
exports.stageToolOverlayMouseDoubleClicked = function (windowId, sourceEvent) { return ({
    windowId: windowId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
    sourceEvent: sourceEvent
}); };
exports.selectorDoubleClicked = function (item, sourceEvent) { return ({
    item: item,
    type: exports.SELECTOR_DOUBLE_CLICKED,
    sourceEvent: sourceEvent
}); };
exports.resizerPathMoved = function (workspaceId, anchor, originalBounds, newBounds, sourceEvent) { return ({
    type: exports.RESIZER_PATH_MOUSE_MOVED,
    workspaceId: workspaceId,
    anchor: anchor,
    originalBounds: originalBounds,
    newBounds: newBounds,
    sourceEvent: sourceEvent,
}); };
exports.resizerPathStoppedMoving = function (workspaceId, sourceEvent) { return ({
    type: exports.RESIZER_PATH_MOUSE_STOPPED_MOVING,
    workspaceId: workspaceId,
    sourceEvent: __assign({}, sourceEvent)
}); };
exports.windowPaneRowClicked = function (windowId, sourceEvent) { return ({
    windowId: windowId,
    sourceEvent: sourceEvent,
    type: exports.WINDOW_PANE_ROW_CLICKED
}); };
exports.workspaceSelectionDeleted = function (workspaceId) { return ({
    workspaceId: workspaceId,
    type: exports.WORKSPACE_DELETION_SELECTED
}); };
exports.promptedNewWindowUrl = function (workspaceId, location) { return ({
    location: location,
    workspaceId: workspaceId,
    type: exports.PROMPTED_NEW_WINDOW_URL
}); };
exports.stageToolEditTextChanged = function (nodeId, sourceEvent) { return ({
    type: exports.STAGE_TOOL_EDIT_TEXT_CHANGED,
    nodeId: nodeId,
    sourceEvent: sourceEvent
}); };
exports.stageToolEditTextKeyDown = function (nodeId, sourceEvent) { return ({
    type: exports.STAGE_TOOL_EDIT_TEXT_KEY_DOWN,
    nodeId: nodeId,
    sourceEvent: sourceEvent
}); };
exports.stageToolEditTextBlur = function (nodeId, sourceEvent) { return ({
    nodeId: nodeId,
    type: exports.STAGE_TOOL_EDIT_TEXT_BLUR,
    sourceEvent: sourceEvent
}); };
exports.deleteShortcutPressed = function () { return ({
    type: exports.DELETE_SHORCUT_PRESSED,
}); };
exports.fullScreenShortcutPressed = function () { return ({
    type: exports.FULL_SCREEN_SHORTCUT_PRESSED,
}); };
exports.emptyWindowsUrlAdded = function (url) { return ({
    type: exports.EMPTY_WINDOWS_URL_ADDED,
    url: url,
}); };
exports.zoomInShortcutPressed = function () { return ({
    type: exports.ZOOM_IN_SHORTCUT_PRESSED,
}); };
exports.zoomOutShortcutPressed = function () { return ({
    type: exports.ZOOM_OUT_SHORTCUT_PRESSED,
}); };
exports.openNewWindowShortcutPressed = function () { return ({
    type: exports.OPEN_NEW_WINDOW_SHORTCUT_PRESSED,
}); };
exports.cloneWindowShortcutPressed = function () { return ({
    type: exports.CLONE_WINDOW_SHORTCUT_PRESSED,
}); };
exports.escapeShortcutPressed = function () { return ({
    type: exports.ESCAPE_SHORTCUT_PRESSED,
}); };
exports.nextWindowShortcutPressed = function () { return ({
    type: exports.NEXT_WINDOW_SHORTCUT_PRESSED,
}); };
exports.prevWindowShortcutPressed = function () { return ({
    type: exports.PREV_WINDOW_SHORTCUT_PRESSED,
}); };
exports.toggleToolsShortcutPressed = function () { return ({
    type: exports.TOGGLE_TOOLS_SHORTCUT_PRESSED,
}); };
exports.toggleTextEditorPressed = function () { return ({
    type: exports.TOGGLE_TEXT_EDITOR_PRESSED,
}); };
exports.toggleLeftGutterPressed = function () { return ({
    type: exports.TOGGLE_LEFT_GUTTER_PRESSED,
}); };
exports.toggleRightGutterPressed = function () { return ({
    type: exports.TOGGLE_RIGHT_GUTTER_PRESSED,
}); };
exports.stageWheel = function (workspaceId, canvasWidth, canvasHeight, _a) {
    var metaKey = _a.metaKey, ctrlKey = _a.ctrlKey, deltaX = _a.deltaX, deltaY = _a.deltaY, clientX = _a.clientX, clientY = _a.clientY;
    return ({
        workspaceId: workspaceId,
        metaKey: metaKey,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ctrlKey: ctrlKey,
        deltaX: deltaX,
        deltaY: deltaY,
        type: exports.VISUAL_EDITOR_WHEEL,
    });
};
exports.stageContainerMounted = function (element) { return ({
    element: element,
    type: exports.STAGE_MOUNTED,
}); };
exports.stageMouseMoved = function (sourceEvent) { return ({
    sourceEvent: sourceEvent,
    type: exports.STAGE_MOUSE_MOVED,
}); };
exports.stageMouseClicked = function (sourceEvent) { return ({
    sourceEvent: sourceEvent,
    type: exports.STAGE_MOUSE_CLICKED,
}); };
exports.apiComponentsLoaded = function (components) { return ({
    type: exports.API_COMPONENTS_LOADED,
    components: components
}); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/actions/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/actions/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/application.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/scss/index.scss");
var reduceReducers = __webpack_require__("./node_modules/reduce-reducers/lib/index.js");
var React = __webpack_require__("./node_modules/react/react.js");
var ReactDOM = __webpack_require__("./node_modules/react-dom/index.js");
var components_1 = __webpack_require__("./src/front-end/components/index.ts");
var reducers_1 = __webpack_require__("./src/front-end/reducers/index.ts");
var sagas_1 = __webpack_require__("./src/front-end/sagas/index.ts");
var react_redux_1 = __webpack_require__("./node_modules/react-redux/es/index.js");
var middleware_1 = __webpack_require__("./src/front-end/middleware/index.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var mainReducer = reduceReducers(aerial_common2_1.workerReducer, reducers_1.applicationReducer);
exports.initApplication = function (initialState) {
    var store = aerial_common2_1.initBaseApplication2(initialState, mainReducer, sagas_1.mainSaga, middleware_1.createWorkerMiddleware());
    var render = function (Main) {
        ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
            React.createElement(Main, { dispatch: function (action) { return store.dispatch(action); } })), initialState.element);
    };
    render(components_1.Main);
    // if (module["hot"]) {
    //   module["hot"].accept(() => {
    //     render(Main);
    //     debugger;
    //   });
    // }
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/application.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/application.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/components-pane.tsx":
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
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var components_pane_pc_1 = __webpack_require__("./src/front-end/components/components-pane.pc");
var pane_1 = __webpack_require__("./src/front-end/components/pane.tsx");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var ICON_SIZE = 110;
var enhanceComponentsPaneCell = recompose_1.compose(recompose_1.pure, state_1.withDragSource({
    getData: function (_a) {
        var tagName = _a.tagName;
        return [state_1.AVAILABLE_COMPONENT, tagName];
    }
}), recompose_1.withHandlers({
    onClick: function (_a) {
        var dispatch = _a.dispatch, tagName = _a.tagName;
        return function (event) {
            dispatch(actions_1.componentsPaneComponentClicked(tagName, event));
        };
    }
}), function (Base) { return function (_a) {
    var label = _a.label, selected = _a.selected, screenshots = _a.screenshots, connectDragSource = _a.connectDragSource, onClick = _a.onClick, dispatch = _a.dispatch;
    var screenshot = screenshots.length ? screenshots[0] : null;
    var width = screenshot && screenshot.clip.right - screenshot.clip.left;
    var height = screenshot && screenshot.clip.bottom - screenshot.clip.top;
    var scale = 1;
    if (width >= height && width > ICON_SIZE) {
        scale = ICON_SIZE / width;
    }
    else if (height >= width && height > ICON_SIZE) {
        scale = ICON_SIZE / height;
    }
    return connectDragSource(React.createElement(Base, { label: label, onClick: onClick, selected: selected, screenshot: screenshot, screenshotScale: scale, hovering: false, onDragStart: null, onDragEnd: null }));
}; });
var enhanceComponentsPane = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onAddComponentClick: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.componentsPaneAddComponentClicked());
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onAddComponentClick = _a.onAddComponentClick;
    var components = (workspace.availableComponents || []).map(function (component) { return (__assign({}, component, { selected: workspace.selectionRefs.find(function (ref) { return ref[1] === component.tagName; }) })); });
    return React.createElement(Base, { components: components, dispatch: dispatch, onAddComponentClick: onAddComponentClick });
}; });
var ComponentsPaneCell = components_pane_pc_1.hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {});
exports.ComponentsPane = components_pane_pc_1.hydrateTdComponentsPane(enhanceComponentsPane, {
    TdPane: pane_1.Pane,
    TdComponentsPaneCell: ComponentsPaneCell
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/css-inspector-pane.tsx":
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
var React = __webpack_require__("./node_modules/react/react.js");
var pane_1 = __webpack_require__("./src/front-end/components/pane.tsx");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var paperclip_1 = __webpack_require__("../paperclip/index.js");
var css_declaration_input_pc_1 = __webpack_require__("./src/front-end/components/css-declaration-input.pc");
var css_inspector_pane_pc_1 = __webpack_require__("./src/front-end/components/css-inspector-pane.pc");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
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
    TdCssSpacedListExprInput: CssSpacedList
});
var enhanceCSSStyleDeclaration = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var name = _a.name, ignored = _a.ignored, disabled = _a.disabled, overridden = _a.overridden, value = _a.value;
    return React.createElement(Base, { name: lodash_1.kebabCase(name), ignored: ignored, disabled: disabled, overridden: overridden, value: paperclip_1.parseDeclaration(value), sourceValue: value });
}; });
var CSSStyleDeclaration = css_inspector_pane_pc_1.hydrateTdStyleDeclaration(enhanceCSSStyleDeclaration, {
    TdCssExprInput: CSSExprInput
});
var beautifyLabel = function (label) {
    return label.replace(/\s*,\s*/g, ", ");
};
var enhanceCSSStyleRule = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var rule = _a.rule, inherited = _a.inherited, ignoredPropertyNames = _a.ignoredPropertyNames, overriddenPropertyNames = _a.overriddenPropertyNames;
    var declarations = rule.style;
    // const properties = [];
    var childDeclarations = [];
    for (var i = 0, n = declarations.length; i < n; i++) {
        var name_1 = declarations[i];
        var value = declarations[name_1];
        var origValue = rule.style.disabledPropertyNames && rule.style.disabledPropertyNames[name_1];
        var disabled = Boolean(origValue);
        var ignored = Boolean(ignoredPropertyNames && ignoredPropertyNames[name_1]);
        var overridden = Boolean(overriddenPropertyNames && overriddenPropertyNames[name_1]);
        // childDeclarations.push({
        //   name,
        //   ignored,
        //   disabled,
        //   overridden,
        //   value,
        // });
    }
    return React.createElement(Base, { label: beautifyLabel(rule.label || rule.selectorText), source: null, declarations: childDeclarations, inherited: inherited });
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
    var workspace = _a.workspace, browser = _a.browser;
    var selectedElementRefs = workspace.selectionRefs.filter(function (_a) {
        var type = _a[0];
        return type === aerial_browser_sandbox_1.SYNTHETIC_ELEMENT;
    });
    if (!selectedElementRefs.length) {
        return null;
    }
    if (selectedElementRefs.length > 1) {
        return React.createElement(CSSPaneMultipleSelectedError, null);
    }
    var _b = selectedElementRefs[0], type = _b[0], targetElementId = _b[1];
    var element = aerial_browser_sandbox_1.getSyntheticNodeById(browser, targetElementId);
    var window = aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, targetElementId);
    if (!element || !window) {
        return null;
    }
    var rules = aerial_browser_sandbox_1.getSyntheticAppliedCSSRules(window, targetElementId);
    return React.createElement(Base, { styleRules: rules });
}; });
exports.CSSInpectorPane = css_inspector_pane_pc_1.hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
    TdPane: pane_1.Pane,
    TdStyleRule: CSSStyleRule
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/css-inspector-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/css-inspector-pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/enhanced.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/components/components-pane.tsx"));
__export(__webpack_require__("./src/front-end/components/windows-pane.tsx"));
__export(__webpack_require__("./src/front-end/components/gutter.tsx"));
__export(__webpack_require__("./src/front-end/components/css-inspector-pane.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/enhanced.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/enhanced.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/gutter.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var gutter_pc_1 = __webpack_require__("./src/front-end/components/gutter.pc");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
exports.Gutter = gutter_pc_1.hydrateTdGutter(recompose_1.compose(recompose_1.pure), {});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/gutter.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/gutter.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// DEPRECATED
__export(__webpack_require__("./src/front-end/components/utils/index.ts"));
__export(__webpack_require__("./src/front-end/components/main/index.tsx"));
__export(__webpack_require__("./src/front-end/components/tree/index.tsx"));
__export(__webpack_require__("./src/front-end/components/gutter.tsx"));
__export(__webpack_require__("./src/front-end/components/isolated/index.tsx"));
// NEW
var enhanced = __webpack_require__("./src/front-end/components/enhanced.ts");
exports.enhanced = enhanced;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/isolated/index.tsx":
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
var React = __webpack_require__("./node_modules/react/react.js");
var ReactDOM = __webpack_require__("./node_modules/react-dom/index.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var Isolate = /** @class */ (function (_super) {
    __extends(Isolate, _super);
    function Isolate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onLoad = function () {
            if (_this.props.onLoad)
                _this.props.onLoad();
        };
        _this.onScroll = function (event) {
            if (_this.props.onScroll)
                _this.props.onScroll(event);
            if (_this.props.scrolling === false) {
                var db = _this.refs.container.contentDocument;
                db.body.scrollLeft = db.body.scrollTop = 0;
            }
        };
        return _this;
    }
    Isolate.prototype.componentDidMount = function () {
        if (window["$synthetic"]) {
            return;
        }
        if (this.props.inheritCSS) {
            var head_1 = this.head;
            var tags = Array.prototype.slice.call(document.getElementsByTagName("style"), 0).concat(Array.prototype.slice.call(document.getElementsByTagName("link"), 0));
            Array.prototype.forEach.call(tags, function (style) {
                head_1.appendChild(style.cloneNode(true));
            });
        }
        this.body.appendChild(this._mountElement = document.createElement("div"));
        if (this.props.onMouseDown) {
            this.body.addEventListener("mousedown", this.props.onMouseDown);
        }
        if (this.props.onKeyDown) {
            this.body.addEventListener("keydown", this.props.onKeyDown);
        }
        this._render();
        this._addListeners();
    };
    Isolate.prototype.componentDidUpdate = function () {
        this._render();
        var scrollPosition = this.props.scrollPosition;
        if (this.window && scrollPosition) {
            if (scrollPosition.left !== this.window.scrollX || scrollPosition.top !== this.window.scrollY) {
                this.window.scrollTo(scrollPosition.left, scrollPosition.top);
            }
        }
    };
    Object.defineProperty(Isolate.prototype, "window", {
        get: function () {
            return this.refs.container && this.refs.container.contentWindow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Isolate.prototype, "head", {
        get: function () {
            return this.window.document.head;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Isolate.prototype, "body", {
        get: function () {
            return this.window.document.body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Isolate.prototype, "container", {
        get: function () {
            return this.refs.container;
        },
        enumerable: true,
        configurable: true
    });
    Isolate.prototype._render = function () {
        if (window["$synthetic"])
            return;
        if (this.props.children && this._mountElement) {
            ReactDOM.render(this.props.children, this._mountElement);
        }
    };
    Isolate.prototype._addListeners = function () {
        aerial_common2_1.bubbleHTMLIframeEvents(this.refs.container, {
            ignoreInputEvents: this.props.ignoreInputEvents,
            translateMousePositions: this.props.translateMousePositions
        });
    };
    Isolate.prototype.render = function () {
        // TODO - eventually want to use iframes. Currently not supported though.
        if (window["$synthetic"]) {
            return React.createElement("span", null, this.props.children);
        }
        return React.createElement("iframe", { ref: "container", onDragOver: this.props.onDragOver, onDrop: this.props.onDrop, onWheel: this.props.onWheel, onScroll: this.onScroll, onLoad: this.onLoad, className: this.props.className, style: this.props.style });
    };
    return Isolate;
}(React.Component));
exports.Isolate = Isolate;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/isolated/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/isolated/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var workspace_1 = __webpack_require__("./src/front-end/components/main/workspace/index.tsx");
var react_redux_1 = __webpack_require__("./node_modules/react-redux/es/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
exports.MainBase = function (_a) {
    var state = _a.state, dispatch = _a.dispatch;
    var workspace = state_1.getSelectedWorkspace(state);
    var browser = aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId);
    return React.createElement("div", { className: "main-component" }, workspace && React.createElement(workspace_1.Workspace, { state: state, workspace: workspace, dispatch: dispatch, browser: browser }));
};
var enhanceMain = recompose_1.compose(react_redux_1.connect(function (state) { return ({ state: state }); }));
exports.Main = enhanceMain(exports.MainBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/breadcrumbs/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/breadcrumbs/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var cx = __webpack_require__("./node_modules/classnames/index.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var getBreadcrumbNodes = aerial_common2_1.weakMemo(function (workspace, browser) {
    if (workspace.selectionRefs.length === 0) {
        return [];
    }
    var _a = workspace.selectionRefs[workspace.selectionRefs.length - 1], type = _a[0], $id = _a[1];
    if (type !== state_1.SYNTHETIC_ELEMENT) {
        return [];
    }
    var node = state_1.getSyntheticNodeById(browser, $id);
    // not ready yet
    if (!node) {
        return [];
    }
    var ancestors = state_1.getSyntheticNodeAncestors(node, state_1.getSyntheticNodeWindow(browser, node.$id)).filter(function (node) { return node.$type === state_1.SYNTHETIC_ELEMENT; }).reverse();
    return ancestors.concat([node]);
});
var BreadcrumbBase = function (_a) {
    var element = _a.element, onClick = _a.onClick, selected = _a.selected, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave;
    return React.createElement("div", { className: cx("breadcrumb fill-text", { selected: selected }), onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
        state_1.getSyntheticElementLabel(element),
        selected ? null : React.createElement("span", { className: "arrow" },
            React.createElement("i", { className: "ion-ios-arrow-right" })));
};
var enhanceBreadcrumb = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, windowId = _a.windowId;
        return function () {
            dispatch(actions_1.breadcrumbItemClicked(element.$id, windowId));
        };
    },
    onMouseEnter: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, windowId = _a.windowId;
        return function () {
            dispatch(actions_1.breadcrumbItemMouseEnter(element.$id, windowId));
        };
    },
    onMouseLeave: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, windowId = _a.windowId;
        return function () {
            dispatch(actions_1.breadcrumbItemMouseEnter(element.$id, windowId));
        };
    }
}));
var Breadcrumb = enhanceBreadcrumb(BreadcrumbBase);
var BreadcrumbsBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    var breadcrumbNodes = getBreadcrumbNodes(workspace, browser);
    return React.createElement("div", { className: "m-html-breadcrumbs" }, breadcrumbNodes.map(function (node, i) {
        return React.createElement(Breadcrumb, { key: node.$id, dispatch: dispatch, element: node, windowId: state_1.getSyntheticNodeWindow(browser, node.$id).$id, selected: i === breadcrumbNodes.length - 1 });
    }));
};
var Breadcrumbs = BreadcrumbsBase;
exports.Breadcrumbs = Breadcrumbs;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/breadcrumbs/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/breadcrumbs/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/element-gutter/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var enhanced_1 = __webpack_require__("./src/front-end/components/enhanced.ts");
exports.ElementGutterBase = function (_a) {
    var browser = _a.browser, workspace = _a.workspace, dispatch = _a.dispatch;
    return React.createElement(enhanced_1.Gutter, { left: false, right: true },
        React.createElement(enhanced_1.CSSInpectorPane, { workspace: workspace, browser: browser, dispatch: dispatch }));
};
var enhanceElementGutter = recompose_1.compose(recompose_1.pure);
exports.ElementGutter = enhanceElementGutter(exports.ElementGutterBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/element-gutter/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/element-gutter/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var element_gutter_1 = __webpack_require__("./src/front-end/components/main/workspace/element-gutter/index.tsx");
var project_gutter_1 = __webpack_require__("./src/front-end/components/main/workspace/project-gutter/index.tsx");
var stage_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/index.tsx");
// import { TextEditor } from "./text-editor";
var breadcrumbs_1 = __webpack_require__("./src/front-end/components/main/workspace/breadcrumbs/index.tsx");
var react_dnd_1 = __webpack_require__("./node_modules/react-dnd/lib/index.js");
var react_dnd_html5_backend_1 = __webpack_require__("./node_modules/react-dnd-html5-backend/lib/index.js");
exports.WorkspaceBase = function (_a) {
    var state = _a.state, workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    var stage = workspace.stage;
    return React.createElement("div", { className: "workspace-component" },
        stage.showLeftGutter ? React.createElement(project_gutter_1.ProjectGutter, { workspace: workspace, browser: browser, dispatch: dispatch }) : null,
        React.createElement("div", { className: "workspace-editors" },
            React.createElement("div", { className: "workspace-stage" },
                React.createElement(stage_1.Stage, { workspace: workspace, dispatch: dispatch, browser: browser }),
                React.createElement(breadcrumbs_1.Breadcrumbs, { workspace: workspace, dispatch: dispatch, browser: browser }))),
        stage.showRightGutter ? React.createElement(element_gutter_1.ElementGutter, { browser: browser, workspace: workspace, dispatch: dispatch }) : null);
};
exports.Workspace = recompose_1.compose(recompose_1.pure, react_dnd_1.DragDropContext(react_dnd_html5_backend_1.default))(exports.WorkspaceBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/project-gutter/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var enhanced_1 = __webpack_require__("./src/front-end/components/enhanced.ts");
exports.ProjectGutterBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    return React.createElement(enhanced_1.Gutter, { left: true, right: false },
        React.createElement(enhanced_1.WindowsPane, { windows: browser.windows || [], dispatch: dispatch, workspace: workspace }),
        React.createElement(enhanced_1.ComponentsPane, { workspace: workspace, dispatch: dispatch }));
};
exports.ProjectGutter = exports.ProjectGutterBase;
// export * from "./file-navigator";
__export(__webpack_require__("./src/front-end/components/main/workspace/project-gutter/windows/index.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/project-gutter/windows/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/project-gutter/windows/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var index_1 = __webpack_require__("./src/front-end/components/pane/index.tsx");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var WindowRow = function (_a) {
    var window = _a.window, dispatch = _a.dispatch;
    return React.createElement("div", { className: "m-windows-pane-window-row", onClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.windowPaneRowClicked.bind(_this, window.$id)) }, window.document && window.document.title || window.location);
};
var WindowsPaneControlsBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onAddWindow = _a.onAddWindow;
    return React.createElement("span", null,
        React.createElement("i", { className: "icon ion-plus", onClick: onAddWindow }));
};
var enhanceControls = recompose_1.compose(recompose_1.withHandlers({
    onAddWindow: function (_a) {
        var workspace = _a.workspace, dispatch = _a.dispatch;
        return function (event) {
            var location = prompt("Type in a URL");
            if (!location)
                return;
            dispatch(actions_1.promptedNewWindowUrl(workspace.$id, location));
        };
    }
}));
var WindowsPaneControls = enhanceControls(WindowsPaneControlsBase);
exports.WindowsPaneBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    return React.createElement(index_1.Pane, { title: "Windows", className: "m-windows-pane", controls: React.createElement(WindowsPaneControls, { workspace: workspace, dispatch: dispatch }) }, browser.windows.map(function (window) { return React.createElement(WindowRow, { key: window.$id, window: window, dispatch: dispatch }); }));
};
exports.WindowsPane = recompose_1.compose(recompose_1.pure)(exports.WindowsPaneBase);
exports.Preview = function () { return React.createElement(exports.WindowsPane, { workspace: state_1.createWorkspace({}), browser: state_1.createSyntheticBrowser({
        windows: [
            state_1.createSyntheticWindow({
                document: state_1.createSyntheticDocument({
                    title: "Window 1"
                })
            }),
            state_1.createSyntheticWindow({
                document: state_1.createSyntheticDocument({
                    title: "Window 2"
                })
            })
        ]
    }), dispatch: function () { } }); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/windows/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/windows/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/empty-windows.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/empty-windows.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var EmptyWindowsBase = function (_a) {
    var onSubmit = _a.onSubmit;
    return React.createElement("div", { className: "m-empty-windows" },
        React.createElement("form", { onSubmit: onSubmit },
            React.createElement("input", { name: "url", type: "text", placeholder: "URL" }),
            React.createElement("input", { type: "submit", value: "Add window!" })));
};
var enhanceEmptyWindows = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onSubmit: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.emptyWindowsUrlAdded(event.target.url.value));
            event.preventDefault();
        };
    }
}));
exports.EmptyWindows = enhanceEmptyWindows(EmptyWindowsBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/empty-windows.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/empty-windows.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
// https://github.com/tandemcode/tandem/blob/master/src/%40tandem/editor/browser/components/pages/workspace/mid/center/canvas/index.tsx#L270
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var cx = __webpack_require__("./node_modules/classnames/index.js");
var tools_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/index.tsx");
var windows_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/windows.tsx");
var isolated_1 = __webpack_require__("./src/front-end/components/isolated/index.tsx");
var empty_windows_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/empty-windows.tsx");
var react_motion_1 = __webpack_require__("./node_modules/react-motion/lib/react-motion.js");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var stiffSpring = function (amount) { return react_motion_1.spring(amount, { stiffness: 330, damping: 30 }); };
var PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
var ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
var enhanceStage = recompose_1.compose(recompose_1.pure, recompose_1.withState('canvasOuter', 'setCanvasOuter', null), recompose_1.withState('stageContainer', 'setStageContainer', null), recompose_1.withHandlers({
    onMouseEvent: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.stageMouseMoved(event));
        };
    },
    onDragOver: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.stageMouseMoved(event));
        };
    },
    onMotionRest: function (_a) {
        var dispatch = _a.dispatch;
        return function () {
            dispatch(actions_1.canvasMotionRested());
        };
    },
    onMouseClick: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.stageMouseClicked(event));
        };
    },
    setStageContainer: function (_a) {
        var dispatch = _a.dispatch, setStageContainer = _a.setStageContainer;
        return function (element) {
            setStageContainer(element);
            dispatch(actions_1.stageContainerMounted(element));
        };
    },
    onWheel: function (_a) {
        var workspace = _a.workspace, dispatch = _a.dispatch, canvasOuter = _a.canvasOuter;
        return function (event) {
            var rect = canvasOuter.getBoundingClientRect();
            event.preventDefault();
            event.stopPropagation();
            dispatch(actions_1.stageWheel(workspace.$id, rect.width, rect.height, event));
        };
    }
}));
exports.StageBase = function (_a) {
    var setCanvasOuter = _a.setCanvasOuter, setStageContainer = _a.setStageContainer, workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch, onWheel = _a.onWheel, onDrop = _a.onDrop, onMouseEvent = _a.onMouseEvent, shouldTransitionZoom = _a.shouldTransitionZoom, onDragOver = _a.onDragOver, onMouseClick = _a.onMouseClick, onMotionRest = _a.onMotionRest, onDragExit = _a.onDragExit;
    if (!workspace)
        return null;
    var _b = workspace.stage, translate = _b.translate, cursor = _b.cursor, fullScreen = _b.fullScreen, smooth = _b.smooth;
    var fullScreenWindow = fullScreen ? aerial_browser_sandbox_1.getSyntheticWindow(browser, fullScreen.windowId) : null;
    var outerStyle = {
        cursor: cursor || "default"
    };
    // TODO - motionTranslate must come from fullScreen.translate
    // instead of here so that other parts of the app can access this info
    var hasWindows = Boolean(browser.windows && browser.windows.length);
    var motionTranslate = hasWindows ? translate : { left: 0, top: 0, zoom: 1 };
    return React.createElement("div", { className: "stage-component", ref: setStageContainer },
        React.createElement(isolated_1.Isolate, { inheritCSS: true, ignoreInputEvents: true, className: "stage-component-isolate", onWheel: onWheel, scrolling: false, translateMousePositions: false },
            React.createElement("span", null,
                React.createElement("style", null, "html, body {\n              overflow: hidden;\n            }"),
                React.createElement("div", { ref: setCanvasOuter, onMouseMove: onMouseEvent, onDragOver: onDragOver, onDrop: onDrop, onClick: onMouseClick, tabIndex: -1, onDragExit: onDragExit, className: "stage-inner", style: outerStyle },
                    React.createElement(react_motion_1.Motion, { defaultStyle: { left: 0, top: 0, zoom: 1 }, style: { left: smooth ? stiffSpring(motionTranslate.left) : motionTranslate.left, top: smooth ? stiffSpring(motionTranslate.top) : motionTranslate.top, zoom: smooth ? stiffSpring(motionTranslate.zoom) : motionTranslate.zoom }, onRest: onMotionRest }, function (translate) {
                        return React.createElement("div", { style: { transform: "translate(" + translate.left + "px, " + translate.top + "px) scale(" + translate.zoom + ")" }, className: cx({ "stage-inner": true }) },
                            hasWindows ? React.createElement(windows_1.Windows, { browser: browser, smooth: smooth, dispatch: dispatch, fullScreenWindowId: workspace.stage.fullScreen && workspace.stage.fullScreen.windowId }) : React.createElement(empty_windows_1.EmptyWindows, { dispatch: dispatch }),
                            hasWindows ? React.createElement(tools_1.ToolsLayer, { workspace: workspace, translate: translate, dispatch: dispatch, browser: browser }) : null);
                    })))));
};
exports.Stage = enhanceStage(exports.StageBase);
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/tools/index.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/tools/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/tools/grid.tsx"));
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var edit_text_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/edit-text.tsx");
var grid_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/grid.tsx");
var windows_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/windows.tsx");
var overlay_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/overlay.tsx");
var affected_nodes_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/affected-nodes.tsx");
var selection_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/index.tsx");
var box_model_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/box-model.tsx");
var static_position_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/static-position.tsx");
exports.ToolsLayerBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch, translate = _a.translate;
    var showTools = workspace.stage.showTools !== false;
    var windowElement = React.createElement(windows_1.WindowsStageTool, { workspace: workspace, browser: browser, dispatch: dispatch, translate: translate });
    if (showTools === false) {
        return React.createElement("div", { className: "m-stage-tools" }, windowElement);
    }
    return React.createElement("div", { className: "m-stage-tools" },
        React.createElement(grid_1.GridStageTool, { translate: translate }),
        React.createElement(overlay_1.NodeOverlaysTool, { zoom: translate.zoom, workspace: workspace, browser: browser, dispatch: dispatch }),
        React.createElement(box_model_1.BoxModelStageTool, { zoom: translate.zoom, workspace: workspace, browser: browser }),
        React.createElement(selection_1.SelectionStageTool, { zoom: translate.zoom, workspace: workspace, browser: browser, dispatch: dispatch }),
        windowElement,
        React.createElement(static_position_1.StaticPositionStageTool, { zoom: translate.zoom, workspace: workspace, browser: browser }),
        React.createElement(edit_text_1.EditTextTool, { zoom: translate.zoom, workspace: workspace, browser: browser, dispatch: dispatch }),
        React.createElement(affected_nodes_1.AffectedNodesTool, { zoom: translate.zoom, workspace: workspace, browser: browser }));
};
exports.ToolsLayer = recompose_1.compose(recompose_1.pure)(exports.ToolsLayerBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/windows.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/windows.scss");
var VOID_ELEMENTS = __webpack_require__("./node_modules/void-elements/index.js");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var window_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/window.tsx");
exports.WindowsBase = function (_a) {
    var _b = _a.browser, browser = _b === void 0 ? null : _b, fullScreenWindowId = _a.fullScreenWindowId, dispatch = _a.dispatch, smooth = _a.smooth;
    return browser && React.createElement("div", { className: "preview-component" }, browser.windows.map(function (window) { return React.createElement(window_1.Window, { smooth: smooth, fullScreenWindowId: fullScreenWindowId, dispatch: dispatch, key: window.$id, window: window }); }));
};
exports.Windows = recompose_1.pure(exports.WindowsBase);
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/window.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/windows.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/windows.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/pane.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var pane_pc_1 = __webpack_require__("./src/front-end/components/pane.pc");
var enhance = recompose_1.compose(recompose_1.pure);
exports.Pane = pane_pc_1.hydrateTdPane(enhance, {});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/tree/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/tree/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var TreeNodeBase = function (_a) {
    var rootNode = _a.rootNode, node = _a.node, getLabel = _a.getLabel, collapsed = _a.collapsed, collapsible = _a.collapsible, onLabelClick = _a.onLabelClick, dispatch = _a.dispatch;
    var isCollapsible = collapsible(node);
    return React.createElement("div", { className: "tree-node" },
        React.createElement("div", { className: "tree-node-label", onClick: onLabelClick, style: {
                cursor: "pointer",
                paddingLeft: (aerial_common2_1.getTreeNodeDepth(node, rootNode) - 1) * 2
            } }, getLabel(node)),
        React.createElement("div", { className: "tree-node-children" }, collapsed ? null : node.childNodes.map(function (child, i) { return React.createElement(TreeNode, { key: i, rootNode: rootNode, node: child, getLabel: getLabel, collapsible: collapsible, dispatch: dispatch }); })));
};
var TreeNode = recompose_1.compose(recompose_1.pure, recompose_1.withState("collapsed", "setCollapsed", function () { return false; }), recompose_1.withHandlers({
    onLabelClick: function (_a) {
        var dispatch = _a.dispatch, node = _a.node, collapsed = _a.collapsed, collapsible = _a.collapsible, setCollapsed = _a.setCollapsed;
        return function () {
            if (collapsible(node)) {
                setCollapsed(!collapsed);
            }
            if (dispatch) {
                dispatch(actions_1.treeNodeLabelClicked(node));
            }
        };
    }
}))(TreeNodeBase);
exports.TreeBase = function (_a) {
    var rootNode = _a.rootNode, getLabel = _a.getLabel, collapsible = _a.collapsible, dispatch = _a.dispatch;
    return React.createElement("div", { className: "tree-component" }, rootNode.childNodes.map(function (child, i) { return React.createElement(TreeNode, { key: i, rootNode: rootNode, node: child, getLabel: getLabel, collapsible: collapsible, dispatch: dispatch }); }));
};
exports.Tree = recompose_1.compose(recompose_1.pure, recompose_1.defaultProps({
    collapsible: function () { return false; }
}))(exports.TreeBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/tree/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/tree/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/utils/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
exports.getDispatcher = recompose_1.getContext({
    dispatch: React.PropTypes.func
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/utils/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/utils/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/windows-pane.tsx":
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
var React = __webpack_require__("./node_modules/react/react.js");
var windows_pane_pc_1 = __webpack_require__("./src/front-end/components/windows-pane.pc");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var WindowsPaneRow = windows_pane_pc_1.hydrateTdWindowsPaneRow(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var onClick = _a.onClick, $id = _a.$id;
        return function (event) {
            onClick(event, $id);
        };
    }
})), {});
exports.WindowsPane = windows_pane_pc_1.hydrateTdWindowsPane(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onWindowClicked: function (_a) {
        var dispatch = _a.dispatch;
        return function (event, windowId) {
            dispatch(actions_1.windowPaneRowClicked(windowId, event));
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, windows = _a.windows, onWindowClicked = _a.onWindowClicked;
    var windowProps = windows.map(function (window) { return (__assign({}, window, { selected: workspace.selectionRefs.find(function (_a) {
            var $type = _a[0], $id = _a[1];
            return $id === window.$id;
        }) })); });
    return React.createElement(Base, { windows: windowProps, onWindowClicked: onWindowClicked });
}; }), {
    TdListItem: null,
    TdWindowsPaneRow: WindowsPaneRow,
    TdList: null,
    TdPane: null
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/windows-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/windows-pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/constants/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.NATIVE_COMPONENTS = [];


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/constants/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/constants/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/entry.ts":
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
var index_1 = __webpack_require__("./src/front-end/index.ts");
var baseConfig = Object.assign({}, {
    storageNamespace: "tandem",
    apiHost: ((location.hash || "").match(/api=([^&]+)/) || [null, "http://localhost:8082"])[1],
}, window["config"] || {});
var state = index_1.createApplicationState(__assign({}, baseConfig, { element: typeof document !== "undefined" ? document.getElementById("application") : undefined, log: {
        level: aerial_common2_1.LogLevel.VERBOSE
    } }));
var browser = index_1.createSyntheticBrowser();
state = index_1.addSyntheticBrowser(state, browser);
var workspace = index_1.createWorkspace({
    browserId: browser.$id
});
state = index_1.addWorkspace(state, workspace);
state = index_1.selectWorkspace(state, workspace.$id);
index_1.initApplication(state);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/entry.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/entry.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/application.tsx"));
__export(__webpack_require__("./src/front-end/state/index.ts"));
__export(__webpack_require__("./src/front-end/reducers/index.ts"));
__export(__webpack_require__("./src/front-end/actions/index.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/middleware/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/middleware/worker.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/middleware/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/middleware/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/middleware/worker.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkerMiddleware = function () { return function (store) {
    return function (next) { return function (action) {
        return next(action);
    }; };
}; };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/middleware/worker.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/middleware/worker.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/reducers/index.ts":
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
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var constants_1 = __webpack_require__("./src/front-end/constants/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
exports.applicationReducer = function (state, event) {
    if (state === void 0) { state = state_1.createApplicationState(); }
    switch (event.type) {
        case actions_1.LOADED_SAVED_STATE: {
            var newState = event.state;
            state = lodash_1.merge({}, state, JSON.parse(JSON.stringify(newState)));
            return state;
        }
        case actions_1.TREE_NODE_LABEL_CLICKED: {
            var node = event.node;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                selectedFileId: node.$id
            });
        }
        case actions_1.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED: {
            var _a = event, itemId = _a.itemId, windowId = _a.windowId;
            var window_1 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var item = aerial_browser_sandbox_1.getSyntheticWindowChild(window_1, itemId);
            var workspace = state_1.getSyntheticWindowWorkspace(state, window_1.$id);
            state = state_1.toggleWorkspaceTargetCSSSelector(state, workspace.$id, item.source.uri, item.selectorText);
            return state;
        }
    }
    // state = canvasReducer(state, event);
    // state = syntheticBrowserReducer(state, event);
    state = aerial_browser_sandbox_1.syntheticBrowserReducer(state, event);
    state = stageReducer(state, event);
    state = windowPaneReducer(state, event);
    state = componentsPaneReducer(state, event);
    state = shortcutReducer(state, event);
    state = apiReducer(state, event);
    state = dndReducer(state, event);
    // state = externalReducer(state, event);
    return state;
};
var PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
var ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
var MIN_ZOOM = 0.02;
var MAX_ZOOM = 6400 / 100;
var INITIAL_ZOOM_PADDING = 50;
var apiReducer = function (state, event) {
    switch (event.type) {
        case actions_1.API_COMPONENTS_LOADED: {
            var components = event.components;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                availableComponents: constants_1.NATIVE_COMPONENTS.concat(components)
            });
        }
    }
    return state;
};
var componentsPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.COMPONENTS_PANE_COMPONENT_CLICKED: {
            var componentId = event.componentId;
            return state_1.setWorkspaceSelection(state, state.selectedWorkspaceId, aerial_common2_1.getStructReference({ $id: componentId, $type: state_1.AVAILABLE_COMPONENT }));
        }
    }
    return state;
};
var shortcutReducer = function (state, event) {
    switch (event.type) {
        case actions_1.TOGGLE_LEFT_GUTTER_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showLeftGutter: !workspace.stage.showLeftGutter
            });
        }
        case actions_1.ESCAPE_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspace(state, workspace.$id, {
                selectionRefs: []
            });
        }
        case actions_1.ZOOM_IN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            if (workspace.stage.fullScreen)
                return state;
            return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) * 2);
        }
        case actions_1.ZOOM_OUT_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            if (workspace.stage.fullScreen)
                return state;
            return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) / 2);
        }
        case actions_1.PREV_WINDOW_SHORTCUT_PRESSED: {
            return state;
        }
        case actions_1.FULL_SCREEN_TARGET_DELETED: {
            return unfullscreen(state);
        }
        case actions_1.FULL_SCREEN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            var selection = workspace.selectionRefs[0];
            var windowId = selection ? selection[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? selection[1] : aerial_browser_sandbox_1.getSyntheticNodeWindow(state, selection[1]) && aerial_browser_sandbox_1.getSyntheticNodeWindow(state, selection[1]).$id : null;
            if (windowId && !workspace.stage.fullScreen) {
                var window_2 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    smooth: true,
                    fullScreen: {
                        windowId: windowId,
                        originalTranslate: workspace.stage.translate,
                        originalWindowBounds: window_2.bounds
                    },
                    translate: {
                        zoom: 1,
                        left: -window_2.bounds.left,
                        top: -window_2.bounds.top
                    }
                });
                return state;
            }
            else if (workspace.stage.fullScreen) {
                return unfullscreen(state);
            }
            else {
                return state;
            }
        }
        case actions_1.CANVAS_MOTION_RESTED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                smooth: false
            });
        }
        case actions_1.TOGGLE_TEXT_EDITOR_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showTextEditor: !workspace.stage.showTextEditor
            });
        }
        case actions_1.TOGGLE_RIGHT_GUTTER_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showRightGutter: !workspace.stage.showRightGutter
            });
        }
    }
    return state;
};
var dndReducer = function (state, event) {
    switch (event.type) {
        case actions_1.DND_STARTED: {
            var ref = event.ref;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                draggingRefs: [ref]
            });
        }
        case actions_1.DND_HANDLED: {
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                draggingRefs: []
            });
        }
    }
    return state;
};
var stageReducer = function (state, event) {
    switch (event.type) {
        case actions_1.VISUAL_EDITOR_WHEEL: {
            var _a = event, workspaceId = _a.workspaceId, metaKey = _a.metaKey, ctrlKey = _a.ctrlKey, deltaX = _a.deltaX, deltaY = _a.deltaY, canvasHeight = _a.canvasHeight, canvasWidth = _a.canvasWidth;
            var workspace = state_1.getWorkspaceById(state, workspaceId);
            if (workspace.stage.fullScreen) {
                return state;
            }
            var translate = state_1.getStageTranslate(workspace.stage);
            if (metaKey || ctrlKey) {
                translate = aerial_common2_1.centerTransformZoom(translate, aerial_common2_1.boundsFromRect({
                    width: canvasWidth,
                    height: canvasHeight
                }), lodash_1.clamp(translate.zoom + translate.zoom * deltaY / ZOOM_SENSITIVITY, MIN_ZOOM, MAX_ZOOM), workspace.stage.mousePosition);
            }
            else {
                translate = __assign({}, translate, { left: translate.left - deltaX, top: translate.top - deltaY });
            }
            return state_1.updateWorkspaceStage(state, workspace.$id, { smooth: false, translate: translate });
        }
        case actions_1.TOGGLE_TOOLS_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showTools: workspace.stage.showTools == null ? false : !workspace.stage.showTools
            });
        }
        case actions_1.STAGE_TOOL_EDIT_TEXT_KEY_DOWN: {
            var _b = event, sourceEvent = _b.sourceEvent, nodeId = _b.nodeId;
            if (sourceEvent.key === "Escape") {
                var workspace = state_1.getSyntheticNodeWorkspace(state, nodeId);
                state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(aerial_browser_sandbox_1.getSyntheticNodeById(state, nodeId)));
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
            }
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_MOVED:
        case actions_1.RESIZER_MOVED: {
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: true
            });
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_STOPPED_MOVING:
        case actions_1.RESIZER_STOPPED_MOVING: {
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: false
            });
            return state;
        }
        case actions_1.WINDOW_FOCUSED: {
            var windowId = event.windowId;
            var window_3 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            return selectAndCenterSyntheticWindow(state, window_3);
        }
        case aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED: {
            var _c = event, instance = _c.instance, isNew = _c.isNew;
            // if a window instance exists in the store, then it's already visible on stage -- could
            // have been loaded from a saved state.
            if (!isNew) {
                return state;
            }
            return selectAndCenterSyntheticWindow(state, instance.struct);
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_LEAVE: {
            var sourceEvent = event.sourceEvent;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_ENTER: {
            var _d = event, windowId = _d.windowId, ruleId = _d.ruleId;
            var window_4 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var selectorText = aerial_browser_sandbox_1.getSyntheticWindowChild(window_4, ruleId).selectorText;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: aerial_browser_sandbox_1.getMatchingElements(window_4, selectorText).map(function (element) { return [
                    element.$type,
                    element.$id
                ]; })
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_LEAVE: {
            var _e = event, windowId = _e.windowId, ruleId = _e.ruleId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.BREADCRUMB_ITEM_CLICKED: {
            var _f = event, windowId = _f.windowId, nodeId = _f.nodeId;
            var window_5 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var browser = state_1.getSyntheticWindowBrowser(state, window_5.$id);
            var node = aerial_browser_sandbox_1.getSyntheticNodeById(browser, nodeId);
            var workspace = state_1.getSyntheticWindowWorkspace(state, window_5.$id);
            return state_1.setWorkspaceSelection(state, workspace.$id, [node.$type, node.$id]);
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_ENTER: {
            var _g = event, windowId = _g.windowId, nodeId = _g.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: [[aerial_browser_sandbox_1.SYNTHETIC_ELEMENT, nodeId]]
            });
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_LEAVE: {
            var _h = event, windowId = _h.windowId, nodeId = _h.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.EMPTY_WINDOWS_URL_ADDED: {
            var workspaceId = state.selectedWorkspaceId;
            return centerStage(state, workspaceId, {
                left: 0,
                top: 0,
                right: aerial_browser_sandbox_1.DEFAULT_WINDOW_WIDTH,
                bottom: aerial_browser_sandbox_1.DEFAULT_WINDOW_HEIGHT
            }, false, true);
        }
        case actions_1.STAGE_MOUNTED:
            {
                var element = event.element;
                var _j = element.getBoundingClientRect() || {}, _k = _j.width, width = _k === void 0 ? 400 : _k, _l = _j.height, height = _l === void 0 ? 300 : _l;
                var workspaceId = state.selectedWorkspaceId;
                var workspace = state_1.getSelectedWorkspace(state);
                state = state_1.updateWorkspaceStage(state, workspaceId, { container: element });
                // do not center if in full screen mode
                if (workspace.stage.fullScreen) {
                    return state;
                }
                return centerSelectedWorkspace(state);
            }
            ;
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START: {
            var windowId = event.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: true });
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END: {
            var windowId = event.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: false });
        }
        case actions_1.STAGE_MOUSE_MOVED:
            {
                var _m = event.sourceEvent, pageX = _m.pageX, pageY = _m.pageY;
                state = state_1.updateWorkspaceStage(state, state.selectedWorkspaceId, {
                    mousePosition: {
                        left: pageX,
                        top: pageY
                    }
                });
                var workspace = state_1.getSelectedWorkspace(state);
                // TODO - in the future, we'll probably want to be able to highlight hovered nodes as the user is moving an element around to indicate where
                // they can drop the element. 
                var targetRef = workspace.stage.movingOrResizing ? null : state_1.getStageToolMouseNodeTargetReference(state, event);
                state = state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                    hoveringRefs: targetRef ? [targetRef] : []
                });
                return state;
            }
            ;
        case actions_1.STAGE_MOUSE_CLICKED: {
            var sourceEvent = event.sourceEvent;
            if (/textarea|input/i.test(sourceEvent.target.nodeName)) {
                return state;
            }
            // alt key opens up a new link
            var altKey = sourceEvent.altKey;
            var workspace = state_1.getSelectedWorkspace(state);
            state = updateWorkspaceStageSmoothing(state, workspace);
            // do not allow selection while window is panning (scrolling)
            if (workspace.stage.panning || workspace.stage.movingOrResizing)
                return state;
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef) {
                return state;
            }
            if (!altKey) {
                state = handleWindowSelectionFromAction(state, targetRef, event);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
                return state;
            }
            return state;
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED: {
            var _o = event, sourceEvent = _o.sourceEvent, windowId = _o.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef)
                return state;
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, targetRef);
            return state;
        }
        case actions_1.WINDOW_SELECTION_SHIFTED: {
            var windowId = event.windowId;
            return selectAndCenterSyntheticWindow(state, aerial_browser_sandbox_1.getSyntheticWindow(state, windowId));
        }
        case actions_1.SELECTOR_DOUBLE_CLICKED: {
            var _p = event, sourceEvent = _p.sourceEvent, item = _p.item;
            var workspace = state_1.getSyntheticNodeWorkspace(state, item.$id);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(item));
            return state;
        }
        case actions_1.WORKSPACE_DELETION_SELECTED: {
            var workspaceId = event.workspaceId;
            state = state_1.clearWorkspaceSelection(state, workspaceId);
            return state;
        }
        case actions_1.STAGE_TOOL_WINDOW_TITLE_CLICKED: {
            state = updateWorkspaceStageSmoothing(state);
            return handleWindowSelectionFromAction(state, aerial_common2_1.getStructReference(aerial_browser_sandbox_1.getSyntheticWindow(state, event.windowId)), event);
        }
        case actions_1.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.clearWorkspaceSelection(state, workspace.$id);
        }
    }
    return state;
};
var unfullscreen = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var originalWindowBounds = workspace.stage.fullScreen.originalWindowBounds;
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: true,
        fullScreen: undefined
    });
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        translate: workspace.stage.fullScreen.originalTranslate,
        smooth: true
    });
    return state;
};
var selectAndCenterSyntheticWindow = function (state, window) {
    var workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.container)
        return state;
    var _a = workspace.stage.container.getBoundingClientRect(), width = _a.width, height = _a.height;
    state = centerStage(state, state.selectedWorkspaceId, window.bounds, true, workspace.stage.fullScreen ? workspace.stage.fullScreen.originalTranslate.zoom : true);
    // update translate
    workspace = state_1.getSelectedWorkspace(state);
    if (workspace.stage.fullScreen) {
        state = state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: true,
            fullScreen: {
                windowId: window.$id,
                originalTranslate: workspace.stage.translate,
                originalWindowBounds: window.bounds
            },
            translate: {
                zoom: 1,
                left: -window.bounds.left,
                top: -window.bounds.top
            }
        });
    }
    state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(window));
    return state;
};
var centerSelectedWorkspace = function (state, smooth) {
    if (smooth === void 0) { smooth = false; }
    var workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
    var innerBounds = state_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId));
    // no windows loaded
    if (innerBounds.left + innerBounds.right + innerBounds.top + innerBounds.bottom === 0) {
        console.warn("Stage mounted before windows have been loaded");
        return state;
    }
    return centerStage(state, workspace.$id, innerBounds, smooth, true);
};
var centerStage = function (state, workspaceId, innerBounds, smooth, zoomOrZoomToFit) {
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var _a = workspace.stage, container = _a.container, translate = _a.translate;
    if (!container)
        return state;
    var _b = container.getBoundingClientRect(), width = _b.width, height = _b.height;
    var innerSize = aerial_common2_1.getBoundsSize(innerBounds);
    var centered = {
        left: -innerBounds.left + width / 2 - (innerSize.width) / 2,
        top: -innerBounds.top + height / 2 - (innerSize.height) / 2,
    };
    var scale = typeof zoomOrZoomToFit === "boolean" ? Math.min((width - INITIAL_ZOOM_PADDING) / innerSize.width, (height - INITIAL_ZOOM_PADDING) / innerSize.height) : typeof zoomOrZoomToFit === "number" ? zoomOrZoomToFit : translate.zoom;
    return state_1.updateWorkspaceStage(state, workspaceId, {
        smooth: smooth,
        translate: aerial_common2_1.centerTransformZoom(__assign({}, centered, { zoom: 1 }), { left: 0, top: 0, right: width, bottom: height }, scale)
    });
};
var handleWindowSelectionFromAction = function (state, ref, event) {
    var sourceEvent = event.sourceEvent;
    var workspace = state_1.getSelectedWorkspace(state);
    // TODO - may want to allow multi selection once it's confirmed to work on
    // all scenarios.
    // meta key + no items selected should display source of 
    // if (sourceEvent.metaKey && workspace.selectionRefs.length) {
    //   return toggleWorkspaceSelection(state, workspace.$id, ref);
    // } else if(!sourceEvent.metaKey) {
    //   return setWorkspaceSelection(state, workspace.$id, ref);
    // }
    return state_1.setWorkspaceSelection(state, workspace.$id, ref);
};
var normalizeZoom = function (zoom) {
    return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
};
var windowPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.WINDOW_PANE_ROW_CLICKED: {
            var windowId = event.windowId;
            var window_6 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            return selectAndCenterSyntheticWindow(state, window_6);
        }
    }
    return state;
};
var updateWorkspaceStageSmoothing = function (state, workspace) {
    if (!workspace)
        workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.fullScreen && workspace.stage.smooth) {
        return state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: false
        });
    }
    return state;
};
var setStageZoom = function (state, workspaceId, zoom, smooth) {
    if (smooth === void 0) { smooth = true; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    return state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: smooth,
        translate: aerial_common2_1.centerTransformZoom(workspace.stage.translate, workspace.stage.container.getBoundingClientRect(), lodash_1.clamp(zoom, MIN_ZOOM, MAX_ZOOM), workspace.stage.mousePosition)
    });
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/reducers/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/reducers/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/api.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var io = __webpack_require__("./node_modules/socket.io-client/lib/index.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var PERSIST_DELAY_TIMEOUT = 1000;
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var SAVE_KEY = "app-state";
function apiSaga() {
    var apiHost;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                apiHost = (_a.sent()).apiHost;
                return [4 /*yield*/, effects_1.fork(getComponents)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(syncWorkspaceState)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(aerial_common2_1.createSocketIOSaga(io(apiHost)))];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePingPong)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.apiSaga = apiSaga;
function getComponents() {
    var apiHost, response, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.select()];
            case 1:
                apiHost = (_a.sent()).apiHost;
                return [4 /*yield*/, effects_1.call(fetch, apiHost + "/components")];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, effects_1.call(response.json.bind(response))];
            case 3:
                json = _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.apiComponentsLoaded(json))];
            case 4:
                _a.sent();
                // just refresh whenever a file has changed
                return [4 /*yield*/, effects_1.take([actions_1.FILE_CONTENT_CHANGED, actions_1.FILE_REMOVED, actions_1.COMPONENT_SCREENSHOT_SAVED])];
            case 5:
                // just refresh whenever a file has changed
                _a.sent();
                return [3 /*break*/, 0];
            case 6: return [2 /*return*/];
        }
    });
}
function syncWorkspaceState() {
    var state, apiHost, pojoState, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(function () {
                    var prevState, state_2, pojoState, apiHost_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.TRIED_LOADING_APP_STATE)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (false) return [3 /*break*/, 7];
                                return [4 /*yield*/, effects_1.take()];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, effects_1.call(redux_saga_1.delay, PERSIST_DELAY_TIMEOUT)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, effects_1.select()];
                            case 5:
                                state_2 = _a.sent();
                                if (prevState === state_2) {
                                    return [3 /*break*/, 2];
                                }
                                prevState = state_2;
                                pojoState = state_1.serializeApplicationState(state_2);
                                apiHost_1 = state_2.apiHost;
                                return [4 /*yield*/, effects_1.call(fetch, apiHost_1 + "/storage/" + state_2.storageNamespace + SAVE_KEY, {
                                        method: "POST",
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(pojoState)
                                    })];
                            case 6:
                                _a.sent();
                                return [3 /*break*/, 2];
                            case 7: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 3:
                apiHost = (_a.sent()).apiHost;
                _a.label = 4;
            case 4:
                _a.trys.push([4, 8, , 9]);
                return [4 /*yield*/, effects_1.call(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(apiHost + "/storage/" + state.storageNamespace + SAVE_KEY)];
                                    case 1:
                                        response = _a.sent();
                                        return [4 /*yield*/, response.json()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        });
                    })];
            case 5:
                pojoState = _a.sent();
                if (!pojoState) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.put(actions_1.loadedSavedState(pojoState))];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                e_1 = _a.sent();
                console.warn(e_1);
                return [3 /*break*/, 9];
            case 9: return [4 /*yield*/, effects_1.put(actions_1.triedLoadedSavedState())];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handlePingPong() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take("$$TANDEM_FE_PING")];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.put({ type: "$$TANDEM_FE_PONG", $public: true })];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/api.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/api.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var shortcuts_1 = __webpack_require__("./src/front-end/sagas/shortcuts.ts");
var workspace_1 = __webpack_require__("./src/front-end/sagas/workspace.ts");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var synthetic_browser_1 = __webpack_require__("./src/front-end/sagas/synthetic-browser.ts");
var api_1 = __webpack_require__("./src/front-end/sagas/api.ts");
function mainSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(aerial_browser_sandbox_1.syntheticBrowserSaga)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(workspace_1.mainWorkspaceSaga)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(shortcuts_1.shortcutsService)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(synthetic_browser_1.frontEndSyntheticBrowserSaga)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(api_1.apiSaga)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainSaga = mainSaga;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/shortcuts.ts":
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
var Mousetrap = __webpack_require__("./node_modules/mousetrap/mousetrap.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
function shortcutsService() {
    var state, mt, chan, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                mt = Mousetrap();
                chan = redux_saga_1.eventChannel(function (emit) {
                    var _loop_1 = function (keyCombo, action, options) {
                        mt.bind(keyCombo, function (event) {
                            event.preventDefault();
                            emit(__assign({}, action));
                        }, options.keyup ? "keyup" : "keydown");
                    };
                    for (var _i = 0, _a = state.shortcuts; _i < _a.length; _i++) {
                        var _b = _a[_i], keyCombo = _b.keyCombo, action = _b.action, options = _b.options;
                        _loop_1(keyCombo, action, options);
                    }
                    return function () {
                    };
                });
                _b.label = 2;
            case 2:
                if (false) return [3 /*break*/, 5];
                _a = effects_1.put;
                return [4 /*yield*/, effects_1.take(chan)];
            case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 4:
                _b.sent();
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}
exports.shortcutsService = shortcutsService;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/shortcuts.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/shortcuts.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/synthetic-browser.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var mesh_1 = __webpack_require__("./node_modules/mesh/index.js");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
function frontEndSyntheticBrowserSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleTextEditBlur)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWindowMousePanned)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFullScreenWindow)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleScrollInFullScreenMode)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleTextEditorEscaped)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleEmptyWindowsUrlAdded)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleLoadedSavedState)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCSSDeclarationChanges)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWatchWindowResource)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFileChanged)];
            case 10:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowsRequested)];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.frontEndSyntheticBrowserSaga = frontEndSyntheticBrowserSaga;
function handleEmptyWindowsUrlAdded() {
    var url, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.EMPTY_WINDOWS_URL_ADDED)];
            case 1:
                url = (_a.sent()).url;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: url }, state_1.getSelectedWorkspace(state).browserId))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleWatchWindowResource() {
    var watchingUris, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                watchingUris = [];
                _loop_1 = function () {
                    var action, state, allUris, updates;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take([
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_CHANGED,
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_LOADED,
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_CLOSED,
                                    aerial_common2_1.REMOVED
                                ])];
                            case 1:
                                action = _a.sent();
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _a.sent();
                                allUris = lodash_1.uniq(state.browserStore.records.reduce(function (a, b) {
                                    return a.concat(b.windows.reduce(function (a2, b2) {
                                        return a2.concat(b2.externalResourceUris);
                                    }, []));
                                }, []));
                                updates = source_mutation_1.diffArray(allUris, watchingUris, function (a, b) { return a === b ? 0 : -1; }).mutations.filter(function (mutation) { return mutation.type === source_mutation_1.ARRAY_UPDATE; });
                                // no changes, so just continue
                                if (updates.length === allUris.length) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.call(utils_1.apiWatchUris, watchingUris = allUris, state)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleTextEditorEscaped() {
    var _a, sourceEvent, nodeId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_EDIT_TEXT_KEY_DOWN)];
            case 1:
                _a = (_b.sent()), sourceEvent = _a.sourceEvent, nodeId = _a.nodeId;
                if (sourceEvent.key !== "Escape") {
                    return [3 /*break*/, 0];
                }
                return [4 /*yield*/, effects_1.call(applyTextEditChanges, sourceEvent, nodeId)];
            case 2:
                _b.sent();
                // blur does _not_ get fired on escape.
                return [4 /*yield*/, effects_1.call(nodeValueStoppedEditing, nodeId)];
            case 3:
                // blur does _not_ get fired on escape.
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function applyTextEditChanges(sourceEvent, nodeId) {
    var state, window, text, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, nodeId);
                text = String(sourceEvent.target.textContent || "").trim();
                workspace = state_1.getSyntheticNodeWorkspace(state, nodeId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticNodeTextContentChanged(window.$id, nodeId, text))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleTextEditBlur() {
    var _a, sourceEvent, nodeId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_EDIT_TEXT_BLUR)];
            case 1:
                _a = (_b.sent()), sourceEvent = _a.sourceEvent, nodeId = _a.nodeId;
                return [4 /*yield*/, effects_1.call(applyTextEditChanges, sourceEvent, nodeId)];
            case 2:
                _b.sent();
                return [4 /*yield*/, effects_1.call(nodeValueStoppedEditing, nodeId)];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function nodeValueStoppedEditing(nodeId) {
    var state, window;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, nodeId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticNodeValueStoppedEditing(window.$id, nodeId))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var MOMENTUM_THRESHOLD = 100;
var DEFAULT_MOMENTUM_DAMP = 0.1;
var MOMENTUM_DELAY = 50;
var VELOCITY_MULTIPLIER = 10;
function handleScrollInFullScreenMode() {
    var _a, deltaX, deltaY, state, workspace, window_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.VISUAL_EDITOR_WHEEL)];
            case 1:
                _a = (_b.sent()), deltaX = _a.deltaX, deltaY = _a.deltaY;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_b.sent());
                workspace = state_1.getSelectedWorkspace(state);
                if (!workspace.stage.fullScreen) {
                    return [3 /*break*/, 0];
                }
                window_1 = state_1.getSyntheticWindow(state, workspace.stage.fullScreen.windowId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticWindowScroll(window_1.$id, aerial_common2_1.shiftPoint(window_1.scrollPosition || { left: 0, top: 0 }, {
                        left: 0,
                        top: deltaY
                    })))];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleFileChanged() {
    var _loop_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function () {
                    var _a, filePath, publicPath, state, workspace, windows, _i, windows_1, window_2, shouldReload;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take([actions_1.FILE_CONTENT_CHANGED, actions_1.FILE_REMOVED])];
                            case 1:
                                _a = _b.sent(), filePath = _a.filePath, publicPath = _a.publicPath;
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                workspace = state_1.getSelectedWorkspace(state);
                                windows = state_1.getSyntheticBrowser(state, workspace.browserId).windows;
                                for (_i = 0, windows_1 = windows; _i < windows_1.length; _i++) {
                                    window_2 = windows_1[_i];
                                    shouldReload = window_2.externalResourceUris.find(function (uri) { return ((publicPath && uri.indexOf(publicPath) !== -1) || uri.indexOf(filePath) !== -1); });
                                    if (shouldReload) {
                                        window_2.instance.location.reload();
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_2()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleOpenExternalWindowsRequested() {
    var uris, state, workspace, browser, openedNewWindow, lastExistingWindow, _loop_3, _i, uris_1, uri;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOWS_REQUESTED)];
            case 1:
                uris = (_a.sent()).uris;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                browser = state_1.getSyntheticBrowser(state, workspace.browserId);
                openedNewWindow = false;
                lastExistingWindow = void 0;
                _loop_3 = function (uri) {
                    var existingWindow;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                existingWindow = browser.windows.find(function (window) { return window.location === uri; });
                                if (existingWindow) {
                                    lastExistingWindow = existingWindow;
                                    return [2 /*return*/, "continue"];
                                }
                                openedNewWindow = true;
                                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({
                                        location: uri
                                    }, browser.$id))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, uris_1 = uris;
                _a.label = 3;
            case 3:
                if (!(_i < uris_1.length)) return [3 /*break*/, 6];
                uri = uris_1[_i];
                return [5 /*yield**/, _loop_3(uri)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (!(!openedNewWindow && lastExistingWindow)) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.put(actions_1.windowFocused(lastExistingWindow.$id))];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
function handleLoadedSavedState() {
    var state, workspace, browser, _i, _a, window_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.LOADED_SAVED_STATE)];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                browser = state_1.getSyntheticBrowser(state, workspace.browserId);
                _i = 0, _a = browser.windows;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                window_3 = _a[_i];
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest(window_3, browser.$id))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function persistDeclarationChange(declaration, name, value) {
    var owner, element, mutation, mutation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                owner = declaration.$owner;
                if (!(owner.nodeType === aerial_browser_sandbox_1.SEnvNodeTypes.ELEMENT)) return [3 /*break*/, 2];
                element = owner;
                mutation = aerial_browser_sandbox_1.createSetElementAttributeMutation(element, "style", element.getAttribute("style"));
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.deferApplyFileMutationsRequest(mutation))];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                mutation = aerial_browser_sandbox_1.cssStyleDeclarationSetProperty(declaration, name, value);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.deferApplyFileMutationsRequest(mutation))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}
// TODO - move this to synthetic browser
function handleCSSDeclarationChanges() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(function handleNameChanges() {
                    var _a, value, windowId, declarationId, state, window_4;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (false) return [3 /*break*/, 3];
                                return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_NAME_CHANGED)];
                            case 1:
                                _a = _b.sent(), value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                window_4 = state_1.getSyntheticWindow(state, windowId);
                                return [3 /*break*/, 0];
                            case 3: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleValueChanges() {
                        var _a, name_1, value, windowId, declarationId, state, window_5, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_VALUE_CHANGED)];
                                case 1:
                                    _a = _b.sent(), name_1 = _a.name, value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_5 = state_1.getSyntheticWindow(state, windowId);
                                    declaration = aerial_browser_sandbox_1.getSyntheticWindowChild(window_5, declarationId).instance;
                                    declaration;
                                    // null or ""
                                    if (!value) {
                                        declaration.removeProperty(name_1);
                                    }
                                    else {
                                        declaration.setProperty(name_1, value);
                                    }
                                    return [4 /*yield*/, effects_1.call(persistDeclarationChange, declaration, name_1, value)];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleNewDeclaration() {
                        var _a, name_2, value, windowId, declarationId, state, window_6, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_CREATED)];
                                case 1:
                                    _a = _b.sent(), name_2 = _a.name, value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_6 = state_1.getSyntheticWindow(state, windowId);
                                    declaration = aerial_browser_sandbox_1.getSyntheticWindowChild(window_6, declarationId).instance;
                                    declaration.setProperty(name_2, value);
                                    return [4 /*yield*/, effects_1.call(persistDeclarationChange, declaration, name_2, value)];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
// fugly quick momentum scrolling implementation
function handleWindowMousePanned() {
    function scrollDelta(windowId, deltaY) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticWindowScroll(windowId, aerial_common2_1.shiftPoint(panStartScrollPosition, {
                        left: 0,
                        top: -deltaY
                    })))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var deltaTop, deltaLeft, currentWindowId, panStartScrollPosition, lastPaneEvent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deltaTop = 0;
                deltaLeft = 0;
                return [4 /*yield*/, effects_1.fork(function () {
                        var windowId, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 3];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START)];
                                case 1:
                                    windowId = (_b.sent()).windowId;
                                    _a = state_1.getSyntheticWindow;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    panStartScrollPosition = _a.apply(void 0, [_b.sent(), windowId]).scrollPosition || { left: 0, top: 0 };
                                    return [3 /*break*/, 0];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var event_1, windowId, deltaY, center, newVelocityY, zoom, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PANNING)];
                                case 1:
                                    event_1 = lastPaneEvent = (_c.sent());
                                    windowId = event_1.windowId, deltaY = event_1.deltaY, center = event_1.center, newVelocityY = event_1.velocityY;
                                    _a = state_1.getStageTranslate;
                                    _b = state_1.getSelectedWorkspace;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                    return [4 /*yield*/, scrollDelta(windowId, deltaY / zoom)];
                                case 3:
                                    _c.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var _loop_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_4 = function () {
                                        var windowId, deltaY, velocityY, zoom, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END)];
                                                case 1:
                                                    _c.sent();
                                                    windowId = lastPaneEvent.windowId, deltaY = lastPaneEvent.deltaY, velocityY = lastPaneEvent.velocityY;
                                                    _a = state_1.getStageTranslate;
                                                    _b = state_1.getSelectedWorkspace;
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 2:
                                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                                    return [4 /*yield*/, spring(deltaY, velocityY * VELOCITY_MULTIPLIER, function (deltaY) {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, scrollDelta(windowId, deltaY / zoom)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        })];
                                                case 3:
                                                    _c.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a.label = 1;
                                case 1:
                                    if (false) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_4()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var WINDOW_SYNC_MS = 1000 / 30;
function handleFullScreenWindow() {
    var currentFullScreenWindowId, previousWindowBounds, waitForFullScreenMode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                waitForFullScreenMode = mesh_1.createDeferredPromise();
                return [4 /*yield*/, effects_1.fork(function () {
                        var state, workspace, windowId, window_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 5];
                                    // TODO - possibly change to WINDOW_SCOPE_CHANGED
                                    return [4 /*yield*/, effects_1.take([actions_1.FULL_SCREEN_SHORTCUT_PRESSED, aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED, actions_1.WINDOW_SELECTION_SHIFTED, actions_1.FULL_SCREEN_TARGET_DELETED])];
                                case 1:
                                    // TODO - possibly change to WINDOW_SCOPE_CHANGED
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _a.sent();
                                    workspace = state_1.getSelectedWorkspace(state);
                                    windowId = workspace.stage.fullScreen && workspace.stage.fullScreen.windowId;
                                    if (!currentFullScreenWindowId) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(currentFullScreenWindowId, aerial_browser_sandbox_1.SYNTHETIC_WINDOW, previousWindowBounds))];
                                case 3:
                                    _a.sent();
                                    previousWindowBounds = undefined;
                                    currentFullScreenWindowId = undefined;
                                    // TODO - revert window size
                                    waitForFullScreenMode = mesh_1.createDeferredPromise();
                                    _a.label = 4;
                                case 4:
                                    if (windowId) {
                                        window_7 = state_1.getSyntheticWindow(state, windowId);
                                        previousWindowBounds = workspace.stage.fullScreen.originalWindowBounds;
                                        waitForFullScreenMode.resolve(true);
                                    }
                                    currentFullScreenWindowId = windowId;
                                    return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function syncFullScreenWindowSize() {
                        var state, workspace, container, rect, window_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 5];
                                    return [4 /*yield*/, effects_1.call(function () { return waitForFullScreenMode.promise; })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _a.sent();
                                    workspace = state_1.getSelectedWorkspace(state);
                                    container = workspace.stage.container;
                                    rect = container.getBoundingClientRect();
                                    window_8 = state_1.getSyntheticWindow(state, currentFullScreenWindowId);
                                    return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(currentFullScreenWindowId, aerial_browser_sandbox_1.SYNTHETIC_WINDOW, {
                                            left: window_8.bounds.left,
                                            top: window_8.bounds.top,
                                            right: window_8.bounds.left + rect.width,
                                            bottom: window_8.bounds.top + rect.height,
                                        }))];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.call(function () { return new Promise(function (resolve) { return setTimeout(resolve, WINDOW_SYNC_MS); }); })];
                                case 4:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function spring(start, velocityY, iterate, damp, complete) {
    if (damp === void 0) { damp = DEFAULT_MOMENTUM_DAMP; }
    if (complete === void 0) { complete = function () { }; }
    function tick() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i += damp;
                    currentValue += velocityY / (i / 1);
                    if (i >= 1) {
                        return [2 /*return*/, complete()];
                    }
                    return [4 /*yield*/, iterate(currentValue)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, effects_1.call(redux_saga_1.delay, MOMENTUM_DELAY)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tick()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var i, v, currentValue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                v = velocityY;
                currentValue = start;
                return [4 /*yield*/, tick()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/workspace.ts":
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
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var WINDOW_PADDING = 10;
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
// import { deleteShortcutPressed, , apiComponentsLoaded } from "front-end";
function mainWorkspaceSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(openDefaultWindow)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleAltClickElement)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickElement)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickComponentCell)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDeleteKeyPressed)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNextWindowPressed)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePrevWindowPressed)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionMoved)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionStoppedMoving)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyDown)];
            case 10:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyUp)];
            case 11:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionResized)];
            case 12:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNewLocationPrompt)];
            case 13:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenNewWindowShortcut)];
            case 14:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCloneSelectedWindowShortcut)];
            case 15:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSourceClicked)];
            case 16:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowButtonClicked)];
            case 17:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDNDEnded)];
            case 18:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleComponentsPaneEvents)];
            case 19:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainWorkspaceSaga = mainWorkspaceSaga;
function openDefaultWindow() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, aerial_common2_1.watch(function (state) { return state.selectedWorkspaceId; }, function (selectedWorkspaceId, state) {
                    var workspace;
                    return __generator(this, function (_a) {
                        if (!selectedWorkspaceId)
                            return [2 /*return*/, true];
                        workspace = state_1.getSelectedWorkspace(state);
                        // yield put(openSyntheticWindowRequest(`http://localhost:8083/`, workspace.browserId));
                        // yield put(openSyntheticWindowRequest("http://browsertap.com/", workspace.browserId));
                        // yield put(openSyntheticWindowRequest("https://wordpress.com/", workspace.browserId));
                        // yield put(openSyntheticWindowRequest("http://localhost:8080/index.html", workspace.browserId));
                        return [2 /*return*/, true];
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleOpenExternalWindowButtonClicked() {
    var windowId, syntheticWindow, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED)];
            case 1:
                windowId = (_b.sent()).windowId;
                _a = aerial_browser_sandbox_1.getSyntheticWindow;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                syntheticWindow = _a.apply(void 0, [_b.sent(), windowId]);
                window.open(syntheticWindow.location, "_blank");
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleAltClickElement() {
    var event_1, state, targetRef, workspace, node, element, href, window_1, browserBounds, workspace_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.altKey; })];
            case 1:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_1);
                workspace = state_1.getSelectedWorkspace(state);
                if (!targetRef)
                    return [3 /*break*/, 0];
                node = aerial_browser_sandbox_1.getSyntheticNodeById(state, targetRef[1]);
                if (!(node.nodeType === aerial_browser_sandbox_1.SEnvNodeTypes.ELEMENT)) return [3 /*break*/, 4];
                element = node;
                if (!(element.nodeName === "A")) return [3 /*break*/, 4];
                href = element.attributes.find(function (a) { return a.name === "href"; });
                if (!href) return [3 /*break*/, 4];
                window_1 = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, node.$id);
                browserBounds = aerial_browser_sandbox_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window_1.$id));
                workspace_1 = state_1.getSyntheticWindowWorkspace(state, window_1.$id);
                return [4 /*yield*/, openNewWindow(state, href.value, window_1, workspace_1)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleMetaClickElement() {
    var event_2, state, targetRef, workspace, node;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.metaKey; })];
            case 1:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_2);
                workspace = state_1.getSelectedWorkspace(state);
                // not items should be selected for meta clicks
                // if (workspace.selectionRefs.length) {
                //   continue;
                // }
                if (!targetRef)
                    return [3 /*break*/, 0];
                node = aerial_browser_sandbox_1.getSyntheticNodeById(state, targetRef[1]);
                if (!(node.source && node.source.uri)) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, node.source, state)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                if (!node.source) {
                    console.warn("source URI does not exist on selected node.");
                }
                _a.label = 5;
            case 5: return [3 /*break*/, 0];
            case 6: return [2 /*return*/];
        }
    });
}
function handleMetaClickComponentCell() {
    var _a, componentId, sourceEvent, state, workspace, component;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.COMPONENTS_PANE_COMPONENT_CLICKED; })];
            case 1:
                _a = _b.sent(), componentId = _a.componentId, sourceEvent = _a.sourceEvent;
                if (!sourceEvent.metaKey)
                    return [3 /*break*/, 0];
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                component = state_1.getAvailableComponent(componentId, workspace);
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, __assign({ uri: component.filePath }, component.location), state)];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function openNewWindow(state, href, origin, workspace) {
    var uri, windowBounds, browserBounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uri = aerial_browser_sandbox_1.getUri(href, origin.location);
                windowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : origin.bounds;
                browserBounds = aerial_browser_sandbox_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, origin.$id));
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri, bounds: {
                            left: Math.max(browserBounds.right, windowBounds.right) + WINDOW_PADDING,
                            top: 0,
                            right: undefined,
                            bottom: undefined
                        } }, workspace.browserId))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleDeleteKeyPressed() {
    var action, state, sourceEvent, workspace, _i, _a, _b, type, id;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.DELETE_SHORCUT_PRESSED)];
            case 1:
                action = (_c.sent());
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                sourceEvent = event.sourceEvent;
                workspace = state_1.getSelectedWorkspace(state);
                _i = 0, _a = workspace.selectionRefs;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                _b = _a[_i], type = _b[0], id = _b[1];
                return [4 /*yield*/, effects_1.put(aerial_common2_1.removed(id, type))];
            case 4:
                _c.sent();
                if (!(workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === id)) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.put(actions_1.fullScreenTargetDeleted())];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, effects_1.put(actions_1.workspaceSelectionDeleted(workspace.$id))];
            case 8:
                _c.sent();
                return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
function handleSelectionMoved() {
    var _a, point, workspaceId, newPoint, state, workspace, translate, selectionBounds, _i, _b, item, itemBounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_MOVED)];
            case 1:
                _a = (_c.sent()), point = _a.point, workspaceId = _a.workspaceId, newPoint = _a.point;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_c.sent());
                workspace = state_1.getWorkspaceById(state, workspaceId);
                translate = state_1.getStageTranslate(workspace.stage);
                selectionBounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                itemBounds = state_1.getSyntheticBrowserItemBounds(state, item);
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === item.$id) {
                    return [3 /*break*/, 5];
                }
                return [4 /*yield*/, effects_1.put(aerial_common2_1.moved(item.$id, item.$type, aerial_common2_1.scaleInnerBounds(itemBounds, selectionBounds, aerial_common2_1.moveBounds(selectionBounds, newPoint)), workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function handleDNDEnded() {
    var event_3, state, workspace, dropRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(actions_1.DND_ENDED)];
            case 1:
                event_3 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                dropRef = state_1.getStageToolMouseNodeTargetReference(state, event_3);
                if (!dropRef) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(handleDroppedOnElement, dropRef, event_3)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, effects_1.call(handleDroppedOnEmptySpace, event_3)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, effects_1.put(actions_1.dndHandled())];
            case 7:
                _a.sent();
                return [3 /*break*/, 0];
            case 8: return [2 /*return*/];
        }
    });
}
function handleDroppedOnElement(ref, event) {
    return __generator(this, function (_a) {
        console.log(ref, event);
        return [2 /*return*/];
    });
}
function handleDroppedOnEmptySpace(event) {
    var _a, pageX, pageY, state, uri, workspace, mousePosition;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY;
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                uri = utils_1.apiGetComponentPreviewURI(event.ref[1], state);
                workspace = state_1.getSelectedWorkspace(state);
                mousePosition = state_1.getScaledMouseStagePosition(state, event);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri, bounds: __assign({}, mousePosition, { right: undefined, bottom: undefined }) }, workspace.browserId))];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function handleSelectionResized() {
    var _a, workspaceId, anchor, originalBounds, newBounds, sourceEvent, state, workspace, currentBounds, keepAspectRatio, keepCenter, _i, _b, item, innerBounds, scaledBounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_PATH_MOUSE_MOVED)];
            case 1:
                _a = (_c.sent()), workspaceId = _a.workspaceId, anchor = _a.anchor, originalBounds = _a.originalBounds, newBounds = _a.newBounds, sourceEvent = _a.sourceEvent;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                workspace = state_1.getWorkspaceById(state, workspaceId);
                currentBounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                keepAspectRatio = sourceEvent.shiftKey;
                keepCenter = sourceEvent.altKey;
                if (keepCenter) {
                    // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
                }
                if (keepAspectRatio) {
                    newBounds = aerial_common2_1.keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
                }
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                innerBounds = state_1.getSyntheticBrowserItemBounds(state, item);
                scaledBounds = aerial_common2_1.scaleInnerBounds(currentBounds, currentBounds, newBounds);
                return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(item.$id, item.$type, aerial_common2_1.scaleInnerBounds(innerBounds, currentBounds, newBounds), workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function handleOpenNewWindowShortcut() {
    var uri, state, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_NEW_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                uri = prompt("URL");
                if (!uri)
                    return [3 /*break*/, 0];
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri }, workspace.browserId))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleCloneSelectedWindowShortcut() {
    var state, workspace, itemRef, window_2, originalWindowBounds, clonedWindow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.CLONE_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                itemRef = workspace.selectionRefs[0];
                if (!itemRef)
                    return [3 /*break*/, 0];
                window_2 = itemRef[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? aerial_browser_sandbox_1.getSyntheticWindow(state, itemRef[1]) : aerial_browser_sandbox_1.getSyntheticNodeWindow(state, itemRef[1]);
                originalWindowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : window_2.bounds;
                return [4 /*yield*/, aerial_common2_1.request(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: window_2.location, bounds: aerial_common2_1.moveBounds(originalWindowBounds, {
                            left: originalWindowBounds.left,
                            top: originalWindowBounds.bottom + WINDOW_PADDING
                        }) }, aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window_2.$id).$id))];
            case 3: return [4 /*yield*/, _a.sent()];
            case 4:
                clonedWindow = _a.sent();
                return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleNewLocationPrompt() {
    var _a, workspaceId, location_1, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.PROMPTED_NEW_WINDOW_URL)];
            case 1:
                _a = (_f.sent()), workspaceId = _a.workspaceId, location_1 = _a.location;
                _b = effects_1.put;
                _c = aerial_browser_sandbox_1.openSyntheticWindowRequest;
                _d = [{ location: location_1 }];
                _e = state_1.getWorkspaceById;
                return [4 /*yield*/, effects_1.select()];
            case 2: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.apply(void 0, [_f.sent(), workspaceId]).browserId]))])];
            case 3:
                _f.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleSelectionKeyDown() {
    var type, state, workspace, workspaceId, bounds, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 12];
                return [4 /*yield*/, effects_1.take([actions_1.LEFT_KEY_DOWN, actions_1.RIGHT_KEY_DOWN, actions_1.UP_KEY_DOWN, actions_1.DOWN_KEY_DOWN])];
            case 1:
                type = (_b.sent()).type;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                if (workspace.selectionRefs.length === 0)
                    return [3 /*break*/, 0];
                workspaceId = workspace.$id;
                bounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                _a = type;
                switch (_a) {
                    case actions_1.DOWN_KEY_DOWN: return [3 /*break*/, 3];
                    case actions_1.UP_KEY_DOWN: return [3 /*break*/, 5];
                    case actions_1.LEFT_KEY_DOWN: return [3 /*break*/, 7];
                    case actions_1.RIGHT_KEY_DOWN: return [3 /*break*/, 9];
                }
                return [3 /*break*/, 11];
            case 3: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left, top: bounds.top + 1 }))];
            case 4:
                _b.sent();
                return [3 /*break*/, 11];
            case 5: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left, top: bounds.top - 1 }))];
            case 6:
                _b.sent();
                return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left - 1, top: bounds.top }))];
            case 8:
                _b.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left + 1, top: bounds.top }))];
            case 10:
                _b.sent();
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 0];
            case 12: return [2 /*return*/];
        }
    });
}
function handleSelectionKeyUp() {
    var state, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take([actions_1.LEFT_KEY_UP, actions_1.RIGHT_KEY_UP, actions_1.UP_KEY_UP, actions_1.DOWN_KEY_UP])];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                return [4 /*yield*/, effects_1.put(actions_1.resizerStoppedMoving(workspace.$id, null))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleSourceClicked() {
    var _a, itemId, windowId, state, item;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.SOURCE_CLICKED)];
            case 1:
                _a = (_b.sent()), itemId = _a.itemId, windowId = _a.windowId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                item = aerial_browser_sandbox_1.getSyntheticNodeById(state, itemId);
                if (!(item.source && item.source.uri)) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, item.source, state)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleSelectionStoppedMoving() {
    var _a, point, workspaceId, state, workspace, _i, _b, item, bounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_STOPPED_MOVING)];
            case 1:
                _a = (_c.sent()), point = _a.point, workspaceId = _a.workspaceId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_c.sent());
                workspace = state_1.getWorkspaceById(state, workspaceId);
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === item.$id) {
                    return [3 /*break*/, 5];
                }
                bounds = state_1.getSyntheticBrowserItemBounds(state, item);
                return [4 /*yield*/, effects_1.put(aerial_common2_1.stoppedMoving(item.$id, item.$type, workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
// TODO - this would be great, but doesn't work for live editing. 
// function* syncWindowsWithAvailableComponents() {
//   while(true) {
//     yield take(API_COMPONENTS_LOADED);
//     const state: ApplicationState = yield select();
//     const workspace = getWorkspaceById(state, state.selectedWorkspaceId);
//     const availableComponentUris = workspace.availableComponents.map((component) => apiGetComponentPreviewURI(component.$id, state));
//     const browser = getSyntheticBrowser(state, workspace.browserId);
//     const windowUris = browser.windows.map((window) => window.location);
//     const deletes = diffArray(windowUris, availableComponentUris, (a, b) => a === b ? 0 : -1).mutations.filter(mutation => mutation.type === ARRAY_DELETE) as any as ArrayDeleteMutation<string>[];
//     for (const {index} of deletes) {
//       const window = browser.windows[index];
//       window.instance.close();
//     }
//   }
// }
function handleNextWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.NEXT_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedWindow, 1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handlePrevWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.PREV_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedWindow, -1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function shiftSelectedWindow(indexDelta) {
    var state, window, browser, index, change, newIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = state_1.getWorkspaceLastSelectionOwnerWindow(state, state.selectedWorkspaceId) || state_1.getWorkspaceWindow(state, state.selectedWorkspaceId);
                if (!window) {
                    return [2 /*return*/];
                }
                browser = aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window.$id);
                index = browser.windows.indexOf(window);
                change = index + indexDelta;
                newIndex = change < 0 ? browser.windows.length - 1 : change >= browser.windows.length ? 0 : change;
                return [4 /*yield*/, effects_1.put(actions_1.windowSelectionShifted(browser.windows[newIndex].$id))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleComponentsPaneEvents() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleComponentsPaneAddClicked)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.spawn(handleDeleteComponentsPane)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleComponentsPaneAddClicked() {
    var name_1, state, workspace, componentId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.COMPONENTS_PANE_ADD_COMPONENT_CLICKED)];
            case 1:
                _a.sent();
                name_1 = prompt("Unique component name");
                if (!name_1) {
                    return [3 /*break*/, 0];
                }
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
                return [4 /*yield*/, effects_1.call(utils_1.apiCreateComponent, name_1, state)];
            case 3:
                componentId = (_a.sent()).componentId;
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: utils_1.apiGetComponentPreviewURI(componentId, state) }, workspace.browserId))];
            case 4:
                _a.sent();
                return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleDeleteComponentsPane() {
    var state, workspace, componentRefs, _i, componentRefs_1, _a, type, componentId, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.DELETE_SHORCUT_PRESSED)];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
                componentRefs = workspace.selectionRefs.filter(function (ref) { return ref[0] === state_1.AVAILABLE_COMPONENT; });
                if (!(componentRefs.length && confirm("Are you sure you want to delete these components?"))) return [3 /*break*/, 6];
                _i = 0, componentRefs_1 = componentRefs;
                _b.label = 3;
            case 3:
                if (!(_i < componentRefs_1.length)) return [3 /*break*/, 6];
                _a = componentRefs_1[_i], type = _a[0], componentId = _a[1];
                return [4 /*yield*/, effects_1.call(utils_1.apiDeleteComponent, componentId, state)];
            case 4:
                result = _b.sent();
                if (result.message) {
                    alert(result.message);
                }
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/workspace.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/workspace.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/state/api.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVAILABLE_COMPONENT = "AVAILABLE_COMPONENT";


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/api.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/api.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/state/dnd.ts":
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
var React = __webpack_require__("./node_modules/react/react.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
exports.withDragSource = function (handler) { return function (BaseComponent) {
    var DraggableComponentClass = /** @class */ (function (_super) {
        __extends(DraggableComponentClass, _super);
        function DraggableComponentClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DraggableComponentClass.prototype.render = function () {
            var _this = this;
            return React.createElement(BaseComponent, __assign({ connectDragSource: function (element) {
                    return React.cloneElement(element, {
                        draggable: true,
                        onDragStart: function (event) { return _this.props.dispatch(actions_1.dndStarted(handler.getData(_this.props), event)); },
                        onDragEnd: function (event) { return _this.props.dispatch(actions_1.dndEnded(handler.getData(_this.props), event)); },
                    });
                } }, this.props));
        };
        return DraggableComponentClass;
    }(React.Component));
    return DraggableComponentClass;
}; };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/dnd.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/dnd.ts"); } } })();
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
exports.getAvailableComponent = function (componentId, workspace) { return workspace.availableComponents.find(function (component) { return component.$id === componentId; }); };
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
    var workspaces = _a.workspaces, selectedWorkspaceId = _a.selectedWorkspaceId, browserStore = _a.browserStore;
    return ({
        workspaces: workspaces.map(exports.serializeWorkspace),
        selectedWorkspaceId: selectedWorkspaceId,
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

/***/ }),

/***/ "./src/front-end/state/shortcuts.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeyboardShortcut = function (keyCombo, action, options) {
    if (options === void 0) { options = { keyup: false }; }
    return ({
        keyCombo: keyCombo,
        action: action,
        options: options
    });
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/shortcuts.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/shortcuts.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/utils/api.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
exports.apiGetComponentPreviewURI = function (componentId, state) {
    // NOTE -- host is not defined here because it can be dynamic for local development.
    return "/components/" + componentId + "/preview";
};
exports.apiWatchUris = function (uris, state) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(state.apiHost + "/watch", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(uris)
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.apiOpenSourceFile = function (source, state) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(state.apiHost + "/open", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(source)
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.apiCreateComponent = function (name, state) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(state.apiHost + "/components", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name
                    })
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.apiDeleteComponent = function (componentId, state) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(state.apiHost + "/components/" + componentId, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/utils/api.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/utils/api.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/utils/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/utils/api.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/utils/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/utils/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})