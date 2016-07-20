"use strict";
const parse_units_1 = require('./parse-units');
exports.parseUnit = parse_units_1.default;
const translate_style_1 = require('./translate-style');
exports.translateStyle = translate_style_1.default;
exports.convertUnit = translate_style_1.default;
var translate_style_2 = require('./translate-style');
exports.translateStyleToIntegers = translate_style_2.translateStyleToIntegers;
const css_1 = require('../../tokenizers/css');
function stringifyToken(token) {
    return token.value;
}
exports.stringifyToken = stringifyToken;
function tokenize(source) {
    return css_1.default.tokenize(String(source || ''));
}
exports.tokenize = tokenize;
function translateLength(x1, y1, x2) {
    var tokens = tokenize(y1);
    var left = tokens.find(function (token) {
        return /number/.test(token.type);
    });
    if (left) {
        let v = Number(left.value);
        if (v < 0) {
            x1 += v;
            v = 0;
        }
        if (v === 0) {
            v = 1;
            x1++;
        }
        v = (v * x2) / x1;
        left.value = Number(v.toFixed(2));
    }
    return tokens.map(stringifyToken).join('');
}
exports.translateLength = translateLength;
function calculateLengthInPixels(length) {
    if (!length)
        return 0;
    // could be somthing like 'normal'
    if (!css_1.default.tokenize(String(length)).find(function (token) {
        return token.type === 'unit';
    })) {
        return length;
    }
    return length ? parse_units_1.default(translate_style_1.default(length, 'px'))[0] : 0;
}
exports.calculateLengthInPixels = calculateLengthInPixels;
//# sourceMappingURL=index.js.map