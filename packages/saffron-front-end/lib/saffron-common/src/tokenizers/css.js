"use strict";
const scanner_1 = require('./scanner');
const index_1 = require('../object/index');
const create_token_1 = require('./create-token');
// linear-gradient(45deg, blue, red)
// linear-gradient(to left top, blue, red);
// linear-gradient(0deg, blue, green 40%, red);
const token_types_1 = require('./token-types');
var tokenMap = {
    '.': token_types_1.DOT,
    ':': token_types_1.COLON,
    '(': token_types_1.LEFT_PAREN,
    ')': token_types_1.RIGHT_PAREN,
    ',': token_types_1.COMMA,
};
class CSSTokenizer extends index_1.default {
    tokenize(source) {
        var scanner = new scanner_1.default(source);
        var tokens = [];
        function addToken(search, type) {
            if (scanner.scan(search)) {
                tokens.push(create_token_1.default(scanner.getCapture(), type));
                return true;
            }
            return false;
        }
        // function addOperator() {
        //   return addToken(/^[\/\*\-\+]/, OPERATOR);
        // }
        while (!scanner.hasTerminated()) {
            const number = scanner.scan(/^((\.\d+)|(\d)+(\.\d+)?)/);
            if (number) {
                if (scanner.scan(/^deg/)) {
                    tokens.push(create_token_1.default(number, 'degree'));
                }
                else {
                    tokens.push(create_token_1.default(number, 'number'));
                    // http://www.w3schools.com/cssref/css_units.asp
                    addToken(/^(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/, 'unit');
                }
                continue;
            }
            if (addToken(/^#\w{1,6}/, 'color'))
                continue;
            if (addToken(/^\w+(\-\w+)?/, 'reference'))
                continue;
            if (addToken(/^\u0020+/, token_types_1.SPACE))
                continue;
            if (addToken(/^\t+/, token_types_1.TAB))
                continue;
            if (addToken(/^[\/\*\-\+]/, token_types_1.OPERATOR))
                continue;
            if (addToken(/^,/, token_types_1.COMMA))
                continue;
            const char = scanner.nextChar();
            tokens.push(create_token_1.default(char, tokenMap[char] || 'text'));
        }
        return tokens;
    }
}
exports.CSSTokenizer = CSSTokenizer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new CSSTokenizer({});
//# sourceMappingURL=css.js.map