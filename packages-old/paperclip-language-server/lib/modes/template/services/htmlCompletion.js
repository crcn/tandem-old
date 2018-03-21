"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var htmlScanner_1 = require("../parser/htmlScanner");
var emmet = require("vscode-emmet-helper");
function doComplete(document, position, htmlDocument, tagProviders) {
    var result = {
        isIncomplete: false,
        items: []
    };
    var offset = document.offsetAt(position);
    var node = htmlDocument.findNodeBefore(offset);
    if (!node) {
        return result;
    }
    var text = document.getText();
    var scanner = htmlScanner_1.createScanner(text, node.start);
    var currentTag;
    var currentAttributeName;
    function getReplaceRange(replaceStart, replaceEnd) {
        if (replaceEnd === void 0) { replaceEnd = offset; }
        if (replaceStart > offset) {
            replaceStart = offset;
        }
        return { start: document.positionAt(replaceStart), end: document.positionAt(replaceEnd) };
    }
    function collectOpenTagSuggestions(afterOpenBracket, tagNameEnd) {
        var range = getReplaceRange(afterOpenBracket, tagNameEnd);
        tagProviders.forEach(function (provider) {
            var priority = provider.priority;
            provider.collectTags(function (tag, label) {
                result.items.push({
                    label: tag,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                    documentation: label,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, tag),
                    sortText: priority + tag,
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                });
            });
        });
        return result;
    }
    function getLineIndent(offset) {
        var start = offset;
        while (start > 0) {
            var ch = text.charAt(start - 1);
            if ('\n\r'.indexOf(ch) >= 0) {
                return text.substring(start, offset);
            }
            if (!isWhiteSpace(ch)) {
                return null;
            }
            start--;
        }
        return text.substring(0, offset);
    }
    function collectCloseTagSuggestions(afterOpenBracket, matchingOnly, tagNameEnd) {
        if (tagNameEnd === void 0) { tagNameEnd = offset; }
        var range = getReplaceRange(afterOpenBracket, tagNameEnd);
        var closeTag = isFollowedBy(text, tagNameEnd, htmlScanner_1.ScannerState.WithinEndTag, htmlScanner_1.TokenType.EndTagClose) ? '' : '>';
        var curr = node;
        while (curr) {
            var tag = curr.tag;
            if (tag && (!curr.closed || curr.endTagStart > offset)) {
                var item = {
                    label: '/' + tag,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                    filterText: '/' + tag + closeTag,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, '/' + tag + closeTag),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                };
                var startIndent = getLineIndent(curr.start);
                var endIndent = getLineIndent(afterOpenBracket - 1);
                if (startIndent !== null && endIndent !== null && startIndent !== endIndent) {
                    var insertText = startIndent + '</' + tag + closeTag;
                    (item.textEdit = vscode_languageserver_types_1.TextEdit.replace(getReplaceRange(afterOpenBracket - 1 - endIndent.length), insertText)),
                        (item.filterText = endIndent + '</' + tag + closeTag);
                }
                result.items.push(item);
                return result;
            }
            curr = curr.parent;
        }
        if (matchingOnly) {
            return result;
        }
        tagProviders.forEach(function (provider) {
            provider.collectTags(function (tag, label) {
                result.items.push({
                    label: '/' + tag,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                    documentation: label,
                    filterText: '/' + tag + closeTag,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, '/' + tag + closeTag),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                });
            });
        });
        return result;
    }
    function collectTagSuggestions(tagStart, tagEnd) {
        collectOpenTagSuggestions(tagStart, tagEnd);
        collectCloseTagSuggestions(tagStart, true, tagEnd);
        return result;
    }
    function collectAttributeNameSuggestions(nameStart, nameEnd) {
        if (nameEnd === void 0) { nameEnd = offset; }
        var execArray = /^[:@]/.exec(scanner.getTokenText());
        var filterPrefix = execArray ? execArray[0] : '';
        var start = filterPrefix ? nameStart + 1 : nameStart;
        var range = getReplaceRange(start, nameEnd);
        var value = isFollowedBy(text, nameEnd, htmlScanner_1.ScannerState.AfterAttributeName, htmlScanner_1.TokenType.DelimiterAssign)
            ? ''
            : '="$1"';
        var tag = currentTag.toLowerCase();
        tagProviders.forEach(function (provider) {
            var priority = provider.priority;
            provider.collectAttributes(tag, function (attribute, type, documentation) {
                if ((type === 'event' && filterPrefix !== '@') || (type !== 'event' && filterPrefix === '@')) {
                    return;
                }
                var codeSnippet = attribute;
                if (type !== 'v' && value.length) {
                    codeSnippet = codeSnippet + value;
                }
                result.items.push({
                    label: attribute,
                    kind: type === 'event' ? vscode_languageserver_types_1.CompletionItemKind.Function : vscode_languageserver_types_1.CompletionItemKind.Value,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, codeSnippet),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
                    sortText: priority + attribute,
                    documentation: documentation
                });
            });
        });
        return result;
    }
    function collectAttributeValueSuggestions(valueStart, valueEnd) {
        var range;
        var addQuotes;
        if (valueEnd && offset > valueStart && offset <= valueEnd && text[valueStart] === '"') {
            // inside attribute
            if (valueEnd > offset && text[valueEnd - 1] === '"') {
                valueEnd--;
            }
            var wsBefore = getWordStart(text, offset, valueStart + 1);
            var wsAfter = getWordEnd(text, offset, valueEnd);
            range = getReplaceRange(wsBefore, wsAfter);
            addQuotes = false;
        }
        else {
            range = getReplaceRange(valueStart, valueEnd);
            addQuotes = true;
        }
        var tag = currentTag.toLowerCase();
        var attribute = currentAttributeName.toLowerCase();
        tagProviders.forEach(function (provider) {
            provider.collectValues(tag, attribute, function (value) {
                var insertText = addQuotes ? '"' + value + '"' : value;
                result.items.push({
                    label: value,
                    filterText: insertText,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Unit,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, insertText),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                });
            });
        });
        return result;
    }
    function scanNextForEndPos(nextToken) {
        if (offset === scanner.getTokenEnd()) {
            token = scanner.scan();
            if (token === nextToken && scanner.getTokenOffset() === offset) {
                return scanner.getTokenEnd();
            }
        }
        return offset;
    }
    var token = scanner.scan();
    while (token !== htmlScanner_1.TokenType.EOS && scanner.getTokenOffset() <= offset) {
        switch (token) {
            case htmlScanner_1.TokenType.StartTagOpen:
                if (scanner.getTokenEnd() === offset) {
                    var endPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                    return collectTagSuggestions(offset, endPos);
                }
                break;
            case htmlScanner_1.TokenType.StartTag:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectOpenTagSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                currentTag = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.AttributeName:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectAttributeNameSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                currentAttributeName = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.DelimiterAssign:
                if (scanner.getTokenEnd() === offset) {
                    return collectAttributeValueSuggestions(scanner.getTokenEnd());
                }
                break;
            case htmlScanner_1.TokenType.AttributeValue:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectAttributeValueSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                break;
            case htmlScanner_1.TokenType.Whitespace:
                if (offset <= scanner.getTokenEnd()) {
                    switch (scanner.getScannerState()) {
                        case htmlScanner_1.ScannerState.AfterOpeningStartTag:
                            var startPos = scanner.getTokenOffset();
                            var endTagPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                            return collectTagSuggestions(startPos, endTagPos);
                        case htmlScanner_1.ScannerState.WithinTag:
                        case htmlScanner_1.ScannerState.AfterAttributeName:
                            return collectAttributeNameSuggestions(scanner.getTokenEnd());
                        case htmlScanner_1.ScannerState.BeforeAttributeValue:
                            return collectAttributeValueSuggestions(scanner.getTokenEnd());
                        case htmlScanner_1.ScannerState.AfterOpeningEndTag:
                            return collectCloseTagSuggestions(scanner.getTokenOffset() - 1, false);
                    }
                }
                break;
            case htmlScanner_1.TokenType.EndTagOpen:
                if (offset <= scanner.getTokenEnd()) {
                    var afterOpenBracket = scanner.getTokenOffset() + 1;
                    var endOffset = scanNextForEndPos(htmlScanner_1.TokenType.EndTag);
                    return collectCloseTagSuggestions(afterOpenBracket, false, endOffset);
                }
                break;
            case htmlScanner_1.TokenType.EndTag:
                if (offset <= scanner.getTokenEnd()) {
                    var start = scanner.getTokenOffset() - 1;
                    while (start >= 0) {
                        var ch = text.charAt(start);
                        if (ch === '/') {
                            return collectCloseTagSuggestions(start, false, scanner.getTokenEnd());
                        }
                        else if (!isWhiteSpace(ch)) {
                            break;
                        }
                        start--;
                    }
                }
                break;
            default:
                if (offset <= scanner.getTokenEnd()) {
                    return emmet.doComplete(document, position, 'html', {
                        useNewEmmet: true,
                        showExpandedAbbreviation: 'always',
                        showAbbreviationSuggestions: true,
                        syntaxProfiles: {},
                        variables: {},
                        preferences: {}
                    });
                }
                break;
        }
        token = scanner.scan();
    }
    return result;
}
exports.doComplete = doComplete;
function isWhiteSpace(s) {
    return /^\s*$/.test(s);
}
function isFollowedBy(s, offset, intialState, expectedToken) {
    var scanner = htmlScanner_1.createScanner(s, offset, intialState);
    var token = scanner.scan();
    while (token === htmlScanner_1.TokenType.Whitespace) {
        token = scanner.scan();
    }
    return token === expectedToken;
}
function getWordStart(s, offset, limit) {
    while (offset > limit && !isWhiteSpace(s[offset - 1])) {
        offset--;
    }
    return offset;
}
function getWordEnd(s, offset, limit) {
    while (offset < limit && !isWhiteSpace(s[offset])) {
        offset++;
    }
    return offset;
}
//# sourceMappingURL=htmlCompletion.js.map