"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var postcss = require("postcss");
var sm = require("source-map");
var lodash_1 = require("lodash");
var style_sheet_1 = require("./style-sheet");
var rules_1 = require("./rules");
var declaration_1 = require("./declaration");
var source_1 = require("../../utils/source");
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
//# sourceMappingURL=utils.js.map