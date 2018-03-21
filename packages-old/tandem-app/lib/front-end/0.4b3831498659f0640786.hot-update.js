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
    };
    BaseSyntheticWindowRenderer.prototype._addTargetListeners = function () {
        this._sourceWindow.document.addEventListener("readystatechange", this._onDocumentReadyStateChange);
        this._sourceWindow.addEventListener("resize", this._onWindowResize);
        this._sourceWindow.addEventListener("scroll", this._onWindowScroll);
    };
    BaseSyntheticWindowRenderer.prototype.start = function () {
        if (this._started) {
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
                            if (!this._sourceWindow)
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
        function SEnvWindow(origin, top) {
            var _this = _super.call(this) || this;
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
                    this._renderer.removeEventListener(renderers_1.SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
                }
                this._renderer = value;
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
            var window = new SEnvWindow(this.location.toString(), this.top === this ? null : this.top);
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
                var window = new SEnvWindow(url);
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
    var window = new SEnvWindow(location);
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

/***/ })

})