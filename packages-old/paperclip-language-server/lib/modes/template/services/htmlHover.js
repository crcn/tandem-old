"use strict";
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
var paperclip_1 = require("paperclip");
var path = require("path");
var utils_1 = require("../utils");
var htmlScanner_1 = require("../parser/htmlScanner");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var nullMode_1 = require("../../nullMode");
var request = require("request");
var fs = require("fs");
var constants_1 = require("../../../constants");
var TRIVIAL_TOKEN = [htmlScanner_1.TokenType.StartTagOpen, htmlScanner_1.TokenType.EndTagOpen, htmlScanner_1.TokenType.Whitespace];
function doHover(document, position, tagProviders, config, devToolsPort) {
    var offset = document.offsetAt(position);
    // console.log("DOCC");
    var _a = paperclip_1.parseModuleSource(document.getText()), root = _a.root, diagnostics = _a.diagnostics;
    // console.log("PARSE MOD SOURCE" + JSON.stringify(root) + JSON.stringify(diagnostics, null, 2));
    var expr = root && utils_1.getExpressionAtPosition(offset, root, function (expr) {
        return expr.type === paperclip_1.PCExpressionType.SELF_CLOSING_ELEMENT || expr.type === paperclip_1.PCExpressionType.ELEMENT;
    });
    if (!expr) {
        return nullMode_1.NULL_HOVER;
    }
    function getTagHover(element, range, open) {
        var _this = this;
        var startTag = element.type === paperclip_1.PCExpressionType.SELF_CLOSING_ELEMENT ? element : element.startTag;
        var tagName = startTag.name;
        var tagLower = tagName.toLowerCase();
        if (tagLower === "preview") {
            var ancestors = utils_1.getAncestors(element, root);
            var component = ancestors[0];
            var id_1 = paperclip_1.getPCStartTagAttribute(component, "id");
            var previewName_1 = paperclip_1.getPCStartTagAttribute(element, "name") || component.childNodes.indexOf(element);
            if (!id_1) {
                return nullMode_1.NULL_HOVER;
            }
            var hoverFilePath_1 = path.join(constants_1.TMP_DIRECTORY, id_1.replace(/\-/g, "") + ".png");
            return (function () { return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    request({ url: "http://127.0.0.1:" + devToolsPort + "/components/" + id_1 + "/screenshots/" + previewName_1 + "/latest?maxWidth=300&maxHeight=240", encoding: null }, function (err, response, body) {
                                        if (err)
                                            return reject();
                                        if (response.statusCode !== 200) {
                                            return reject(new Error("not found"));
                                        }
                                        fs.writeFileSync(hoverFilePath_1, body);
                                        resolve();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            return [2 /*return*/, {
                                    contents: "Preview could not be loaded. ",
                                    isTrusted: true
                                }];
                        case 3: return [2 /*return*/, {
                                // timestamp for cache buster
                                contents: "![component preview](file://" + hoverFilePath_1 + "?" + Date.now() + ")"
                            }];
                    }
                });
            }); })();
        }
        var _loop_1 = function (provider) {
            var hover = null;
            provider.collectTags(function (t, label) {
                if (t === tagLower) {
                    var tagLabel = open ? '<' + tagLower + '>' : '</' + tagLower + '>';
                    hover = { contents: [{ language: 'html', value: tagLabel }, vscode_languageserver_types_1.MarkedString.fromPlainText(label)], range: range };
                }
            });
            if (hover) {
                return { value: hover };
            }
        };
        for (var _i = 0, tagProviders_1 = tagProviders; _i < tagProviders_1.length; _i++) {
            var provider = tagProviders_1[_i];
            var state_1 = _loop_1(provider);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return nullMode_1.NULL_HOVER;
    }
    function getAttributeHover(tag, attribute, range) {
        tag = tag.toLowerCase();
        var hover = nullMode_1.NULL_HOVER;
        for (var _i = 0, tagProviders_2 = tagProviders; _i < tagProviders_2.length; _i++) {
            var provider = tagProviders_2[_i];
            provider.collectAttributes(tag, function (attr, type, documentation) {
                if (attribute !== attr) {
                    return;
                }
                var contents = [documentation ? vscode_languageserver_types_1.MarkedString.fromPlainText(documentation) : "No doc for " + attr];
                hover = { contents: contents, range: range };
            });
        }
        return hover;
    }
    var range = utils_1.exprLocationToRange(expr.location);
    switch (expr.type) {
        case paperclip_1.PCExpressionType.SELF_CLOSING_ELEMENT: return getTagHover(expr, range, true);
        case paperclip_1.PCExpressionType.ELEMENT: return getTagHover(expr, range, true);
    }
    return nullMode_1.NULL_HOVER;
}
exports.doHover = doHover;
//# sourceMappingURL=htmlHover.js.map