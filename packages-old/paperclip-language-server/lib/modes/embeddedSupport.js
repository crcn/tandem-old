"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = require("../utils/strings");
var htmlScanner_1 = require("./template/parser/htmlScanner");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var htmlScanner_2 = require("./template/parser/htmlScanner");
var defaultType = {
    template: 'paperclip',
    script: 'javascript',
    style: 'css'
};
function getDocumentRegions(document) {
    var regions = [];
    var text = document.getText();
    var scanner = htmlScanner_1.createScanner(text);
    var lastTagName = '';
    var lastAttributeName = '';
    var languageIdFromType = '';
    var importedScripts = [];
    var token = scanner.scan();
    while (token !== htmlScanner_2.TokenType.EOS) {
        switch (token) {
            case htmlScanner_2.TokenType.Styles:
                regions.push({
                    languageId: /^(sass|scss|less|postcss|stylus)$/.test(languageIdFromType)
                        ? languageIdFromType
                        : defaultType['style'],
                    start: scanner.getTokenOffset(),
                    end: scanner.getTokenEnd(),
                    type: 'style'
                });
                languageIdFromType = '';
                break;
            case htmlScanner_2.TokenType.Script:
                regions.push({
                    languageId: languageIdFromType ? languageIdFromType : defaultType['script'],
                    start: scanner.getTokenOffset(),
                    end: scanner.getTokenEnd(),
                    type: 'script'
                });
                languageIdFromType = '';
                break;
            case htmlScanner_2.TokenType.StartTag:
                var tagName = scanner.getTokenText();
                if (tagName === 'template') {
                    var templateRegion = scanTemplateRegion(scanner, text);
                    if (templateRegion) {
                        regions.push(templateRegion);
                    }
                }
                lastTagName = tagName;
                lastAttributeName = '';
                break;
            case htmlScanner_2.TokenType.AttributeName:
                lastAttributeName = scanner.getTokenText();
                break;
            case htmlScanner_2.TokenType.AttributeValue:
                if (lastAttributeName === 'lang') {
                    languageIdFromType = getLanguageIdFromLangAttr(scanner.getTokenText());
                }
                else {
                    if (lastAttributeName === 'src' && lastTagName.toLowerCase() === 'script') {
                        var value = scanner.getTokenText();
                        if (value[0] === "'" || value[0] === '"') {
                            value = value.substr(1, value.length - 1);
                        }
                        importedScripts.push(value);
                    }
                }
                lastAttributeName = '';
                break;
            case htmlScanner_2.TokenType.EndTagClose:
                lastAttributeName = '';
                languageIdFromType = '';
                break;
        }
        token = scanner.scan();
    }
    return {
        getLanguageRanges: function (range) { return getLanguageRanges(document, regions, range); },
        getEmbeddedDocument: function (languageId) { return getEmbeddedDocument(document, regions, languageId); },
        getEmbeddedDocumentByType: function (type) { return getEmbeddedDocumentByType(document, regions, type); },
        getLanguageAtPosition: function (position) { return getLanguageAtPosition(document, regions, position); },
        getLanguagesInDocument: function () { return getLanguagesInDocument(document, regions); },
        getImportedScripts: function () { return importedScripts; }
    };
}
exports.getDocumentRegions = getDocumentRegions;
function scanTemplateRegion(scanner, text) {
    var languageId = 'paperclip';
    var token;
    var start = 0;
    var end;
    // Scan until finding matching template EndTag
    // Also record immediate next StartTagClose to find start
    var unClosedTemplate = 1;
    var lastAttributeName = null;
    while (unClosedTemplate !== 0) {
        token = scanner.scan();
        if (token === htmlScanner_2.TokenType.EOS) {
            return null;
        }
        if (start === 0) {
            if (token === htmlScanner_2.TokenType.AttributeName) {
                lastAttributeName = scanner.getTokenText();
            }
            else if (token === htmlScanner_2.TokenType.AttributeValue) {
                if (lastAttributeName === 'lang') {
                    languageId = getLanguageIdFromLangAttr(scanner.getTokenText());
                }
                lastAttributeName = null;
            }
            else if (token === htmlScanner_2.TokenType.StartTagClose) {
                start = scanner.getTokenEnd();
            }
        }
        else {
            if (token === htmlScanner_2.TokenType.StartTag && scanner.getTokenText() === 'template') {
                unClosedTemplate++;
            }
            else if (token === htmlScanner_2.TokenType.EndTag && scanner.getTokenText() === 'template') {
                unClosedTemplate--;
                // test leading </template>
                var charPosBeforeEndTag = scanner.getTokenOffset() - 3;
                if (text[charPosBeforeEndTag] === '\n') {
                    break;
                }
            }
            else if (token === htmlScanner_2.TokenType.Unknown) {
                if (scanner.getTokenText().charAt(0) === '<') {
                    var offset = scanner.getTokenOffset();
                    var unknownText = text.substr(offset, 11);
                    if (unknownText === '</template>') {
                        unClosedTemplate--;
                        // test leading </template>
                        if (text[offset - 1] === '\n') {
                            return {
                                languageId: languageId,
                                start: start,
                                end: offset,
                                type: 'template'
                            };
                        }
                    }
                }
            }
        }
    }
    // In EndTag, find end
    // -2 for </
    end = scanner.getTokenOffset() - 2;
    return {
        languageId: languageId,
        start: start,
        end: end,
        type: 'template'
    };
}
function getLanguageIdFromLangAttr(lang) {
    var languageIdFromType = strings_1.removeQuotes(lang);
    if (languageIdFromType === 'jade') {
        languageIdFromType = 'pug';
    }
    if (languageIdFromType === 'ts') {
        languageIdFromType = 'typescript';
    }
    return languageIdFromType;
}
function getLanguageRanges(document, regions, range) {
    var result = [];
    var currentPos = range ? range.start : vscode_languageserver_types_1.Position.create(0, 0);
    var currentOffset = range ? document.offsetAt(range.start) : 0;
    var endOffset = range ? document.offsetAt(range.end) : document.getText().length;
    for (var _i = 0, regions_1 = regions; _i < regions_1.length; _i++) {
        var region = regions_1[_i];
        if (region.end > currentOffset && region.start < endOffset) {
            var start = Math.max(region.start, currentOffset);
            var startPos = document.positionAt(start);
            if (currentOffset < region.start) {
                result.push({
                    start: currentPos,
                    end: startPos,
                    languageId: 'paperclip'
                });
            }
            var end = Math.min(region.end, endOffset);
            var endPos = document.positionAt(end);
            if (end > region.start) {
                result.push({
                    start: startPos,
                    end: endPos,
                    languageId: region.languageId
                });
            }
            currentOffset = end;
            currentPos = endPos;
        }
    }
    if (currentOffset < endOffset) {
        var endPos = range ? range.end : document.positionAt(endOffset);
        result.push({
            start: currentPos,
            end: endPos,
            languageId: 'paperclip'
        });
    }
    return result;
}
function getLanguagesInDocument(document, regions) {
    var result = ['paperclip'];
    for (var _i = 0, regions_2 = regions; _i < regions_2.length; _i++) {
        var region = regions_2[_i];
        if (region.languageId && result.indexOf(region.languageId) === -1) {
            result.push(region.languageId);
        }
    }
    return result;
}
function getLanguageAtPosition(document, regions, position) {
    var offset = document.offsetAt(position);
    for (var _i = 0, regions_3 = regions; _i < regions_3.length; _i++) {
        var region = regions_3[_i];
        if (region.start <= offset) {
            if (offset <= region.end) {
                return region.languageId;
            }
        }
        else {
            break;
        }
    }
    return 'paperclip';
}
function getEmbeddedDocument(document, contents, languageId) {
    var oldContent = document.getText();
    var result = '';
    for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
        var c = contents_1[_i];
        if (c.languageId === languageId) {
            result = oldContent.substring(0, c.start).replace(/./g, ' ');
            result += oldContent.substring(c.start, c.end);
            break;
        }
    }
    return vscode_languageserver_types_1.TextDocument.create(document.uri, languageId, document.version, result);
}
function getEmbeddedDocumentByType(document, contents, type) {
    var oldContent = document.getText();
    var result = '';
    for (var _i = 0, contents_2 = contents; _i < contents_2.length; _i++) {
        var c = contents_2[_i];
        if (c.type === type) {
            result = oldContent.substring(0, c.start).replace(/./g, ' ');
            result += oldContent.substring(c.start, c.end);
            return vscode_languageserver_types_1.TextDocument.create(document.uri, c.languageId, document.version, result);
        }
    }
    return vscode_languageserver_types_1.TextDocument.create(document.uri, defaultType[type], document.version, result);
}
//# sourceMappingURL=embeddedSupport.js.map