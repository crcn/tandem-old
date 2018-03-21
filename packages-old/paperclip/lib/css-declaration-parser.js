"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("./ast");
var parser_1 = require("./parser");
var tokenizer_1 = require("./tokenizer");
var ast_utils_1 = require("./ast-utils");
var _memos = {};
exports.parseDeclaration = function (source, filePath) {
    if (_memos[source]) {
        return _memos[source];
    }
    var context = {
        filePath: filePath,
        source: source,
        diagnostics: [],
        scanner: tokenizer_1.tokenizePaperclipSource(source)
    };
    return _memos[source] = {
        root: createList(context),
        diagnostics: context.diagnostics
    };
};
var createList = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var items = [];
    var delim;
    while (!scanner.ended()) {
        items.push(createExpression(context));
        if (!delim) {
            delim = scanner.curr();
            if (delim && delim.type !== tokenizer_1.PCTokenType.WHITESPACE && delim.type !== tokenizer_1.PCTokenType.COMMA) {
                if (!parser_1.testCurrTokenType(context, [tokenizer_1.PCTokenType.COMMA])) {
                    return null;
                }
            }
            scanner.next();
        }
    }
    return items.length === 1 ? items[0] : {
        type: delim.type === tokenizer_1.PCTokenType.WHITESPACE ? ast_1.DcExpressionType.SPACED_LIST : ast_1.DcExpressionType.COMMA_LIST,
        items: items,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
    };
};
var createExpression = function (context) {
    var scanner = context.scanner;
    parser_1.eatWhitespace(context);
    switch (scanner.curr().type) {
        case tokenizer_1.PCTokenType.SINGLE_QUOTE:
        case tokenizer_1.PCTokenType.DOUBLE_QUOTE: {
            return parser_1.createString(context);
        }
        case tokenizer_1.PCTokenType.HASH: {
            return createColor(context);
        }
        case tokenizer_1.PCTokenType.NUMBER: {
            return createMeasurement(context);
        }
        case tokenizer_1.PCTokenType.MINUS: {
            if (scanner.hasNext() && scanner.peek(1).type === tokenizer_1.PCTokenType.NUMBER) {
                return createMeasurement(context);
            }
            else {
                return createReference(context);
            }
        }
        case tokenizer_1.PCTokenType.TEXT: {
            return createReference(context);
        }
        default: {
            parser_1.throwUnexpectedToken(scanner.source, scanner.curr());
        }
    }
};
var createColor = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var buffer = "";
    while (!scanner.ended() && scanner.curr().type !== tokenizer_1.PCTokenType.WHITESPACE) {
        buffer += scanner.curr().value;
        scanner.next();
    }
    return {
        type: ast_1.DcExpressionType.COLOR,
        value: buffer,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    };
};
var createMeasurement = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var value = getNumber(context);
    var unit = "";
    if (!scanner.ended() && scanner.curr().type !== tokenizer_1.PCTokenType.WHITESPACE && scanner.curr().type !== tokenizer_1.PCTokenType.COMMA && scanner.curr().type !== tokenizer_1.PCTokenType.PAREN_CLOSE) {
        unit = scanner.curr().value;
        scanner.next();
    }
    return {
        type: ast_1.DcExpressionType.MEASUREMENT,
        value: value,
        unit: unit,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    };
};
var getNumber = function (context) {
    var scanner = context.scanner;
    var curr = scanner.curr();
    var buffer = curr.value;
    if (buffer === "-") {
        buffer += scanner.next().value;
    }
    scanner.next(); // eat number
    return buffer;
};
var createReference = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var name = getReferenceName(context);
    if (!scanner.ended() && scanner.curr().type === tokenizer_1.PCTokenType.PAREN_OPEN) {
        return {
            type: ast_1.DcExpressionType.CALL,
            name: name,
            params: getParams(context),
            location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
        };
    }
    else {
        return {
            type: ast_1.DcExpressionType.KEYWORD,
            name: name
        };
    }
};
var getParams = function (context) {
    var scanner = context.scanner;
    var params = [];
    while (!scanner.ended() && scanner.curr().type !== tokenizer_1.PCTokenType.PAREN_CLOSE) {
        scanner.next(); // eat ( , \s
        parser_1.eatWhitespace(context);
        params.push(createExpression(context));
    }
    if (!parser_1.testCurrTokenType(context, [tokenizer_1.PCTokenType.PAREN_CLOSE])) {
        return null;
    }
    scanner.next(); // eat )
    return params;
};
var getReferenceName = function (context) {
    var scanner = context.scanner;
    var buffer = "";
    while (!scanner.ended() && scanner.curr().type !== tokenizer_1.PCTokenType.WHITESPACE && scanner.curr().type !== tokenizer_1.PCTokenType.PAREN_OPEN && scanner.curr().type !== tokenizer_1.PCTokenType.PAREN_CLOSE) {
        buffer += scanner.curr().value;
        scanner.next();
    }
    return buffer;
};
exports.stringifyDeclarationAST = function (expr) {
    switch (expr.type) {
        case ast_1.DcExpressionType.SPACED_LIST: {
            var list = expr;
            return list.items.map(exports.stringifyDeclarationAST).join(" ");
        }
        case ast_1.DcExpressionType.COMMA_LIST: {
            var list = expr;
            return list.items.map(exports.stringifyDeclarationAST).join(", ");
        }
        case ast_1.DcExpressionType.KEYWORD: {
            return expr.name;
        }
        case ast_1.DcExpressionType.CALL: {
            var call = expr;
            return call.name + "(" + call.params.map(exports.stringifyDeclarationAST).join(", ") + ")";
        }
        case ast_1.DcExpressionType.COLOR: {
            return expr.value;
        }
        case ast_1.BKExpressionType.STRING: {
            return JSON.stringify(expr.value);
        }
        case ast_1.DcExpressionType.MEASUREMENT: {
            var _a = expr, value = _a.value, unit = _a.unit;
            return "" + value + unit;
        }
        default: {
            throw new Error("Unable to stringify CSS declaration value type " + expr.type);
        }
    }
};
//# sourceMappingURL=css-declaration-parser.js.map