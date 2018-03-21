"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var aerial_common2_1 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
var node_1 = require("./node");
var parent_node_1 = require("./parent-node");
var level3_1 = require("../level3");
var events_1 = require("../events");
var collections_1 = require("./collections");
var text_1 = require("./text");
var light_document_1 = require("./light-document");
var comment_1 = require("./comment");
var html_elements_1 = require("./html-elements");
var constants_1 = require("../constants");
var utils_1 = require("./utils");
var source_1 = require("../../utils/source");
var fragment_1 = require("./fragment");
var state_1 = require("../../state");
var CONSUME_TIMEOUT = 10;
exports.getSEnvDOMImplementationClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvDocument = exports.getSEnvDocumentClass(context);
    var SEnvDOMImplementation = /** @class */ (function () {
        function SEnvDOMImplementation(_view) {
            this._view = _view;
        }
        SEnvDOMImplementation.prototype.createDocument = function (namespaceURI, qualifiedName, doctype) {
            throw new Error("Unsupported");
        };
        SEnvDOMImplementation.prototype.createDocumentType = function (qualifiedName, publicId, systemId) {
            throw new Error("Unsupported");
        };
        SEnvDOMImplementation.prototype.createHTMLDocument = function (title) {
            var document = new SEnvDocument(this._view);
            document.appendChild(document.createElement("html"));
            document.documentElement.appendChild(document.createElement("head"));
            document.documentElement.appendChild(document.createElement("body"));
            return document;
        };
        SEnvDOMImplementation.prototype.hasFeature = function (feature, version) {
            return false;
        };
        return SEnvDOMImplementation;
    }());
    return SEnvDOMImplementation;
});
exports.getSEnvDocumentClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    var SEnvText = text_1.getSEnvTextClass(context);
    var SEnvComment = comment_1.getSEnvCommentClass(context);
    var SEnvMutationEvent = level3_1.getL3EventClasses(context).SEnvMutationEvent;
    var _a = events_1.getSEnvEventClasses(context), SEnvEvent = _a.SEnvEvent, SEnvMutationEvent2 = _a.SEnvMutationEvent;
    var SEnvDocumentFragment = fragment_1.getSEnvDocumentFragment(context);
    var SENvHTMLElement = html_elements_1.getSEnvHTMLElementClass(context);
    var _b = collections_1.getSEnvHTMLCollectionClasses(context), SEnvStyleSheetList = _b.SEnvStyleSheetList, SEnvHTMLAllCollection = _b.SEnvHTMLAllCollection;
    var LightDocument = light_document_1.getSenvLightDocumentClass(context);
    var eventMap = {
        MutationEvent: SEnvMutationEvent,
        Event: SEnvEvent,
        MouseEvent: SEnvEvent
    };
    var SEnvDocument = /** @class */ (function (_super) {
        __extends(SEnvDocument, _super);
        function SEnvDocument(defaultView) {
            var _this = _super.call(this) || this;
            _this.defaultView = defaultView;
            _this.structType = state_1.SYNTHETIC_DOCUMENT;
            _this.nodeType = constants_1.SEnvNodeTypes.DOCUMENT;
            _this.cookie = "";
            _this.nodeName = "#document";
            _this.implementation = defaultView.implementation;
            _this.addEventListener("readystatechange", function (e) { return _this.onreadystatechange && _this.onreadystatechange(e); });
            return _this;
        }
        Object.defineProperty(SEnvDocument.prototype, "links", {
            get: function () {
                return this.querySelectorAll("a,area");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "location", {
            get: function () {
                return this.defaultView.location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "all", {
            get: function () {
                return new (SEnvHTMLAllCollection.bind.apply(SEnvHTMLAllCollection, [void 0].concat(Array.from(this.querySelectorAll("*")))))();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "readyState", {
            get: function () {
                return this._readyState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "documentElement", {
            get: function () {
                return this.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "head", {
            get: function () {
                return this.documentElement.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvDocument.prototype, "body", {
            get: function () {
                return this.documentElement.children[1];
            },
            enumerable: true,
            configurable: true
        });
        SEnvDocument.prototype.$load = function (content) {
            return __awaiter(this, void 0, void 0, function () {
                var expression, domContentLoadedEvent, e_1, loadEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.removeAllChildren();
                            // TODO - use sax parsing here instead
                            this.$$setReadyState("loading");
                            expression = utils_1.parseHTMLDocument(content);
                            return [4 /*yield*/, utils_1.mapExpressionToNode(expression, source_1.generateSourceHash(content), this, this, true)];
                        case 1:
                            _a.sent();
                            this.$$setReadyState("interactive");
                            domContentLoadedEvent = new SEnvEvent();
                            domContentLoadedEvent.initEvent("DOMContentLoaded", true, true);
                            this.dispatchEvent(domContentLoadedEvent);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, utils_1.whenLoaded(this)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _a.sent();
                            // catch anyways since we want to fire a load completion
                            this.defaultView.console.error(e_1);
                            return [3 /*break*/, 5];
                        case 5:
                            loadEvent = new SEnvEvent();
                            loadEvent.initEvent("load", true, true);
                            this.dispatchEvent(loadEvent);
                            this.$$setReadyState("complete");
                            return [2 /*return*/];
                    }
                });
            });
        };
        SEnvDocument.prototype.$$setReadyState = function (state) {
            if (this._readyState === state) {
                return;
            }
            this._readyState = state;
            var me = new SEnvMutationEvent2();
            me.initMutationEvent(createReadyStateChangeMutation(this, this.readyState));
            this.dispatchEvent(me);
            var event = new SEnvEvent();
            event.initEvent("readystatechange", true, true);
            this.dispatchEvent(event);
        };
        SEnvDocument.prototype.$$update = function () {
        };
        SEnvDocument.prototype.adoptNode = function (source) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.captureEvents = function () {
        };
        SEnvDocument.prototype.caretRangeFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.clear = function () {
        };
        SEnvDocument.prototype.close = function () {
        };
        SEnvDocument.prototype.createAttribute = function (name) {
            this._throwUnsupportedMethod();
            return null;
        };
        Object.defineProperty(SEnvDocument.prototype, "title", {
            get: function () {
                var titleEl = this.querySelector("title");
                return titleEl && titleEl.textContent;
            },
            enumerable: true,
            configurable: true
        });
        SEnvDocument.prototype.createStruct = function () {
            var titleEl = this.querySelector("title");
            return __assign({}, _super.prototype.createStruct.call(this), { title: this.title });
        };
        SEnvDocument.prototype.createAttributeNS = function (namespaceURI, qualifiedName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createCDATASection = function (data) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createComment = function (data) {
            return this.$$linkNode(new SEnvComment(data));
        };
        SEnvDocument.prototype.createDocumentFragment = function () {
            return this.$$linkNode(new SEnvDocumentFragment());
        };
        SEnvDocument.prototype.createEvent = function (eventInterface) {
            var eventClass = eventMap[eventInterface];
            if (!eventClass) {
                throw new Error("Unable to create new event for " + eventInterface);
            }
            return eventClass && Object.create(eventClass.prototype);
        };
        SEnvDocument.prototype.createElement = function (tagName) {
            return this.createElementNS(constants_1.HTML_XMLNS, tagName);
        };
        SEnvDocument.prototype.$$linkNode = function (node) {
            node["" + "$$setOwnerDocument"](this);
            return node;
        };
        SEnvDocument.prototype.createElementNS = function (namespaceURI, qualifiedName) {
            var elementClass = this.defaultView.customElements.get(qualifiedName) || SENvHTMLElement;
            return this.$$linkElement(new elementClass(), qualifiedName, namespaceURI);
        };
        SEnvDocument.prototype.$$linkElement = function (element, qualifiedName, namespaceURI) {
            this.$$linkNode(element);
            element["" + "tagName"] = qualifiedName;
            element["" + "nodeName"] = qualifiedName;
            element["" + "namespaceURI"] = namespaceURI;
            return element;
        };
        SEnvDocument.prototype.createExpression = function (expression, resolver) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createNodeIterator = function (root, whatToShowe, filter, entityReferenceExpansion) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createNSResolver = function (nodeResolver) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createProcessingInstruction = function (target, data) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createRange = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createTextNode = function (data) {
            return this.$$linkNode(new SEnvText(data));
        };
        SEnvDocument.prototype.createTouch = function (view, target, identifier, pageX, pageY, screenX, screenY) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createTouchList = function () {
            var touches = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                touches[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.createTreeWalker = function (root, whatToShow, filter, entityReferenceExpansion) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.evaluate = function (expression, contextNode, resolver, type, result) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.execCommand = function (commandId, showUI, value) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.execCommandShowHelp = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.exitFullscreen = function () {
        };
        SEnvDocument.prototype.exitPointerLock = function () {
        };
        SEnvDocument.prototype.focus = function () {
        };
        SEnvDocument.prototype.hasFocus = function () {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.importNode = function (importedNode, deep) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.msElementsFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.msElementsFromRect = function (left, top, width, height) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.open = function (url, name, features, replace) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.queryCommandEnabled = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandIndeterm = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandState = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandSupported = function (commandId) {
            this._throwUnsupportedMethod();
            return false;
        };
        SEnvDocument.prototype.queryCommandText = function (commandId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.queryCommandValue = function (commandId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvDocument.prototype.releaseEvents = function () {
        };
        SEnvDocument.prototype.updateSettings = function () {
        };
        SEnvDocument.prototype.webkitCancelFullScreen = function () {
        };
        SEnvDocument.prototype.webkitExitFullscreen = function () {
        };
        SEnvDocument.prototype.write = function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
        };
        SEnvDocument.prototype.writeln = function () {
            var content = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                content[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
        };
        return SEnvDocument;
    }(LightDocument));
    ;
    return SEnvDocument;
});
exports.READY_STATE_CHANGE = "READY_STATE_CHANGE";
exports.INSERT_STYLE_SHEET = "INSERT_STYLE_SHEET";
exports.REMOVE_STYLE_SHEET = "REMOVE_STYLE_SHEET";
exports.MOVE_STYLE_SHEET = "MOVE_STYLE_SHEET";
// export const createInsertStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index?: number) => createInsertChildMutation(INSERT_STYLE_SHEET, target, sheet, index);
// export const createRemoveStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index?: number) => createRemoveChildMutation(REMOVE_STYLE_SHEET, target, sheet, index);
// export const createMoveStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index: number, oldIndex) => createMoveChildMutation(MOVE_STYLE_SHEET, target, sheet, index, oldIndex);
var createReadyStateChangeMutation = function (target, readyState) { return source_mutation_1.createSetValueMutation(exports.READY_STATE_CHANGE, target, readyState); };
exports.diffDocument = function (oldDocument, newDocument) {
    var mutations = [];
    var endMutations = [];
    if (oldDocument.readyState !== newDocument.readyState) {
        endMutations.push(createReadyStateChangeMutation(oldDocument, newDocument.readyState));
    }
    // const cssDiffs = diffArray(
    //   Array.from(oldDocument.stylesheets), 
    //   Array.from(newDocument.stylesheets), 
    //   // TODO - check ids. cssText is a very poor rep here
    //   (a: CSSStyleSheet, b: CSSStyleSheet) => a.href === b.href ? 0 : a.cssText === b.cssText ? 0 : -1
    // );
    // eachArrayValueMutation(cssDiffs, {
    //   insert({ value, index }) {
    //     mutations.push(createRemoveStyleSheetMutation(oldDocument, value as CSSStyleSheet, index));
    //   },
    //   delete({ index }) {
    //     mutations.push(createRemoveStyleSheetMutation(oldDocument, oldDocument.stylesheets.item(index) as CSSStyleSheet, index));
    //   },
    //   update({ originalOldIndex, patchedOldIndex, newValue, index }) {
    //     if (patchedOldIndex !== index) {
    //       mutations.push(createMoveStyleSheetMutation(oldDocument, oldDocument.stylesheets.item(originalOldIndex) as CSSStyleSheet, index, patchedOldIndex));
    //     }
    //     // TODO - diff & patch style sheet 
    //     // const oldValue = originalOldIndex.childNodes[originalOldIndex];
    //     // mutations.push(...diffChildNode(oldValue, newValue));
    //   }
    // })
    return mutations.concat(parent_node_1.diffParentNode(oldDocument, newDocument, html_elements_1.diffHTMLNode), endMutations);
};
exports.documentMutators = __assign({}, parent_node_1.parentNodeMutators, html_elements_1.baseHTMLElementMutators, (_a = {}, _a[exports.READY_STATE_CHANGE] = function (target, mutation) {
    if (target.$$setReadyState) {
        target.$$setReadyState(mutation.newValue);
    }
}, _a));
exports.flattenDocumentSources = function (document) {
    return html_elements_1.flattenNodeSources(document);
};
// export const patchDocument = (oldDocument: SEnvDocumentInterface, mutation: Mutation<any>) => {
//   patchParentNode(oldDocument, mutation);
//   if (mutation.$type === READY_STATE_CHANGE) {
//     oldDocument.$$setReadyState((mutation as SetValueMutation<SEnvDocumentInterface>).newValue);
//   }
// };
exports.waitForDocumentComplete = function (window) { return new Promise(function (resolve) {
    if (window.document.readyState === "complete") {
        return resolve();
    }
    window.document.addEventListener("readystatechange", function () {
        if (window.document.readyState === "complete") {
            resolve();
        }
    });
}); };
var _a;
//# sourceMappingURL=document.js.map