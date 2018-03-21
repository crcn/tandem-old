"use strict";
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
var lodash_1 = require("lodash");
var utils_1 = require("../utils");
var state_1 = require("../../state");
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
//# sourceMappingURL=declaration.js.map