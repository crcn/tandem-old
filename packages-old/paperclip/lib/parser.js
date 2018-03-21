"use strict";
// Note that JS, and styles are parsed so that we can do analysis on the
// AST and provide warnings, hints, and errors.
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*

TODOS:
- [ ] Strong types
*/
var ast_1 = require("./ast");
var parser_utils_1 = require("./parser-utils");
var ast_utils_1 = require("./ast-utils");
var utils_1 = require("./utils");
var tokenizer_1 = require("./tokenizer");
var _memos = typeof window !== "undefined" && window["cache"] ? window["cache"].parseModuleSource || (window["cache"].parseModuleSource = {}) : {};
exports.parseModuleSource = function (source, filePath) {
    if (_memos[source])
        return _memos[source]; // result should be immutable, so this is okay 
    var context = {
        source: source,
        filePath: filePath,
        scanner: tokenizer_1.tokenizePaperclipSource(source),
        diagnostics: []
    };
    var root;
    if (!filePath || utils_1.isPaperclipFile(filePath)) {
        root = createFragment(context);
    }
    else if (utils_1.isCSSFile(filePath)) {
        root = createStyleSheet(context);
    }
    else {
        throw new Error("Cannot parse " + filePath + " type.");
    }
    return _memos[source] = {
        root: root && __assign({}, root, { input: source }),
        diagnostics: context.diagnostics
    };
};
exports.parseStyleSource = function (source, filePath) {
    if (_memos[source])
        return _memos[source];
    var context = {
        source: source,
        scanner: tokenizer_1.tokenizePaperclipSource(source),
        filePath: filePath,
        diagnostics: []
    };
    var root = createStyleSheet(context);
    return _memos[source] = {
        root: root,
        diagnostics: context.diagnostics
    };
};
var createFragment = function (context) {
    var scanner = context.scanner;
    var childNodes = [];
    while (!scanner.ended()) {
        var child = createNodeExpression(context);
        if (!child) {
            return null;
        }
        childNodes.push(child);
    }
    return childNodes.length === 1 ? childNodes[0] : ({
        type: ast_1.PCExpressionType.FRAGMENT,
        location: ast_utils_1.getLocation(0, scanner.source.length, scanner.source),
        childNodes: childNodes,
    });
};
var createNodeExpression = function (context) {
    if (!exports.testCurrTokenExists(context)) {
        return null;
    }
    var scanner = context.scanner;
    switch (scanner.curr().type) {
        case tokenizer_1.PCTokenType.WHITESPACE: return createTextNode(context);
        case tokenizer_1.PCTokenType.LESS_THAN: return createTag(context);
        case tokenizer_1.PCTokenType.CLOSE_TAG: return createCloseTag(context);
        case tokenizer_1.PCTokenType.COMMENT: return createComment(context);
        default: {
            if (isBlockStarting(scanner)) {
                return createBlock(context, createTextBlockStatement);
            }
            return createTextNode(context);
        }
    }
};
var createBlock = function (context, createStatement) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat [
    scanner.next(); // eat [
    exports.eatWhitespace(context);
    var value = createStatement(context);
    if (!value) {
        return null;
    }
    exports.eatWhitespace(context);
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.BRACKET_CLOSE], null, ast_utils_1.getLocation(start, scanner.curr(), context.source))) {
        return null;
    }
    scanner.next(); // eat ]
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.BRACKET_CLOSE], "Missing closing ] character.", ast_utils_1.getTokenLocation(start, context.source))) {
        return null;
    }
    scanner.next(); // eat ]
    return ({
        type: ast_1.PCExpressionType.BLOCK,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
        value: value,
    });
};
var createElementBlockStatement = function (context) {
    var scanner = context.scanner;
    switch (scanner.curr().value) {
        case "bind": return createBindBlock(context);
        case "repeat": return createRepeatBlock(context);
        case "if": return createConditionBlock(context, ast_1.BKExpressionType.IF, true);
        case "elseif": return createConditionBlock(context, ast_1.BKExpressionType.ELSEIF, true);
        case "else": return createConditionBlock(context, ast_1.BKExpressionType.ELSE);
        case "property": return createPropertyBlock(context, ast_1.BKExpressionType.PROPERTY);
        default: {
            exports.addUnexpectedToken(context, "Unexpected block type " + scanner.curr().value + ".");
            return null;
        }
    }
};
var createTextBlockStatement = function (context) {
    var scanner = context.scanner;
    switch (scanner.curr().value) {
        case "bind": return createBindBlock(context);
        case "elseif":
        case "else":
        case "if": {
            exports.addUnexpectedToken(context, "Condition blocks can only be added to elements, for example: <div [[if condition]]></div>.");
            return null;
        }
        case "repeat": {
            exports.addUnexpectedToken(context, "Repeat blocks can only be added to elements, for example: <div [[repeat items in item, i]]></div>.");
            return null;
        }
        default: {
            exports.addUnexpectedToken(context, "Unexpected block type " + scanner.curr().value + ".");
            return null;
        }
    }
};
var createTextAttributeBlockStatement = function (context) {
    var scanner = context.scanner;
    switch (scanner.curr().value) {
        case "bind": return createBindBlock(context);
        case "elseif":
        case "else":
        case "if": {
            exports.addUnexpectedToken(context, "Condition blocks cannot be assigned to attributes.");
            return null;
        }
        case "repeat": {
            exports.addUnexpectedToken(context, "Repeat blocks cannot be assigned to attributes.");
            return null;
        }
        default: {
            exports.addUnexpectedToken(context, "Unexpected block type " + scanner.curr().value + ".");
            return null;
        }
    }
};
var createBKExpressionStatement = function (context) { return createBKOperation(context); };
var isMultiplicative = function (value) { return value === "*" || value === "/"; };
var isAdditive = function (value) { return value === "+" || value === "-"; };
var createBKOperation = function (context) {
    if (!exports.testCurrTokenExists(context)) {
        return null;
    }
    var scanner = context.scanner;
    var lhs = createBKExpression(context);
    exports.eatWhitespace(context);
    if (!lhs) {
        return null;
    }
    var operator = scanner.curr();
    var otype = operator ? operator.type : -1;
    var isOperator = otype === tokenizer_1.PCTokenType.AND || otype === tokenizer_1.PCTokenType.OR || otype == tokenizer_1.PCTokenType.PLUS || otype === tokenizer_1.PCTokenType.MINUS || otype === tokenizer_1.PCTokenType.STAR || otype === tokenizer_1.PCTokenType.BACKSLASH || otype === tokenizer_1.PCTokenType.DOUBLE_EQUALS || otype === tokenizer_1.PCTokenType.TRIPPLE_EQUELS || otype === tokenizer_1.PCTokenType.GREATER_THAN || otype === tokenizer_1.PCTokenType.LESS_THAN || otype === tokenizer_1.PCTokenType.LESS_THAN_OR_EQUAL || otype === tokenizer_1.PCTokenType.GREATER_THAN_OR_EQUAL || otype === tokenizer_1.PCTokenType.NOT_EQUALS || otype === tokenizer_1.PCTokenType.NOT_DOUBLE_EQUALS;
    if (!isOperator) {
        return lhs;
    }
    scanner.next(); // eat operator
    exports.eatWhitespace(context);
    var rhs = createBKOperation(context);
    if (!rhs) {
        return null;
    }
    var op = {
        type: ast_1.BKExpressionType.OPERATION,
        left: lhs,
        right: rhs,
        operator: operator.value,
        location: ast_utils_1.getLocation(lhs.location.start, rhs.location.end, scanner.source),
    };
    // re-order. examples of how this algorithm works (parameters are used to denote binary trees):
    // 1 * (1 - 2) -> (1 * 1) - 2
    // 1 * (1 / (3 * 4)) -> 1 * ((1 / 3) * 4) -> (1 * (1 / 3)) * 4
    // 1 * (5 - (4 / 3)) -> (1 * 5) - (4 / 3)
    if (rhs.type === ast_1.BKExpressionType.OPERATION && isMultiplicative(operator.value)) {
        var rho = rhs;
        op = __assign({}, rho, { left: __assign({}, op, { right: rho.left }) });
    }
    return op;
};
var createBKExpression = function (context) {
    var scanner = context.scanner;
    exports.eatWhitespace(context);
    switch (scanner.curr().type) {
        case tokenizer_1.PCTokenType.BANG: return createNotExpression(context);
        case tokenizer_1.PCTokenType.SINGLE_QUOTE:
        case tokenizer_1.PCTokenType.DOUBLE_QUOTE: return exports.createString(context);
        case tokenizer_1.PCTokenType.NUMBER: return createNumber(context);
        case tokenizer_1.PCTokenType.CURLY_BRACKET_OPEN: return createObject(context);
        case tokenizer_1.PCTokenType.BRACKET_OPEN: return createArray(context);
        case tokenizer_1.PCTokenType.PAREN_OPEN: return createGroup(context);
        case tokenizer_1.PCTokenType.TEXT: return createPropReference(context);
        case tokenizer_1.PCTokenType.RESERVED_KEYWORD: return createReservedKeyword(context);
        default: {
            exports.addUnexpectedToken(context);
            return null;
        }
    }
};
exports.createString = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat '
    var value = "";
    while (!scanner.ended()) {
        var curr = scanner.curr();
        if (curr.value === start.value) {
            break;
        }
        // escape
        if (curr.value === "\\") {
            value += curr.value;
            value += scanner.next().value;
            scanner.next();
            continue;
        }
        value += curr.value;
        scanner.next();
    }
    if (!testClosingToken(context, start)) {
        return null;
    }
    scanner.next(); // eat quote
    return {
        type: ast_1.BKExpressionType.STRING,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
        value: value,
    };
};
var createNumber = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next();
    return ({
        type: ast_1.BKExpressionType.NUMBER,
        value: start.value,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    });
};
var createObject = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat {
    var properties = [];
    while (1) {
        if (!exports.eatWhitespace(context))
            break;
        if (scanner.curr().type === tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE) {
            break;
        }
        var pair = createKeyValuePair(context);
        if (!pair) {
            return null;
        }
        properties.push(pair);
        if (!exports.eatWhitespace(context))
            break;
        var curr = scanner.curr();
        // will break in next loop
        if (curr.type === tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE) {
            continue;
        }
        if (curr.type !== tokenizer_1.PCTokenType.COMMA && curr) {
            exports.addUnexpectedToken(context);
            return null;
        }
        scanner.next();
    }
    scanner.next(); // eat }. Assertion happens in while loop
    return {
        type: ast_1.BKExpressionType.OBJECT,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
        properties: properties,
    };
};
var createArray = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next();
    exports.eatWhitespace(context);
    var values = [];
    var curr = scanner.curr();
    if (curr.type !== tokenizer_1.PCTokenType.BRACKET_CLOSE) {
        while (1) {
            var expr = createBKExpression(context);
            if (!expr) {
                return null;
            }
            values.push(expr);
            if (!exports.eatWhitespace(context))
                break;
            var curr_1 = scanner.curr();
            if (curr_1.type === tokenizer_1.PCTokenType.BRACKET_CLOSE) {
                break;
            }
            if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.COMMA], null, ast_utils_1.getLocation(start, scanner.curr(), context.source))) {
                return null;
            }
            scanner.next();
        }
    }
    scanner.next();
    return {
        type: ast_1.BKExpressionType.ARRAY,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
        values: values,
    };
};
var createKeyValuePair = function (context) {
    var scanner = context.scanner;
    var key;
    switch (scanner.curr().type) {
        case tokenizer_1.PCTokenType.SINGLE_QUOTE:
        case tokenizer_1.PCTokenType.DOUBLE_QUOTE: {
            key = exports.createString(context);
            break;
        }
        default: {
            key = createVarReference(context);
        }
    }
    exports.eatWhitespace(context);
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.COLON], "Missing : for object.")) {
        return null;
    }
    scanner.next(); // eat :
    exports.eatWhitespace(context);
    var value = createBKExpressionStatement(context);
    if (!value) {
        return null;
    }
    return {
        type: ast_1.BKExpressionType.KEY_VALUE_PAIR,
        location: ast_utils_1.getLocation(key.location.start, value.location.end, scanner.source),
        key: key.name,
        value: value,
    };
};
var createGroup = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat )
    var value = createBKExpressionStatement(context);
    scanner.next(); // eat )
    return {
        type: ast_1.BKExpressionType.GROUP,
        value: value,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
    };
};
var createReservedKeyword = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next();
    return {
        type: ast_1.BKExpressionType.RESERVED_KEYWORD,
        value: start.value,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
    };
};
var createBindBlock = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat bind
    scanner.next(); // eat WS
    context.startToken = start;
    var value = createBKExpressionStatement(context);
    context.startToken = undefined;
    if (!value) {
        return null;
    }
    return ({
        type: ast_1.BKExpressionType.BIND,
        value: value,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    });
};
var createPropertyBlock = function (context, type) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat property
    scanner.next(); // eat ws
    var ref = createVarReference(context);
    return ({
        type: type,
        name: ref.name,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    });
};
var createConditionBlock = function (context, type, expectCondition) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat name
    exports.eatWhitespace(context);
    var condition = null;
    if (scanner.curr().type !== tokenizer_1.PCTokenType.BRACKET_CLOSE) {
        condition = createBKExpressionStatement(context);
        if (!condition) {
            return null;
        }
    }
    if (expectCondition && !condition) {
        exports.addUnexpectedToken(context, "Missing condition.", ast_utils_1.getLocation(start, scanner.curr(), context.source));
        return null;
    }
    return ({
        type: type,
        // only support references for now
        condition: condition,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    });
};
var createRepeatBlock = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat repeat
    exports.eatWhitespace(context);
    // if (!testCurrTokenType(context, [PCTokenType.TEXT], "Repeat block missing collection parameter.", getTokenLocation(start, context.source))) {
    //   return null;
    // }
    var each = createBKExpressionStatement(context);
    exports.eatWhitespace(context);
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.TEXT], null, ast_utils_1.getLocation(start, scanner.curr(), context.source))) {
        return null;
    }
    if (scanner.curr().value !== "as") {
        exports.addUnexpectedToken(context, "Repeat block missing \"as\" keyword.", ast_utils_1.getLocation(start, scanner.curr(), context.source));
        return null;
    }
    scanner.next(); // eat as
    exports.eatWhitespace(context);
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.TEXT], null, ast_utils_1.getLocation(start, scanner.curr(), context.source))) {
        return null;
    }
    var asValue = createVarReference(context); // eat WS
    var asKey;
    exports.eatWhitespace(context);
    if (scanner.curr().value === ",") {
        scanner.next(); // eat
        exports.eatWhitespace(context);
        if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.TEXT], "Unexpected token. Repeat index parameter should only contain characters a-zA-Z.", ast_utils_1.getLocation(start, scanner.curr(), context.source))) {
            return null;
        }
        asKey = createVarReference(context);
    }
    return ({
        type: ast_1.BKExpressionType.REPEAT,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
        each: each,
        asKey: asKey,
        asValue: asValue
    });
};
var createPropReference = function (context) {
    var scanner = context.scanner;
    var start = createVarReference(context);
    var path = [start];
    while (!scanner.ended() && scanner.curr().type === tokenizer_1.PCTokenType.PERIOD) {
        scanner.next(); // eat .
        if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.TEXT])) {
            return null;
        }
        path.push(createVarReference(context));
    }
    if (path.length === 1) {
        return path[0];
    }
    return ({
        type: ast_1.BKExpressionType.PROP_REFERENCE,
        path: path,
        location: ast_utils_1.getLocation(start.location.start, scanner.curr(), scanner.source)
    });
};
var createVarReference = function (context) {
    var scanner = context.scanner;
    exports.eatWhitespace(context);
    var start = scanner.curr();
    scanner.next(); // eat name
    var optional = false;
    if (scanner.curr() && scanner.curr().type === tokenizer_1.PCTokenType.QUESTION_MARK) {
        optional = true;
        scanner.next();
    }
    return ({
        type: ast_1.BKExpressionType.VAR_REFERENCE,
        name: start.value,
        optional: optional,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    });
};
var createNotExpression = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next();
    return ({
        type: ast_1.BKExpressionType.NOT,
        value: createBKExpression(context),
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
    });
};
var createComment = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next();
    var curr;
    var value = '';
    return {
        type: ast_1.PCExpressionType.COMMENT,
        value: start.value.substr(4, start.value.length - 7),
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    };
};
// look for [[
var isBlockStarting = function (scanner) {
    return scanner.curr().type === tokenizer_1.PCTokenType.BRACKET_OPEN && scanner.peek(1).type === tokenizer_1.PCTokenType.BRACKET_OPEN;
};
// look for [[
var isBlockEnding = function (scanner) {
    return scanner.curr().type === tokenizer_1.PCTokenType.BRACKET_CLOSE && scanner.peek(1).type === tokenizer_1.PCTokenType.BRACKET_CLOSE;
};
var createStyleSheet = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var children = [];
    while (1) {
        exports.eatWhitespace(context);
        if (scanner.ended() || scanner.curr().type === tokenizer_1.PCTokenType.CLOSE_TAG) {
            break;
        }
        var child = createCSSRule(context);
        if (!child) {
            return null;
        }
        children.push(child);
    }
    return {
        type: ast_1.CSSExpressionType.SHEET,
        children: children,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    };
};
var createCSSRule = function (context) {
    var scanner = context.scanner;
    switch (scanner.curr().type) {
        case tokenizer_1.PCTokenType.AT: return createCSSAtRule(context);
        default: return createCSSStyleRuleOrDeclarationProperty(context);
    }
};
var createCSSAtRule = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next();
    var name = "";
    while (scanner.curr().type !== tokenizer_1.PCTokenType.WHITESPACE && scanner.curr().type !== tokenizer_1.PCTokenType.CURLY_BRACKET_OPEN) {
        name += scanner.curr().value;
        scanner.next();
    }
    scanner.next(); // eat name
    var params = [];
    var children = [];
    exports.eatWhitespace(context);
    while (!scanner.ended()) {
        if (scanner.curr().type === tokenizer_1.PCTokenType.CURLY_BRACKET_OPEN || scanner.curr().type === tokenizer_1.PCTokenType.SEMICOLON) {
            break;
        }
        if (scanner.curr().type === tokenizer_1.PCTokenType.SINGLE_QUOTE || scanner.curr().type === tokenizer_1.PCTokenType.DOUBLE_QUOTE) {
            params.push(exports.createString(context).value);
        }
        else {
            params.push(scanner.curr().value);
            scanner.next();
        }
    }
    var curr = scanner.curr();
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.SEMICOLON, tokenizer_1.PCTokenType.CURLY_BRACKET_OPEN])) {
        return null;
    }
    scanner.next(); // eat ; or {
    if (curr.type === tokenizer_1.PCTokenType.CURLY_BRACKET_OPEN) {
        while (!scanner.ended()) {
            exports.eatWhitespace(context);
            if (scanner.curr().type === tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE) {
                break;
            }
            var child = createCSSRule(context);
            if (!child) {
                return null;
            }
            children.push(child);
        }
        if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE], "Missing closing } character.", ast_utils_1.getTokenLocation(start, context.source))) {
            return null;
        }
        scanner.next();
    }
    return {
        type: ast_1.CSSExpressionType.AT_RULE,
        name: name,
        params: params,
        children: children,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    };
};
var createCSSStyleRuleOrDeclarationProperty = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var selectorText = "";
    while (!scanner.ended()) {
        var curr = scanner.curr();
        if (curr.type == tokenizer_1.PCTokenType.CURLY_BRACKET_OPEN || curr.type === tokenizer_1.PCTokenType.SEMICOLON || curr.type === tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE || curr.type === tokenizer_1.PCTokenType.CLOSE_TAG) {
            break;
        }
        // need to check for strings because something such as content: "; "; needs to be possible.
        if (curr.type === tokenizer_1.PCTokenType.SINGLE_QUOTE || curr.type === tokenizer_1.PCTokenType.DOUBLE_QUOTE) {
            var str = exports.createString(context);
            if (!str) {
                return null;
            }
            // TODO - define selector that is a selector AST
            selectorText += curr.value + str.value + curr.value;
        }
        else {
            selectorText += curr.value;
            scanner.next();
        }
    }
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.SEMICOLON, tokenizer_1.PCTokenType.CURLY_BRACKET_OPEN, tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE])) {
        return null;
    }
    // it's a declaration
    if (scanner.curr().type === tokenizer_1.PCTokenType.SEMICOLON || scanner.curr().type === tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE) {
        // something like this also needs to work: 
        var _a = selectorText.match(/(.+?):(.+)/) || [null, null, null], match = _a[0], name_1 = _a[1], value = _a[2];
        if (!name_1) {
            exports.addUnexpectedToken(context, null, ast_utils_1.getTokenLocation(start, context.source));
            return null;
        }
        if (!value.trim()) {
            exports.addUnexpectedToken(context, "Missing declaration value", ast_utils_1.getTokenLocation(start, context.source));
            return null;
        }
        if (scanner.curr().type === tokenizer_1.PCTokenType.SEMICOLON) {
            scanner.next(); // eat ;
        }
        return {
            type: ast_1.CSSExpressionType.DECLARATION_PROPERTY,
            location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
            name: name_1,
            value: value,
        };
    }
    scanner.next(); // eat {
    var children = [];
    exports.eatWhitespace(context);
    while (!scanner.ended() && scanner.curr().type !== tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE) {
        var child = createCSSStyleRuleOrDeclarationProperty(context);
        if (!child) {
            return null;
        }
        // todo - allow for nesteded
        children.push(child);
        exports.eatWhitespace(context);
    }
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.CURLY_BRACKET_CLOSE], "Missing closing } character.", ast_utils_1.getTokenLocation(start, context.source))) {
        return null;
    }
    scanner.next();
    selectorText = selectorText.trim();
    return {
        type: ast_1.CSSExpressionType.STYLE_RULE,
        children: children,
        selectorText: selectorText,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source)
    };
};
var createCloseTag = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next();
    var name = getTagName(context);
    if (!name) {
        exports.addUnexpectedToken(context, "Missing close tag name.", ast_utils_1.getTokenLocation(start, context.source));
        return null;
    }
    if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.GREATER_THAN], "Missing > character.", ast_utils_1.getLocation(start, scanner.curr(), context.source))) {
        return null;
    }
    scanner.next(); // eat >
    return ({
        type: ast_1.PCExpressionType.END_TAG,
        name: name,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
    });
};
var createTag = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // eat <
    var tagName = getTagName(context);
    if (!tagName) {
        exports.addUnexpectedToken(context, "Missing open tag name.", ast_utils_1.getTokenLocation(start, context.source));
        return null;
    }
    if (!scanner.ended() && !exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.WHITESPACE, tokenizer_1.PCTokenType.GREATER_THAN], "Tag name contains a character where \" \" or > is expected.", ast_utils_1.getTokenLocation(start, context.source))) {
        return null;
    }
    exports.eatWhitespace(context);
    var attributes = [];
    var modifiers = [];
    while (1) {
        if (!exports.eatWhitespace(context))
            break;
        var curr = scanner.curr();
        if (curr.type === tokenizer_1.PCTokenType.BACKSLASH || curr.type == tokenizer_1.PCTokenType.GREATER_THAN) {
            break;
        }
        if (isBlockStarting(scanner)) {
            var block = createBlock(context, createElementBlockStatement);
            if (!block) {
                return null;
            }
            modifiers.push(block);
        }
        else if (curr.type === tokenizer_1.PCTokenType.TEXT) {
            var attr = createAttribute(context);
            if (!attr) {
                return null;
            }
            attributes.push(attr);
        }
        else {
            exports.addUnexpectedToken(context);
            return null;
        }
    }
    if (!exports.testCurrTokenExists(context)) {
        return null;
    }
    if (scanner.curr().type === tokenizer_1.PCTokenType.BACKSLASH) {
        scanner.next(); // eat /
        scanner.next(); // eat >
        return ({
            type: ast_1.PCExpressionType.SELF_CLOSING_ELEMENT,
            name: tagName,
            attributes: attributes,
            modifiers: modifiers,
            location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
        });
    }
    else {
        scanner.next(); // eat >
        var endStart = scanner.curr();
        var info = getElementChildNodes(tagName, context);
        // err break
        if (!info) {
            return null;
        }
        var childNodes = info[0], endTag = info[1];
        if (!endTag) {
            exports.addUnexpectedToken(context, "Close tag is missing.", ast_utils_1.getLocation(start, endStart, context.source));
            return null;
        }
        return ({
            type: ast_1.PCExpressionType.ELEMENT,
            startTag: {
                name: tagName,
                type: ast_1.PCExpressionType.START_TAG,
                location: ast_utils_1.getLocation(start, endStart, scanner.source),
                modifiers: modifiers,
                attributes: attributes,
            },
            childNodes: childNodes,
            location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
            endTag: endTag,
        });
    }
};
var getElementChildNodes = function (tagName, context) {
    var scanner = context.scanner;
    var childNodes = [];
    // special tags
    if (tagName === "style") {
        var styleSheet = createStyleSheet(context);
        if (!styleSheet) {
            return null;
        }
        exports.eatWhitespace(context);
        if (!exports.testCurrTokenType(context, [tokenizer_1.PCTokenType.CLOSE_TAG])) {
            return null;
        }
        var endTag_1 = createCloseTag(context);
        if (!endTag_1) {
            return null;
        }
        return [[styleSheet], endTag_1];
    }
    if (tagName === "style" || tagName === "script") {
        var buffer = "";
        var start = scanner.curr();
        while (!scanner.ended()) {
            var token = scanner.curr();
            if (token.type === tokenizer_1.PCTokenType.CLOSE_TAG) {
                break;
            }
            buffer += scanner.curr().value;
            scanner.next();
        }
        return [
            [
                {
                    type: ast_1.PCExpressionType.TEXT_NODE,
                    value: buffer,
                    location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
                }
            ],
            createNodeExpression(context)
        ];
    }
    var endTag;
    while (!scanner.ended()) {
        var child = createNodeExpression(context);
        // error.
        if (!child) {
            return null;
        }
        if (child.type === ast_1.PCExpressionType.END_TAG) {
            endTag = child;
            // TODO - assert name is the same
            break;
        }
        var prevChild = childNodes.length ? childNodes[childNodes.length - 1] : null;
        childNodes.push(child);
    }
    childNodes = childNodes.filter(function (child, index, childNodes) {
        var prevChild = childNodes[index - 1];
        var nextChild = childNodes[index + 1];
        return !((!prevChild || (prevChild.type === ast_1.PCExpressionType.ELEMENT || prevChild.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT)) && (child.type === ast_1.PCExpressionType.TEXT_NODE && /^[\s\r\n\t]+$/.test(child.value)) && (!nextChild || (nextChild.type === ast_1.PCExpressionType.ELEMENT || nextChild.type === ast_1.PCExpressionType.SELF_CLOSING_ELEMENT)));
    });
    return [childNodes, endTag];
};
var getScannerCurrType = function (scanner) { return scanner.curr() && scanner.curr().type; };
var createAttribute = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var name = getTagName(context);
    var value;
    if (getScannerCurrType(scanner) === tokenizer_1.PCTokenType.EQUALS) {
        scanner.next(); // eat =
        value = createAttributeExpression(context);
        if (!value) {
            return null;
        }
    }
    return {
        type: ast_1.PCExpressionType.ATTRIBUTE,
        name: name,
        value: value,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
    };
};
var createAttributeExpression = function (context) {
    if (!exports.testCurrTokenExists(context)) {
        return null;
    }
    var scanner = context.scanner;
    switch (getScannerCurrType(scanner)) {
        case tokenizer_1.PCTokenType.SINGLE_QUOTE:
        case tokenizer_1.PCTokenType.DOUBLE_QUOTE: return createAttributeString(context);
        default: {
            if (isBlockStarting(scanner)) {
                return createBlock(context, createTextAttributeBlockStatement);
            }
            exports.addUnexpectedToken(context);
            return null;
        }
    }
};
var testClosingToken = function (context, start) { return exports.testCurrTokenType(context, [start.type], "Missing closing " + start.value + " character.", ast_utils_1.getTokenLocation(start, context.source)); };
var createAttributeString = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    var values = [];
    var buffer = "";
    var hasBlocks = false;
    scanner.next(); // eat "
    while (!scanner.ended()) {
        var curr = scanner.curr();
        if (curr.type === start.type) {
            break;
        }
        if (isBlockStarting(scanner)) {
            hasBlocks = true;
            var block = createBlock(context, createTextAttributeBlockStatement);
            if (!block) {
                return null;
            }
            values.push(block);
        }
        else {
            scanner.next();
            values.push(({
                type: ast_1.PCExpressionType.STRING,
                value: curr.value,
                location: ast_utils_1.getLocation(curr.pos, scanner.curr(), scanner.source)
            }));
        }
    }
    if (!testClosingToken(context, start)) {
        return null;
    }
    scanner.next(); // eat '
    var location = ast_utils_1.getLocation(start, scanner.curr(), scanner.source);
    if (hasBlocks) {
        return ({
            type: ast_1.PCExpressionType.STRING_BLOCK,
            location: location,
            values: values,
        });
    }
    else {
        return ({
            type: ast_1.PCExpressionType.STRING,
            location: location,
            value: values.map(function (_a) {
                var value = _a.value;
                return value;
            }).join("")
        });
    }
};
var createTextNode = function (context) {
    var scanner = context.scanner;
    var start = scanner.curr();
    scanner.next(); // char
    var value = start.value;
    while (!scanner.ended()) {
        var curr = scanner.curr();
        if (curr.type === tokenizer_1.PCTokenType.COMMENT || curr.type === tokenizer_1.PCTokenType.LESS_THAN || curr.type == tokenizer_1.PCTokenType.CLOSE_TAG || isBlockStarting(scanner)) {
            break;
        }
        scanner.next();
        value += curr.value;
    }
    return ({
        type: ast_1.PCExpressionType.TEXT_NODE,
        value: value,
        location: ast_utils_1.getLocation(start, scanner.curr(), scanner.source),
    });
};
exports.eatWhitespace = function (context) {
    var scanner = context.scanner;
    while (!scanner.ended() && scanner.curr().type === tokenizer_1.PCTokenType.WHITESPACE) {
        scanner.next();
    }
    return !scanner.ended();
};
var getTagName = function (context) {
    var scanner = context.scanner;
    var name = "";
    while (!scanner.ended() && /[a-zA-Z-][a-zA-Z0-9-]*/.test(scanner.curr().value)) {
        name += scanner.curr().value;
        scanner.next();
    }
    if (!name) {
        return null;
    }
    return name;
};
exports.throwUnexpectedToken = function (source, token) {
    if (!token) {
        throw new Error("Unexpected end of file (missing closing expression).");
    }
    var location = ast_utils_1.getPosition(token, source);
    throw new Error("Unexpected token \"" + token.value + "\" at " + location.line + ":" + location.column);
};
exports.addUnexpectedToken = function (context, message, refLocation) {
    var token = context.scanner.curr();
    var location = refLocation || (context.startToken ? ast_utils_1.getLocation(context.startToken, context.scanner.curr(), context.source) : {
        start: ast_utils_1.getPosition(token || context.scanner.source.length - 1, context.scanner.source),
        end: ast_utils_1.getPosition(token ? token.pos + token.value.length : context.scanner.source.length, context.scanner.source)
    });
    context.diagnostics.push({
        type: parser_utils_1.DiagnosticType.ERROR,
        location: location,
        message: message || (token ? "Unexpected token." : "Unexpected end of file."),
        filePath: context.filePath,
    });
    return true;
};
exports.testCurrTokenExists = function (context, message, refLocation) {
    var token = context.scanner.curr();
    if (!token) {
        exports.addUnexpectedToken(context, message, refLocation);
        return false;
    }
    return true;
};
exports.testCurrTokenType = function (context, types, message, refLocation) {
    var token = context.scanner.curr();
    if (!token || types.indexOf(token.type) === -1) {
        exports.addUnexpectedToken(context, message, refLocation);
        return false;
    }
    return true;
};
//# sourceMappingURL=parser.js.map