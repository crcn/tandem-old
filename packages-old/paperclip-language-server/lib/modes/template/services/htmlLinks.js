"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlScanner_1 = require("../parser/htmlScanner");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var vscode_uri_1 = require("vscode-uri");
function stripQuotes(url) {
    return url.replace(/^'([^']*)'$/, function (substr, match1) { return match1; }).replace(/^"([^"]*)"$/, function (substr, match1) { return match1; });
}
function getWorkspaceUrl(modelAbsoluteUri, tokenContent, documentContext, base) {
    if (/^\s*javascript\:/i.test(tokenContent) || /^\s*\#/i.test(tokenContent) || /[\n\r]/.test(tokenContent)) {
        return null;
    }
    tokenContent = tokenContent.replace(/^\s*/g, '');
    if (/^https?:\/\//i.test(tokenContent) || /^file:\/\//i.test(tokenContent)) {
        // Absolute link that needs no treatment
        return tokenContent;
    }
    if (/^\/\//i.test(tokenContent)) {
        // Absolute link (that does not name the protocol)
        var pickedScheme = 'http';
        if (modelAbsoluteUri.scheme === 'https') {
            pickedScheme = 'https';
        }
        return pickedScheme + ':' + tokenContent.replace(/^\s*/g, '');
    }
    if (documentContext) {
        return documentContext.resolveReference(tokenContent, base);
    }
    return tokenContent;
}
function createLink(document, documentContext, attributeValue, startOffset, endOffset, base) {
    var documentUri = vscode_uri_1.default.parse(document.uri);
    var tokenContent = stripQuotes(attributeValue);
    if (tokenContent.length === 0) {
        return null;
    }
    if (tokenContent.length < attributeValue.length) {
        startOffset++;
        endOffset--;
    }
    var workspaceUrl = getWorkspaceUrl(documentUri, tokenContent, documentContext, base);
    if (!workspaceUrl || !isValidURI(workspaceUrl)) {
        return null;
    }
    return {
        range: vscode_languageserver_types_1.Range.create(document.positionAt(startOffset), document.positionAt(endOffset)),
        target: workspaceUrl
    };
}
function isValidURI(uri) {
    try {
        vscode_uri_1.default.parse(uri);
        return true;
    }
    catch (e) {
        return false;
    }
}
function findDocumentLinks(document, documentContext) {
    var newLinks = [];
    var scanner = htmlScanner_1.createScanner(document.getText(), 0);
    var token = scanner.scan();
    var afterHrefOrSrc = false;
    var afterBase = false;
    var base = undefined;
    while (token !== htmlScanner_1.TokenType.EOS) {
        switch (token) {
            case htmlScanner_1.TokenType.StartTag:
                if (!base) {
                    var tagName = scanner.getTokenText().toLowerCase();
                    afterBase = tagName === 'base';
                }
                break;
            case htmlScanner_1.TokenType.AttributeName:
                var attributeName = scanner.getTokenText().toLowerCase();
                afterHrefOrSrc = attributeName === 'src' || attributeName === 'href';
                break;
            case htmlScanner_1.TokenType.AttributeValue:
                if (afterHrefOrSrc) {
                    var attributeValue = scanner.getTokenText();
                    var link = createLink(document, documentContext, attributeValue, scanner.getTokenOffset(), scanner.getTokenEnd(), base);
                    if (link) {
                        newLinks.push(link);
                    }
                    if (afterBase && typeof base === 'undefined') {
                        base = stripQuotes(attributeValue);
                    }
                    afterBase = false;
                    afterHrefOrSrc = false;
                }
                break;
        }
        token = scanner.scan();
    }
    return newLinks;
}
exports.findDocumentLinks = findDocumentLinks;
//# sourceMappingURL=htmlLinks.js.map