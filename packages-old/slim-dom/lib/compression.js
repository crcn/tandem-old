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
var state_1 = require("./state");
var utils_1 = require("./utils");
exports.compressRootNode = utils_1.weakMemo(function (root) {
    return [utils_1.getVmObjectSourceUris(root), compressVMObject(root)];
});
var compressVMObject = function (node) {
    switch (node.type) {
        case state_1.SlimVMObjectType.TEXT: return [node.type, node.value];
        case state_1.SlimVMObjectType.ELEMENT: {
            var _a = node, type = _a.type, tagName = _a.tagName, attributes = _a.attributes, shadow = _a.shadow, childNodes = _a.childNodes;
            var attribs = [];
            for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                var attribute = attributes_1[_i];
                attribs.push([attribute.name, attribute.value]);
            }
            var base = [
                type,
                tagName,
                attribs,
                shadow ? compressVMObject(shadow) : null,
                childNodes.map(function (child) { return compressVMObject(child); })
            ];
            if (tagName === "style") {
                base.push(compressVMObject(node.sheet));
            }
            return base;
        }
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT:
        case state_1.SlimVMObjectType.DOCUMENT: {
            var _b = node, type = _b.type, childNodes = _b.childNodes;
            return [
                type,
                childNodes.map(function (child) { return compressVMObject(child); })
            ];
        }
        case state_1.SlimVMObjectType.STYLE_SHEET: {
            var _c = node, type = _c.type, rules = _c.rules;
            return [
                type,
                rules.map(function (rule) { return compressVMObject(rule); })
            ];
        }
        case state_1.SlimVMObjectType.FONT_FACE_RULE: {
            var _d = node, type = _d.type, style = _d.style, source = _d.source;
            var decl = compressStyle(style);
            return [
                type,
                decl
            ];
        }
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var _e = node, type = _e.type, selectorText = _e.selectorText, style = _e.style, source = _e.source;
            var decl = compressStyle(style);
            return [
                type,
                selectorText,
                decl
            ];
        }
        case state_1.SlimVMObjectType.AT_RULE: {
            var _f = node, type = _f.type, name_1 = _f.name, params = _f.params, rules = _f.rules;
            return [
                type,
                name_1,
                params,
                rules.map(function (rule) { return compressVMObject(rule); })
            ];
        }
    }
};
exports.uncompressRootNode = function (_a) {
    var sources = _a[0], node = _a[1];
    return uncompressVMObject(node);
};
var uncompressVMObject = function (node) {
    switch (node[0]) {
        case state_1.SlimVMObjectType.TEXT: {
            var type = node[0], value = node[1];
            return {
                type: type,
                value: value,
            };
        }
        case state_1.SlimVMObjectType.ELEMENT: {
            var type = node[0], tagName = node[1], attributes = node[2], shadow = node[3], childNodes = node[4];
            var atts = [];
            for (var _i = 0, attributes_2 = attributes; _i < attributes_2.length; _i++) {
                var _a = attributes_2[_i], name_2 = _a[0], value = _a[1];
                atts.push({ name: name_2, value: value });
            }
            var base = {
                type: type,
                tagName: tagName,
                attributes: atts,
                shadow: shadow && uncompressVMObject(shadow),
                childNodes: childNodes.map(function (child) { return uncompressVMObject(child); })
            };
            if (tagName === "style") {
                base = __assign({}, base, { sheet: uncompressVMObject(node[5]) });
            }
            return base;
        }
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT:
        case state_1.SlimVMObjectType.DOCUMENT: {
            var type = node[0], childNodes = node[1];
            return {
                type: type,
                childNodes: childNodes.map(function (child) { return uncompressVMObject(child); })
            };
        }
        case state_1.SlimVMObjectType.STYLE_SHEET: {
            var type = node[0], rules = node[1];
            return {
                type: type,
                rules: rules.map(function (rule) { return uncompressVMObject(rule); })
            };
        }
        case state_1.SlimVMObjectType.FONT_FACE_RULE: {
            var type = node[0], decls = node[1];
            var style = uncompressStyle(decls);
            return {
                type: type,
                style: style
            };
        }
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var type = node[0], selectorText = node[1], decls = node[2];
            var style = uncompressStyle(decls);
            return {
                type: type,
                selectorText: selectorText,
                style: style
            };
        }
        case state_1.SlimVMObjectType.AT_RULE: {
            var type = node[0], name_3 = node[1], params = node[2], rules = node[3];
            return {
                type: type,
                name: name_3,
                params: params,
                rules: rules.map(function (rule) { return uncompressVMObject(rule); })
            };
        }
    }
};
var uncompressStyle = function (decls) {
    var style = [];
    for (var i = 0, length_1 = decls.length; i < length_1; i++) {
        var _a = decls[i], name_4 = _a[0], value = _a[1];
        style.push({ name: name_4, value: value });
    }
    return style;
};
var compressStyle = function (decls) {
    var compressed = [];
    for (var i = 0, length_2 = decls.length; i < length_2; i++) {
        var _a = decls[i], name_5 = _a.name, value = _a.value;
        compressed.push([name_5, value]);
    }
    return compressed;
};
//# sourceMappingURL=compression.js.map