"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var emmet = require("vscode-emmet-helper");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var StylusSupremacy = require("stylus-supremacy");
var emmet_1 = require("../emmet");
var languageModelCache_1 = require("../../languageModelCache");
var completion_item_1 = require("./completion-item");
var symbols_finder_1 = require("./symbols-finder");
var stylus_hover_1 = require("./stylus-hover");
function getStylusMode(documentRegions) {
    var embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) {
        return documentRegions.get(document).getEmbeddedDocument('stylus');
    });
    var baseIndentShifted = false;
    var config = {};
    return {
        getId: function () { return 'stylus'; },
        configure: function (c) {
            baseIndentShifted = _.get(c, 'tandem.paperclip.format.styleInitialIndent', false);
            config = c;
        },
        onDocumentRemoved: function () { },
        dispose: function () { },
        doComplete: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            var emmetCompletions = emmet.doComplete(document, position, 'stylus', {
                useNewEmmet: true,
                showExpandedAbbreviation: true,
                showAbbreviationSuggestions: true,
                syntaxProfiles: {},
                variables: {}
            });
            var emmetItems = _.map(emmetCompletions.items, function (i) {
                return __assign({}, i, { sortText: emmet_1.Priority.Emmet + i.label });
            });
            var lsCompletions = completion_item_1.provideCompletionItems(embedded, position);
            var lsItems = _.map(lsCompletions.items, function (i) {
                return __assign({}, i, { sortText: emmet_1.Priority.Platform + i.label });
            });
            return {
                isIncomplete: true,
                items: _.concat(emmetItems, lsItems)
            };
        },
        findDocumentSymbols: function (document) {
            var embedded = embeddedDocuments.get(document);
            return symbols_finder_1.provideDocumentSymbols(embedded);
        },
        doHover: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            return stylus_hover_1.stylusHover(embedded, position);
        },
        format: function (document, range, formatParams) {
            if (config.tandem.paperclip.format.defaultFormatter.stylus === 'none') {
                return [];
            }
            var embedded = embeddedDocuments.get(document);
            var inputText = embedded.getText();
            var tabStopChar = formatParams.insertSpaces ? ' '.repeat(formatParams.tabSize) : '\t';
            // Note that this would have been `document.eol` ideally
            var newLineChar = inputText.includes('\r\n') ? '\r\n' : '\n';
            // Determine the base indentation for the multi-line Stylus content
            var baseIndent = '';
            if (range.start.line !== range.end.line) {
                var styleTagLine = document.getText().split(/\r?\n/)[range.start.line];
                if (styleTagLine) {
                    baseIndent = _.get(styleTagLine.match(/^(\t|\s)+/), '0', '');
                }
            }
            // Add one more indentation when `paperclip.format.styleInitialIndent` is set to `true`
            if (baseIndentShifted) {
                baseIndent += tabStopChar;
            }
            // Build the formatting options for Stylus Supremacy
            // See https://thisismanta.github.io/stylus-supremacy/#options
            var stylusSupremacyFormattingOptions = StylusSupremacy.createFormattingOptions(config.stylusSupremacy || {});
            var formattingOptions = __assign({}, stylusSupremacyFormattingOptions, { tabStopChar: tabStopChar, newLineChar: '\n' });
            var formattedText = StylusSupremacy.format(inputText, formattingOptions);
            // Add the base indentation and correct the new line characters
            var outputText = ((range.start.line !== range.end.line ? '\n' : '') + formattedText)
                .split(/\n/)
                .map(function (line) { return (line.length > 0 ? baseIndent + line : ''); })
                .join(newLineChar);
            return [vscode_languageserver_types_1.TextEdit.replace(range, outputText)];
        }
    };
}
exports.getStylusMode = getStylusMode;
exports.wordPattern = /(#?-?\d*\.\d\w*%?)|([$@#!.:]?[\w-?]+%?)|[$@#!.]/g;
//# sourceMappingURL=index.js.map