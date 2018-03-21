"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var parser_1 = require("./parser");
var cssSchema = require("./css-schema");
var built_in_1 = require("./built-in");
var _ = require("lodash");
function prepareName(name) {
    return name.replace(/\{|\}/g, '').trim();
}
/**
 * Naive check whether currentWord is class or id
 * @param {String} currentWord
 * @return {Boolean}
 */
function isClassOrId(currentWord) {
    return /^[.#&]/.test(currentWord);
}
exports.isClassOrId = isClassOrId;
/**
 * Naive check whether currentWord is at rule
 * @param {String} currentWord
 * @return {Boolean}
 */
function isAtRule(currentWord) {
    return _.startsWith(currentWord, '@');
}
exports.isAtRule = isAtRule;
/**
 * Naive check whether currentWord is value for given property
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {Boolean}
 */
function isValue(cssSchema, currentWord) {
    var property = getPropertyName(currentWord);
    return !!property && Boolean(findPropertySchema(cssSchema, property));
}
exports.isValue = isValue;
/**
 * Formats property name
 * @param {String} currentWord
 * @return {String}
 */
function getPropertyName(currentWord) {
    return currentWord
        .trim()
        .replace(':', ' ')
        .split(' ')[0];
}
exports.getPropertyName = getPropertyName;
/**
 * Search for property in cssSchema
 * @param {Object} cssSchema
 * @param {String} property
 * @return {Object}
 */
function findPropertySchema(cssSchema, property) {
    var properties = cssSchema.data.css.properties;
    return _.find(properties, function (item) { return item.name === property; });
}
exports.findPropertySchema = findPropertySchema;
/**
 * Handler for variables
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _variableSymbol(node, text, currentWord) {
    var name = node.name;
    var lineno = Number(node.val.lineno) - 1;
    var completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.detail = text[lineno].trim();
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Variable;
    return completionItem;
}
/**
 * Handler for function
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {CompletionItem}
 */
function _functionSymbol(node, text) {
    var name = node.name;
    var completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Function;
    return completionItem;
}
/**
 * Handler for selectors
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function _selectorSymbol(node, text, currentWord) {
    var firstSegment = node.segments[0];
    var name = firstSegment.string
        ? node.segments.map(function (s) { return s.string; }).join('')
        : firstSegment.nodes.map(function (s) { return s.name; }).join('');
    var completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Class;
    return completionItem;
}
/**
 * Handler for selector call symbols
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {CompletionItem}
 */
function _selectorCallSymbol(node, text) {
    var lineno = Number(node.lineno) - 1;
    var name = prepareName(text[lineno]);
    var completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Class;
    return completionItem;
}
function isVisible(useSite, defSite) {
    if (!useSite || !defSite) {
        return true;
    }
    if (useSite.length < defSite.length) {
        return false;
    }
    for (var _i = 0, _a = _.zip(useSite, defSite); _i < _a.length; _i++) {
        var _b = _a[_i], use = _b[0], def = _b[1];
        if (use > def) {
            return false;
        }
    }
    return true;
}
/**
 * Returns completion items lists from document symbols
 * @param {String} text
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getAllSymbols(text, currentWord, position) {
    var ast = parser_1.buildAst(text);
    if (!ast) {
        return [];
    }
    var node = parser_1.findNodeAtPosition(ast, position);
    var scope = node ? node.__scope : undefined;
    var splittedText = text.split('\n');
    var rawSymbols = parser_1.flattenAndFilterAst(ast).filter(function (item) { return ['Media', 'Keyframes', 'Atrule', 'Import', 'Require', 'Supports', 'Literal'].indexOf(item.__type) === -1; });
    return _.compact(rawSymbols.map(function (item) {
        if (!isVisible(scope, item.__scope)) {
            return undefined;
        }
        if (parser_1.isVariableNode(item)) {
            return _variableSymbol(item, splittedText, currentWord);
        }
        if (parser_1.isFunctionNode(item)) {
            return _functionSymbol(item, splittedText);
        }
        if (parser_1.isSelectorNode(item)) {
            return _selectorSymbol(item, splittedText, currentWord);
        }
        if (parser_1.isSelectorCallNode(item)) {
            return _selectorCallSymbol(item, splittedText);
        }
    }));
}
exports.getAllSymbols = getAllSymbols;
/**
 * Returns at rules list for completion
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getAtRules(cssSchema, currentWord) {
    if (!isAtRule(currentWord)) {
        return [];
    }
    return cssSchema.data.css.atdirectives.map(function (property) {
        var completionItem = vscode_languageserver_types_1.CompletionItem.create(property.name);
        completionItem.detail = property.desc;
        completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Keyword;
        return completionItem;
    });
}
exports.getAtRules = getAtRules;
/**
 * Returns property list for completion
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getProperties(cssSchema, currentWord, useSeparator) {
    if (isClassOrId(currentWord) || isAtRule(currentWord)) {
        return [];
    }
    return cssSchema.data.css.properties.map(function (property) {
        var completionItem = vscode_languageserver_types_1.CompletionItem.create(property.name);
        completionItem.insertText = property.name + (useSeparator ? ': ' : ' ');
        completionItem.detail = property.desc;
        completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Property;
        return completionItem;
    });
}
exports.getProperties = getProperties;
/**
 * Returns values for current property for completion list
 * @param {Object} cssSchema
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getValues(cssSchema, currentWord) {
    var property = getPropertyName(currentWord);
    var result = findPropertySchema(cssSchema, property);
    var values = result && result.values;
    if (!values) {
        return [];
    }
    return values.map(function (property) {
        var completionItem = vscode_languageserver_types_1.CompletionItem.create(property.name);
        completionItem.documentation = property.desc;
        completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Value;
        return completionItem;
    });
}
exports.getValues = getValues;
function provideCompletionItems(document, position) {
    var start = document.offsetAt(vscode_languageserver_types_1.Position.create(position.line, 0));
    var end = document.offsetAt(position);
    var text = document.getText();
    var currentWord = text.slice(start, end).trim();
    var value = isValue(cssSchema, currentWord);
    var completions = [];
    if (value) {
        var values = getValues(cssSchema, currentWord);
        var symbols = getAllSymbols(text, currentWord, position).filter(function (item) { return item.kind === vscode_languageserver_types_1.CompletionItemKind.Variable || item.kind === vscode_languageserver_types_1.CompletionItemKind.Function; });
        completions = completions.concat(values, symbols, built_in_1.default);
    }
    else {
        var atRules = getAtRules(cssSchema, currentWord);
        var properties = getProperties(cssSchema, currentWord, false);
        var symbols = getAllSymbols(text, currentWord, position).filter(function (item) { return item.kind !== vscode_languageserver_types_1.CompletionItemKind.Variable; });
        completions = completions.concat(properties, atRules, symbols);
    }
    return {
        isIncomplete: false,
        items: completions
    };
}
exports.provideCompletionItems = provideCompletionItems;
//# sourceMappingURL=completion-item.js.map