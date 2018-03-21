"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var vscode_css_languageservice_1 = require("vscode-css-languageservice");
var _ = require("lodash");
var emmet = require("vscode-emmet-helper");
var emmet_1 = require("./emmet");
var languageModelCache_1 = require("../languageModelCache");
var paths_1 = require("../../utils/paths");
var prettier_1 = require("../../utils/prettier");
var nullMode_1 = require("../nullMode");
function getCSSMode(documentRegions) {
    var languageService = vscode_css_languageservice_1.getCSSLanguageService();
    return getStyleMode('css', languageService, documentRegions);
}
exports.getCSSMode = getCSSMode;
function getStyleMode(languageId, languageService, documentRegions) {
    var embeddedDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) {
        return documentRegions.get(document).getEmbeddedDocument(languageId);
    });
    var stylesheets = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return languageService.parseStylesheet(document); });
    var config = {};
    return {
        getId: function () {
            return languageId;
        },
        configure: function (c) {
            languageService.configure(c && c.css);
            config = c;
        },
        doValidation: function (document) {
            return __awaiter(this, void 0, void 0, function () {
                var embedded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            embedded = embeddedDocuments.get(document);
                            return [4 /*yield*/, languageService.doValidation(embedded, stylesheets.get(embedded))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        doComplete: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            var emmetCompletions = emmet.doComplete(document, position, languageId, {
                useNewEmmet: true,
                showExpandedAbbreviation: true,
                showAbbreviationSuggestions: true,
                syntaxProfiles: {},
                variables: {}
            });
            var emmetItems = _.map(emmetCompletions.items, function (i) {
                return __assign({}, i, { sortText: emmet_1.Priority.Emmet + i.label });
            });
            var lsCompletions = languageService.doComplete(embedded, position, stylesheets.get(embedded));
            var lsItems = lsCompletions ? _.map(lsCompletions.items, function (i) {
                return __assign({}, i, { sortText: emmet_1.Priority.Platform + i.label });
            }) : [];
            return {
                isIncomplete: true,
                items: _.concat(emmetItems, lsItems)
            };
        },
        doHover: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            return languageService.doHover(embedded, position, stylesheets.get(embedded)) || nullMode_1.NULL_HOVER;
        },
        findDocumentHighlight: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            return languageService.findDocumentHighlights(embedded, position, stylesheets.get(embedded));
        },
        findDocumentSymbols: function (document) {
            var embedded = embeddedDocuments.get(document);
            return languageService.findDocumentSymbols(embedded, stylesheets.get(embedded));
        },
        findDefinition: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            return languageService.findDefinition(embedded, position, stylesheets.get(embedded));
        },
        findReferences: function (document, position) {
            var embedded = embeddedDocuments.get(document);
            return languageService.findReferences(embedded, position, stylesheets.get(embedded));
        },
        findDocumentColors: function (document) {
            var embedded = embeddedDocuments.get(document);
            return languageService.findDocumentColors(embedded, stylesheets.get(embedded));
        },
        getColorPresentations: function (document, color, range) {
            var embedded = embeddedDocuments.get(document);
            return languageService.getColorPresentations(embedded, stylesheets.get(embedded), color, range);
        },
        format: function (document, currRange, formattingOptions) {
            if (config.tandem.paperclip.format.defaultFormatter[languageId] === 'none') {
                return [];
            }
            var _a = getValueAndRange(document, currRange), value = _a.value, range = _a.range;
            var needIndent = config.tandem.paperclip.format.styleInitialIndent;
            var parserMap = {
                css: 'css'
            };
            return prettier_1.prettierify(value, paths_1.getFileFsPath(document.uri), range, needIndent, formattingOptions, config.prettier, parserMap[languageId]);
        },
        onDocumentRemoved: function (document) {
            embeddedDocuments.onDocumentRemoved(document);
            stylesheets.onDocumentRemoved(document);
        },
        dispose: function () {
            embeddedDocuments.dispose();
            stylesheets.dispose();
        }
    };
}
function getValueAndRange(document, currRange) {
    var value = document.getText();
    var range = currRange;
    if (currRange) {
        var startOffset = document.offsetAt(currRange.start);
        var endOffset = document.offsetAt(currRange.end);
        value = value.substring(startOffset, endOffset);
    }
    else {
        range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), document.positionAt(value.length));
    }
    return { value: value, range: range };
}
//# sourceMappingURL=index.js.map