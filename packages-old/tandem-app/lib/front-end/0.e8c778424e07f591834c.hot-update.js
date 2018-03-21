webpackHotUpdate(0,{

/***/ "../paperclip/lib/tokenizer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ast_utils_1 = __webpack_require__("../paperclip/lib/ast-utils.js");
var scanners_1 = __webpack_require__("../paperclip/lib/scanners.js");
var PCTokenType;
(function (PCTokenType) {
    PCTokenType[PCTokenType["LESS_THAN"] = 0] = "LESS_THAN";
    PCTokenType[PCTokenType["LESS_THAN_OR_EQUAL"] = 1] = "LESS_THAN_OR_EQUAL";
    PCTokenType[PCTokenType["CLOSE_TAG"] = 2] = "CLOSE_TAG";
    PCTokenType[PCTokenType["COMMA"] = 3] = "COMMA";
    PCTokenType[PCTokenType["GREATER_THAN"] = 4] = "GREATER_THAN";
    PCTokenType[PCTokenType["GREATER_THAN_OR_EQUAL"] = 5] = "GREATER_THAN_OR_EQUAL";
    PCTokenType[PCTokenType["COMMENT"] = 6] = "COMMENT";
    PCTokenType[PCTokenType["BACKSLASH"] = 7] = "BACKSLASH";
    PCTokenType[PCTokenType["PERIOD"] = 8] = "PERIOD";
    PCTokenType[PCTokenType["BANG"] = 9] = "BANG";
    PCTokenType[PCTokenType["AND"] = 10] = "AND";
    PCTokenType[PCTokenType["OR"] = 11] = "OR";
    PCTokenType[PCTokenType["PLUS"] = 12] = "PLUS";
    PCTokenType[PCTokenType["COLON"] = 13] = "COLON";
    PCTokenType[PCTokenType["SEMICOLON"] = 14] = "SEMICOLON";
    PCTokenType[PCTokenType["QUESTION_MARK"] = 15] = "QUESTION_MARK";
    PCTokenType[PCTokenType["MINUS"] = 16] = "MINUS";
    PCTokenType[PCTokenType["NUMBER"] = 17] = "NUMBER";
    PCTokenType[PCTokenType["AT"] = 18] = "AT";
    PCTokenType[PCTokenType["STAR"] = 19] = "STAR";
    PCTokenType[PCTokenType["PERCENT"] = 20] = "PERCENT";
    PCTokenType[PCTokenType["PAREN_OPEN"] = 21] = "PAREN_OPEN";
    PCTokenType[PCTokenType["PAREN_CLOSE"] = 22] = "PAREN_CLOSE";
    PCTokenType[PCTokenType["DOUBLE_EQUALS"] = 23] = "DOUBLE_EQUALS";
    PCTokenType[PCTokenType["TRIPPLE_EQUELS"] = 24] = "TRIPPLE_EQUELS";
    PCTokenType[PCTokenType["NOT_EQUALS"] = 25] = "NOT_EQUALS";
    PCTokenType[PCTokenType["NOT_DOUBLE_EQUALS"] = 26] = "NOT_DOUBLE_EQUALS";
    PCTokenType[PCTokenType["BRACKET_OPEN"] = 27] = "BRACKET_OPEN";
    PCTokenType[PCTokenType["BRACKET_CLOSE"] = 28] = "BRACKET_CLOSE";
    PCTokenType[PCTokenType["CURLY_BRACKET_OPEN"] = 29] = "CURLY_BRACKET_OPEN";
    PCTokenType[PCTokenType["CURLY_BRACKET_CLOSE"] = 30] = "CURLY_BRACKET_CLOSE";
    PCTokenType[PCTokenType["EQUALS"] = 31] = "EQUALS";
    PCTokenType[PCTokenType["SINGLE_QUOTE"] = 32] = "SINGLE_QUOTE";
    PCTokenType[PCTokenType["HASH"] = 33] = "HASH";
    PCTokenType[PCTokenType["DOUBLE_QUOTE"] = 34] = "DOUBLE_QUOTE";
    PCTokenType[PCTokenType["TEXT"] = 35] = "TEXT";
    PCTokenType[PCTokenType["RESERVED_KEYWORD"] = 36] = "RESERVED_KEYWORD";
    PCTokenType[PCTokenType["WHITESPACE"] = 37] = "WHITESPACE";
})(PCTokenType = exports.PCTokenType || (exports.PCTokenType = {}));
;
exports.tokenizePaperclipSource = function (source) {
    var scanner = new scanners_1.StringScanner(source);
    var tokens = [];
    while (!scanner.ended()) {
        var cchar = scanner.curr();
        var token = void 0;
        if (cchar === "<") {
            if (scanner.peek(2) === "</") {
                token = ast_utils_1.createToken(PCTokenType.CLOSE_TAG, scanner.pos, scanner.take(2));
            }
            else if (scanner.peek(4) === "<!--") {
                var buffer = scanner.take(4);
                while (!scanner.ended()) {
                    var cchar_1 = scanner.curr();
                    if (cchar_1 === "-" && scanner.peek(3) === "-->") {
                        buffer += scanner.take(3);
                        break;
                    }
                    scanner.next();
                    buffer += cchar_1;
                }
                token = ast_utils_1.createToken(PCTokenType.COMMENT, scanner.pos, buffer);
            }
            else if (scanner.peek(2) === "<=") {
                token = ast_utils_1.createToken(PCTokenType.LESS_THAN_OR_EQUAL, scanner.pos, scanner.take(2));
            }
            else {
                token = ast_utils_1.createToken(PCTokenType.LESS_THAN, scanner.pos, scanner.shift());
            }
        }
        else if (cchar === "&" && scanner.peek(2) === "&&") {
            token = ast_utils_1.createToken(PCTokenType.AND, scanner.pos, scanner.take(2));
        }
        else if (cchar === "|" && scanner.peek(2) === "||") {
            token = ast_utils_1.createToken(PCTokenType.OR, scanner.pos, scanner.take(2));
        }
        else if (cchar === ">") {
            if (scanner.peek(2) === ">=") {
                token = ast_utils_1.createToken(PCTokenType.GREATER_THAN_OR_EQUAL, scanner.pos, scanner.take(2));
            }
            else {
                token = ast_utils_1.createToken(PCTokenType.GREATER_THAN, scanner.pos, scanner.shift());
            }
        }
        else if (cchar === "=") {
            if (scanner.peek(3) === "===") {
                token = ast_utils_1.createToken(PCTokenType.TRIPPLE_EQUELS, scanner.pos, scanner.take(3));
            }
            else if (scanner.peek(2) === "==") {
                token = ast_utils_1.createToken(PCTokenType.DOUBLE_EQUALS, scanner.pos, scanner.take(2));
            }
            else {
                token = ast_utils_1.createToken(PCTokenType.EQUALS, scanner.pos, scanner.shift());
            }
        }
        else if (cchar === ":") {
            token = ast_utils_1.createToken(PCTokenType.COLON, scanner.pos, scanner.shift());
        }
        else if (cchar === ";") {
            token = ast_utils_1.createToken(PCTokenType.SEMICOLON, scanner.pos, scanner.shift());
        }
        else if (cchar === "@") {
            token = ast_utils_1.createToken(PCTokenType.AT, scanner.pos, scanner.shift());
        }
        else if (cchar === ",") {
            token = ast_utils_1.createToken(PCTokenType.COMMA, scanner.pos, scanner.shift());
        }
        else if (cchar === "'") {
            token = ast_utils_1.createToken(PCTokenType.SINGLE_QUOTE, scanner.pos, scanner.shift());
        }
        else if (cchar === "#") {
            token = ast_utils_1.createToken(PCTokenType.HASH, scanner.pos, scanner.shift());
        }
        else if (cchar === "!") {
            if (scanner.peek(3) === "!==") {
                token = ast_utils_1.createToken(PCTokenType.NOT_DOUBLE_EQUALS, scanner.pos, scanner.take(3));
            }
            else if (scanner.peek(2) === "!=") {
                token = ast_utils_1.createToken(PCTokenType.NOT_EQUALS, scanner.pos, scanner.take(2));
            }
            else {
                token = ast_utils_1.createToken(PCTokenType.BANG, scanner.pos, scanner.shift());
            }
        }
        else if (cchar === "/") {
            // eat comments
            if (scanner.peek(2) === "/*") {
                scanner.match(/.*?\*\//);
                continue;
            }
            else {
                token = ast_utils_1.createToken(PCTokenType.BACKSLASH, scanner.pos, scanner.shift());
            }
        }
        else if (cchar === ".") {
            if (/\.\d/.test(scanner.peek(2))) {
                token = getNumberToken(scanner);
            }
            else {
                token = ast_utils_1.createToken(PCTokenType.PERIOD, scanner.pos, scanner.shift());
            }
        }
        else if (cchar === "?") {
            token = ast_utils_1.createToken(PCTokenType.QUESTION_MARK, scanner.pos, scanner.shift());
        }
        else if (cchar === "\"") {
            token = ast_utils_1.createToken(PCTokenType.DOUBLE_QUOTE, scanner.pos, scanner.shift());
        }
        else if (cchar === "+") {
            token = ast_utils_1.createToken(PCTokenType.PLUS, scanner.pos, scanner.shift());
        }
        else if (cchar === "-") {
            if (/\-\d/.test(scanner.peek(2))) {
                token = getNumberToken(scanner);
            }
            else {
                token = ast_utils_1.createToken(PCTokenType.MINUS, scanner.pos, scanner.shift());
            }
        }
        else if (cchar === "*") {
            token = ast_utils_1.createToken(PCTokenType.STAR, scanner.pos, scanner.shift());
        }
        else if (cchar === "%") {
            token = ast_utils_1.createToken(PCTokenType.PERCENT, scanner.pos, scanner.shift());
        }
        else if (cchar === "[") {
            token = ast_utils_1.createToken(PCTokenType.BRACKET_OPEN, scanner.pos, scanner.shift());
        }
        else if (cchar === "]") {
            token = ast_utils_1.createToken(PCTokenType.BRACKET_CLOSE, scanner.pos, scanner.shift());
        }
        else if (cchar === "(") {
            token = ast_utils_1.createToken(PCTokenType.PAREN_OPEN, scanner.pos, scanner.shift());
        }
        else if (cchar === ")") {
            token = ast_utils_1.createToken(PCTokenType.PAREN_CLOSE, scanner.pos, scanner.shift());
        }
        else if (cchar === "{") {
            token = ast_utils_1.createToken(PCTokenType.CURLY_BRACKET_OPEN, scanner.pos, scanner.shift());
        }
        else if (cchar === "}") {
            token = ast_utils_1.createToken(PCTokenType.CURLY_BRACKET_CLOSE, scanner.pos, scanner.shift());
        }
        else if (/\d/.test(cchar)) {
            token = getNumberToken(scanner);
        }
        else if (/[\s\r\n\t]/.test(cchar)) {
            token = ast_utils_1.createToken(PCTokenType.WHITESPACE, scanner.pos, scanner.scan(/[\s\r\n\t]/));
        }
        else {
            var pos = scanner.pos;
            var text = scanner.scan(/[^-<>,='":@;\./?\\(){}\[\]\s\r\n\t]/) || scanner.shift();
            // null intentionally left out
            token = ast_utils_1.createToken(text === "undefined" || text === "null" || text === "true" || text === "false" ? PCTokenType.RESERVED_KEYWORD : PCTokenType.TEXT, pos, text);
        }
        tokens.push(token);
    }
    return new scanners_1.TokenScanner(source, tokens);
};
var getNumberToken = function (scanner) {
    return ast_utils_1.createToken(PCTokenType.NUMBER, scanner.pos, scanner.match(/^\-?(\d+(\.\d+)?|\.\d+)/));
};
//# sourceMappingURL=tokenizer.js.map

/***/ })

})