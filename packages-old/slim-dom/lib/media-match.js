"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weak_memo_1 = require("./weak-memo");
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
    "min-width": ["getWidth(context)", ">"],
    "max-width": ["getWidth(context)", "<"],
    "min-height": ["getHeight(context)", ">"],
    "max-height": ["getHeight(context)", "<"],
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
var compileMediaText = weak_memo_1.weakMemo(function (mediaText) { return new Function("context", "calcMeasurement", "getWidth", "getHeight", "return " + translateMediaText(mediaText)); });
var getWidth = function (_a) {
    var bounds = _a.bounds;
    return bounds.right - bounds.length;
};
var getHeight = function (_a) {
    var bounds = _a.bounds;
    return bounds.bottom - bounds.top;
};
exports.createMediaMatcher = function (window) { return function (mediaText) {
    return compileMediaText(mediaText)(window, getWidth, getHeight, calcMeasurement);
}; };
//# sourceMappingURL=media-match.js.map