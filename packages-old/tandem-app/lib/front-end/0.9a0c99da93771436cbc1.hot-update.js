webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/src/environment/nodes/document.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
var parent_node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts");
var level3_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/level3/index.ts");
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
var text_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/text.ts");
var light_document_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/light-document.ts");
var comment_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/comment.ts");
var html_elements_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/html-elements.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/utils.ts");
var source_1 = __webpack_require__("../aerial-browser-sandbox/src/utils/source.ts");
var fragment_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/fragment.ts");
var state_1 = __webpack_require__("../aerial-browser-sandbox/src/state/index.ts");
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/document.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/document.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/html-elements.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
var events_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/events/index.ts");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var utils_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/utils.ts");
var node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
var css_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/css/index.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var element_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/element.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
var getShadowRoot = function (node) {
    while (node.nodeName !== "#document" && node.nodeName !== "#shadow-root" && node.nodeName !== "#document-fragment") {
        node = node.parentNode;
    }
    return node;
};
exports.getSEnvHTMLElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvElement = element_1.getSEnvElementClass(context);
    var SEnvCSSStyleDeclaration = css_1.getSEnvCSSStyleDeclarationClass(context);
    var _a = collections_1.getSEnvHTMLCollectionClasses(context), SEnvDOMStringMap = _a.SEnvDOMStringMap, SEnvDOMTokenList = _a.SEnvDOMTokenList;
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLElement, _super);
        function SEnvHTMLElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._onClassListChange = function (value) {
                _this.setAttribute("class", value);
            };
            return _this;
        }
        SEnvHTMLElement.prototype._linkChild = function (child) {
            _super.prototype._linkChild.call(this, child);
            this._tryLoading(); // maybe text node
            child.$$parentElement = this;
        };
        Object.defineProperty(SEnvHTMLElement.prototype, "style", {
            get: function () {
                return this._styleProxy || this._resetStyleProxy();
            },
            set: function (value) {
                var buffer = [];
                if (typeof value === "object") {
                    for (var key in value) {
                        buffer.push(key, ":", value[key]);
                    }
                    value = buffer.join(";");
                }
                this.style.cssText = String(value);
                this.onStyleChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLElement.prototype, "dataset", {
            get: function () {
                var _this = this;
                return this._dataset || (this._dataset = new Proxy(new SEnvDOMStringMap(), {
                    get: function (target, key) {
                        return target[key];
                    },
                    set: function (target, key, value, handler) {
                        var attrName = key.toLowerCase();
                        _this.dataChangedCallback(attrName, target[attrName], value);
                        target[lodash_1.camelCase(attrName)] = value;
                        return true;
                    }
                }));
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLElement.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            this._tryLoading();
        };
        SEnvHTMLElement.prototype.canLoad = function () {
            return false;
        };
        SEnvHTMLElement.prototype._tryLoading = function () {
            if (!this._loaded && this.canLoad()) {
                this._loaded = true;
                this._load();
            }
        };
        SEnvHTMLElement.prototype._load = function () {
        };
        SEnvHTMLElement.prototype.attributeChangedCallback = function (propertyName, oldValue, newValue) {
            _super.prototype.attributeChangedCallback.call(this, propertyName, oldValue, newValue);
            if (propertyName === "style" && newValue !== this._getStyleString()) {
                this.style.cssText = newValue || "";
            }
            else if (propertyName.substr(0, 5) === "data-") {
                this.dataset[propertyName.substr(5).toLowerCase()] = newValue;
            }
            else if (propertyName === "class") {
                this.className = newValue;
                this.classList = new SEnvDOMTokenList(newValue || "", this._onClassListChange);
            }
        };
        SEnvHTMLElement.prototype.dataChangedCallback = function (propertyName, oldValue, newValue) {
            if (propertyName === "_source") {
                var source = JSON.parse(newValue);
                this.source = source;
            }
        };
        SEnvHTMLElement.prototype.blur = function () {
        };
        SEnvHTMLElement.prototype.click = function () {
        };
        SEnvHTMLElement.prototype.dragDrop = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLElement.prototype.focus = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLElement.prototype.msGetInputContext = function () {
            return null;
        };
        SEnvHTMLElement.prototype.remove = function () {
        };
        SEnvHTMLElement.prototype._resetStyleProxy = function () {
            var _this = this;
            if (!this._style) {
                this._style = new SEnvCSSStyleDeclaration(function () { return _this.onStyleChange(); });
                this._style.$owner = this;
            }
            // Proxy the style here so that any changes get synchronized back
            // to the attribute
            // element.
            return this._styleProxy = new Proxy(this._style, {
                get: function (target, propertyName, receiver) {
                    return target[propertyName];
                },
                set: function (target, propertyName, value, receiver) {
                    // normalize the value if it's a pixel unit. Numbers are invalid for CSS declarations.
                    if (typeof value === "number") {
                        value = Math.round(value) + "px";
                    }
                    target.setProperty(propertyName.toString(), value);
                    return true;
                }
            });
        };
        SEnvHTMLElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            clone["_loaded"] = true;
            return clone;
        };
        SEnvHTMLElement.prototype.onStyleChange = function () {
            this.setAttribute("style", this._getStyleString());
        };
        SEnvHTMLElement.prototype._getStyleString = function () {
            return this.style.cssText.replace(/[\n\t\s]+/g, " ").trim();
        };
        return SEnvHTMLElement;
    }(SEnvElement));
});
exports.getSEnvHTMLStyleElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvCSSStyleSheet = css_1.getSEnvCSSStyleSheetClass(context);
    var SEnvEvent = events_1.getSEnvEventClasses(context).SEnvEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLStyleElement, _super);
        function SEnvHTMLStyleElement() {
            var _this = _super.call(this) || this;
            _this.sheet = new SEnvCSSStyleSheet();
            _this.sheet.ownerNode = _this;
            return _this;
        }
        SEnvHTMLStyleElement.prototype.canLoad = function () {
            return !!this.textContent;
        };
        SEnvHTMLStyleElement.prototype._load = function () {
            var source = this.textContent;
            this.sheet.cssText = source;
            var e = new SEnvEvent();
            e.initEvent("load", true, true);
            this.dispatchEvent(e);
        };
        SEnvHTMLStyleElement.prototype.$$setSheet = function (sheet) {
            this.sheet = sheet;
            this.sheet.ownerNode = this;
        };
        SEnvHTMLStyleElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            var window = this.ownerDocument.defaultView;
            clone.$$setSheet(this.sheet.clone());
            return clone;
        };
        return SEnvHTMLStyleElement;
    }(SEnvHTMLElement));
});
exports.diffHTMLStyleElement = function (oldElement, newElement) { return exports.diffHTMLStyledElement(oldElement, newElement); };
exports.getSEnvHTMLLinkElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvCSSStyleSheet = css_1.getSEnvCSSStyleSheetClass(context);
    var SEnvEvent = events_1.getSEnvEventClasses(context).SEnvEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLLinkElement, _super);
        function SEnvHTMLLinkElement() {
            var _this = _super.call(this) || this;
            var sheet = _this.sheet = new SEnvCSSStyleSheet();
            _this.interactiveLoaded = new Promise(function (resolve, reject) {
                _this._resolveLoaded = resolve;
                _this._rejectLoaded = reject;
            });
            return _this;
        }
        SEnvHTMLLinkElement.prototype.canLoad = function () {
            return !!this.href && !!this._resolveLoaded;
        };
        Object.defineProperty(SEnvHTMLLinkElement.prototype, "rel", {
            get: function () {
                return this.getAttribute("rel");
            },
            set: function (value) {
                this.setAttribute("rel", value);
                this._load();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLLinkElement.prototype, "charset", {
            get: function () {
                return this.getAttribute("charset");
            },
            set: function (value) {
                this.setAttribute("charset", value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLLinkElement.prototype, "href", {
            get: function () {
                return this.getAttribute("href");
            },
            set: function (value) {
                this.setAttribute("href", value);
                this._load();
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLLinkElement.prototype._load = function () {
            var rel = this.rel;
            if (rel === "stylesheet") {
                return this._loadStylesheet();
            }
            this._resolveLoaded();
        };
        SEnvHTMLLinkElement.prototype.$$setSheet = function (sheet) {
            this.sheet = sheet;
            this.sheet.ownerNode = this;
        };
        SEnvHTMLLinkElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            if (this.sheet) {
                // TODO: clean this up -- clone stylesheet instead of using
                // cssText which will run the parser again (we don't want that because it's sloowwwwwww). (CC)
                var window_1 = this.ownerDocument.defaultView;
                clone.$$setSheet(this.sheet.clone());
            }
            return clone;
        };
        SEnvHTMLLinkElement.prototype._loadStylesheet = function () {
            return __awaiter(this, void 0, void 0, function () {
                var href, window_2, uri, response, text, event_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            href = this.href;
                            window_2 = this.ownerDocument.defaultView;
                            uri = utils_1.getUri(href, String(window_2.location));
                            return [4 /*yield*/, window_2.fetch(uri)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            text = _a.sent();
                            this._parseStylesheet(text);
                            event_1 = new SEnvEvent();
                            event_1.initEvent("load", true, true);
                            this._resolveLoaded();
                            this.dispatchEvent(event_1);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            this._rejectLoaded(e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SEnvHTMLLinkElement.prototype._parseStylesheet = function (text) {
            var sheet = this.sheet;
            sheet.href = this.href;
            sheet.ownerNode = this;
            var location = this.ownerDocument.defaultView.location;
            sheet.cssText = text;
        };
        return SEnvHTMLLinkElement;
    }(SEnvHTMLElement));
});
exports.SET_STYLED_ELEMENT_SHEET = "SET_STYLED_ELEMENT_SHEET";
exports.setStyledElementSheetMutation = function (target, sheet) { return source_mutation_1.createSetValueMutation(exports.SET_STYLED_ELEMENT_SHEET, target, sheet); };
exports.diffHTMLStyledElement = function (oldElement, newElement) {
    return element_1.diffBaseElement(oldElement, newElement).concat(css_1.diffCSSStyleSheet(oldElement.sheet, newElement.sheet));
};
exports.flattenNodeSources = aerial_common2_1.weakMemo(function (node) {
    var flattened = (_a = {}, _a[node.$id] = node.instance, _a);
    var nameLower = node.nodeName.toLowerCase();
    // TODO - use callback here
    if ((nameLower === "style" || nameLower === "link") && node.instance.sheet) {
        Object.assign(flattened, css_1.flattenSyntheticCSSStyleSheetSources(node.instance.sheet.struct));
    }
    if (node.nodeType === constants_1.SEnvNodeTypes.ELEMENT && node.instance.hasAttribute("style")) {
        var element = node.instance;
        flattened[element.style.$id] = element.style.struct.instance;
    }
    if (node.childNodes) {
        for (var i = 0, n = node.childNodes.length; i < n; i++) {
            Object.assign(flattened, exports.flattenNodeSources(node.childNodes[i]));
        }
    }
    if (node.nodeType === constants_1.SEnvNodeTypes.ELEMENT && node.instance.shadowRoot) {
        Object.assign(flattened, exports.flattenNodeSources(node.instance.shadowRoot.struct));
    }
    return flattened;
    var _a;
});
exports.diffHTMLLinkElement = function (oldElement, newElement) {
    if (oldElement.rel === "stylesheet") {
        return exports.diffHTMLStyledElement(oldElement, newElement);
    }
    else {
        return element_1.diffBaseElement(oldElement, newElement);
    }
};
var _scriptCache = {};
var compileScript = function (source) {
    if (_scriptCache[source]) {
        return _scriptCache[source];
    }
    var f = _scriptCache[source] = new Function("__context", "with(__context) {" + source + "}");
    return f;
};
var declarePropertiesFromScript = function (context, script) {
    // TODO - need to use acorn to figure out where all global vars are
    return context;
};
exports.getSenvHTMLScriptElementClass = aerial_common2_1.weakMemo(function (context) {
    var getProxyUrl = context.getProxyUrl;
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvHTMLScriptElement, _super);
        function SEnvHTMLScriptElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SEnvHTMLScriptElement.prototype, "src", {
            get: function () {
                return this.getAttribute("src");
            },
            set: function (value) {
                this.setAttribute("src", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLScriptElement.prototype.canLoad = function () {
            return Boolean(this.src || this.textContent);
        };
        SEnvHTMLScriptElement.prototype._load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var src, window_3, response, text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            src = this.src;
                            if (!src) return [3 /*break*/, 3];
                            window_3 = this.ownerDocument.defaultView;
                            this.contentLoaded = new Promise(function (resolve, reject) {
                                _this._resolveContentLoaded = resolve;
                                _this._rejectContentLoaded = reject;
                            });
                            return [4 /*yield*/, window_3.fetch(utils_1.getUri(src, String(window_3.location)))];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            text = _a.sent();
                            this._scriptSource = text;
                            this._filename = src;
                            this._evaluate();
                            return [3 /*break*/, 4];
                        case 3:
                            this._resolveContentLoaded = function () { };
                            this._rejectContentLoaded = function () { };
                            this._scriptSource = this.textContent;
                            this._filename = this.ownerDocument.defaultView.location.toString();
                            this._evaluate();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SEnvHTMLScriptElement.prototype._evaluate = function () {
            try {
                var run_1 = compileScript(this._scriptSource);
                run_1.call(this.ownerDocument.defaultView, declarePropertiesFromScript(this.ownerDocument.defaultView, this._scriptSource));
                // TODO - need to grab existing VM object
                // script.runInNewContext(vm.createContext({ __context: this.ownerDocument.defaultView }));
            }
            catch (e) {
                this.ownerDocument.defaultView.console.warn(e);
            }
            // temp for now. Needs to call reject if error is caught
            this._resolveContentLoaded();
        };
        return SEnvHTMLScriptElement;
    }(SEnvHTMLElement));
});
exports.getSEnvHTMLFormElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var SEnvHTMLFormElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLFormElement, _super);
        function SEnvHTMLFormElement() {
            var _this = _super.call(this) || this;
            _this.addEventListener(SEnvMutationEvent.MUTATION, _this._onMutation2.bind(_this));
            return _this;
        }
        SEnvHTMLFormElement.prototype.checkValidity = function () {
            return false;
        };
        SEnvHTMLFormElement.prototype.reportValidity = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLFormElement.prototype.item = function (name, index) { };
        SEnvHTMLFormElement.prototype.namedItem = function (name) { };
        SEnvHTMLFormElement.prototype.reset = function () { };
        SEnvHTMLFormElement.prototype.submit = function () { };
        SEnvHTMLFormElement.prototype._onMutation2 = function (event) {
            // TODO - *[name] does not work -- this is a quick fix
            var formItems = Array.from(this.querySelectorAll("*")).filter(function (element) { return element.hasAttribute("name"); });
            for (var _i = 0, formItems_1 = formItems; _i < formItems_1.length; _i++) {
                var formItem = formItems_1[_i];
                this[formItem.getAttribute("name")] = formItem;
            }
        };
        return SEnvHTMLFormElement;
    }(SEnvHTMLElement));
    ;
    return SEnvHTMLFormElement;
});
exports.SET_CANVAS_DATA_URL = "SET_CANVAS_DATA_URL";
var createSetCanvasDataUrlMutation = function (target, uri, width, height) { return source_mutation_1.createSetValueMutation(exports.SET_CANVAS_DATA_URL, target, { uri: uri, width: width, height: height }); };
var canvasMutators = (_a = {},
    _a[exports.SET_CANVAS_DATA_URL] = function (canvas, _a) {
        var _b = _a.newValue, uri = _b.uri, width = _b.width, height = _b.height;
        var image = new Image();
        image.onload = function () {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(image, 0, 0);
        };
        image.src = uri;
    },
    _a);
var difHTMLCanvasElement = function (oldElement, newElement) {
    var mutations = element_1.diffBaseNode(oldElement, newElement, exports.diffHTMLNode);
    var newDataUrl = newElement.toDataURL();
    // TODO - fix me - this is slow.
    if (oldElement.toDataURL() !== newDataUrl) {
        mutations.push(createSetCanvasDataUrlMutation(oldElement, newDataUrl, oldElement.width, oldElement.height));
    }
    return mutations;
};
exports.getSEnvHTMLCanvasElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvHTMLCanvasElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLCanvasElement, _super);
        function SEnvHTMLCanvasElement() {
            var _this = _super.call(this) || this;
            _this.$$setCanvas(document.createElement("canvas"));
            return _this;
        }
        Object.defineProperty(SEnvHTMLCanvasElement.prototype, "width", {
            get: function () {
                return Number(this.getAttribute("width"));
            },
            set: function (value) {
                this.setAttribute("width", String(value));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLCanvasElement.prototype, "height", {
            get: function () {
                return Number(this.getAttribute("height"));
            },
            set: function (value) {
                this.setAttribute("height", String(value));
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLCanvasElement.prototype.$$setCanvas = function (canvas) {
            // proxy canvas element for now -- API is too complicated -- should be okay diff / patching buffer. Node should use cairo for this.
            this._canvas = proxyOnChange(this._canvasNoProxy = canvas, lodash_1.debounce(this._onCanvasDraw.bind(this), 20));
        };
        SEnvHTMLCanvasElement.prototype.attributeChangedCallback = function (propertyName, oldValue, newValue) {
            _super.prototype.attributeChangedCallback.call(this, propertyName, oldValue, newValue);
            this._canvas.setAttribute(propertyName, newValue);
        };
        SEnvHTMLCanvasElement.prototype.getContext = function (contextId, contextAttributes) {
            return this._canvas.getContext(contextId, contextAttributes);
        };
        SEnvHTMLCanvasElement.prototype.msToBlob = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLCanvasElement.prototype.toDataURL = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this._canvasNoProxy).toDataURL.apply(_a, [type].concat(args));
            var _a;
        };
        SEnvHTMLCanvasElement.prototype.toBlob = function (callback, type) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            (_a = this._canvasNoProxy).toBlob.apply(_a, [callback, type].concat(args));
            var _a;
        };
        SEnvHTMLCanvasElement.prototype._onCanvasDraw = function () {
            var dataUrl = this._canvasNoProxy.toDataURL();
            this.dispatchMutationEvent(createSetCanvasDataUrlMutation(this, dataUrl, this._canvas.width, this._canvas.height));
        };
        SEnvHTMLCanvasElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            clone["" + "$$setCanvas"](this._canvasNoProxy.cloneNode(true));
            return clone;
        };
        return SEnvHTMLCanvasElement;
    }(SEnvHTMLElement));
    return SEnvHTMLCanvasElement;
});
var getSEnvHTMLInputElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvHTMLInputElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLInputElement, _super);
        function SEnvHTMLInputElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SEnvHTMLInputElement.prototype, "name", {
            get: function () {
                return this.getAttribute("name");
            },
            set: function (value) {
                this.setAttribute("name", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLInputElement.prototype.checkValidity = function () {
            return false;
        };
        Object.defineProperty(SEnvHTMLInputElement.prototype, "checked", {
            get: function () {
                return false;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvHTMLInputElement.prototype, "value", {
            get: function () {
                return this.getAttribute("value");
            },
            set: function (value) {
                this.setAttribute("value", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLInputElement.prototype.select = function () { };
        SEnvHTMLInputElement.prototype.setCustomValidity = function (error) { };
        SEnvHTMLInputElement.prototype.setSelectionRange = function (start, end, direction) { };
        SEnvHTMLInputElement.prototype.stepDown = function (n) { };
        SEnvHTMLInputElement.prototype.stepUp = function (n) { };
        return SEnvHTMLInputElement;
    }(SEnvHTMLElement));
    return SEnvHTMLInputElement;
});
var getSEnvHTMLIFrameElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvHTMLIFrameElement = /** @class */ (function (_super) {
        __extends(SEnvHTMLIFrameElement, _super);
        function SEnvHTMLIFrameElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvHTMLIFrameElement.prototype.canLoad = function () {
            return false;
        };
        SEnvHTMLIFrameElement.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            if (this._startedIframe) {
                return;
            }
            this._startedIframe = true;
            var getSEnvWindowClass = __webpack_require__("../aerial-browser-sandbox/src/environment/window.ts").getSEnvWindowClass;
            var SEnvWindow = getSEnvWindowClass(context);
            this.contentWindow = new SEnvWindow("", this.ownerDocument.defaultView);
            this.contentWindow.renderer.start();
        };
        SEnvHTMLIFrameElement.prototype._load = function () {
        };
        Object.defineProperty(SEnvHTMLIFrameElement.prototype, "contentDocument", {
            get: function () {
                return this.contentWindow.document;
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLIFrameElement.prototype.getSVGDocument = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvHTMLIFrameElement.prototype.cloneShallow = function () {
            var clone = _super.prototype.cloneShallow.call(this);
            clone.contentWindow = this.contentWindow.clone(true);
            return clone;
        };
        return SEnvHTMLIFrameElement;
    }(SEnvHTMLElement));
    return SEnvHTMLIFrameElement;
});
var proxyOnChange = function (target, onChange) {
    var maybeProxy = function (v) {
        if (typeof v === "function") {
            return proxyOnChange(v.bind(target), onChange);
        }
        else if (typeof v === "object") {
            // return proxyOnChange(v, onChange);
            return v;
        }
        return v;
    };
    return new Proxy(target, {
        get: function (target, p, receiver) {
            return maybeProxy(target[p]);
        },
        apply: function (target, thisArg, argArray) {
            onChange(target.name, argArray);
            return maybeProxy(target.apply(thisArg, argArray));
        },
        set: function (target, p, value, receiver) {
            onChange(p, [value]);
            target[p] = value;
            return true;
        }
    });
};
var getSEnvHTMLSlotElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var SEnvHTMLSlotELement = /** @class */ (function (_super) {
        __extends(SEnvHTMLSlotELement, _super);
        function SEnvHTMLSlotELement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._onParentShadowMutation = function (event) {
                if (event.type === constants_2.INSERT_CHILD_NODE_EDIT) {
                    _this._updateSlots();
                }
                else if (event.type === constants_2.REMOVE_CHILD_NODE_EDIT) {
                    _this._updateSlots();
                }
            };
            return _this;
        }
        Object.defineProperty(SEnvHTMLSlotELement.prototype, "name", {
            get: function () {
                return this.getAttribute("name");
            },
            set: function (value) {
                this.setAttribute("name", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvHTMLSlotELement.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            this._assignedNodes = [];
            var shadow = this._parentShadow = getShadowRoot(this);
            shadow.addEventListener(SEnvMutationEvent.MUTATION, this._onParentShadowMutation.bind(this));
            this._updateSlots();
        };
        SEnvHTMLSlotELement.prototype.disconnectedCallback = function () {
            this._parentShadow = getShadowRoot(this);
            this._parentShadow.removeEventListener(SEnvMutationEvent.MUTATION, this._onParentShadowMutation.bind(this));
        };
        SEnvHTMLSlotELement.prototype.assignedNodes = function (options) {
            var _this = this;
            var shadowParent = this._parentShadow.host;
            if (!shadowParent)
                return [];
            return Array.prototype.filter.call(shadowParent.childNodes, function (child) {
                return child.slot == _this.name;
            });
        };
        SEnvHTMLSlotELement.prototype._updateSlots = function () {
            var shadowParent = this._parentShadow.host;
            if (!shadowParent)
                return;
            var assignedNodes = this.assignedNodes();
            var diffs = source_mutation_1.diffArray(this._assignedNodes, assignedNodes, function (a, b) { return a === b ? 0 : -1; });
            this._assignedNodes = assignedNodes;
            source_mutation_1.eachArrayValueMutation(diffs, {
                insert: function (_a) {
                    var value = _a.value, index = _a.index;
                    value.$$setAssignedSlot(this);
                },
                delete: function (_a) {
                    var value = _a.value;
                    value.$$setAssignedSlot(null);
                },
                update: function (_a) {
                }
            });
        };
        return SEnvHTMLSlotELement;
    }(SEnvHTMLElement));
    return SEnvHTMLSlotELement;
});
exports.getSEnvHTMLElementClasses = aerial_common2_1.weakMemo(function (context) {
    var getProxyUrl = context.getProxyUrl;
    var SEnvHTMLElement = exports.getSEnvHTMLElementClass(context);
    /*
  
    1.
  
    pbpaste | node -e "\
      const buffer = [];\
      process.stdin.resume();\
      process.stdin.setEncoding('utf8');\
      process.stdin.on('data', (chunk) => {\
        buffer.push(chunk);\
      });\
      process.stdin.on('end', (chunk) => {\
        transform(buffer.join(''));\
      });\
      const transform = (content) => {\
        content.match(/HTMLElementTagNameMap\s\{([\s\S\n]*?)\}/)[1].match(/\"(\w+)\":\s(\w+)/g).forEach((m) => {\
              const [match, name, className] = m.match(/\"(\w+)\":\s(\w+)/);\
              console.log(\`    \"\${name}\": class SEnv\${className} extends SEnvHTMLElement implements \${className} { },\`);\
        });\
      };\
      " | pbcopy
  
    2. copy lib.dom.d.ts
    3. run #1
    4. paste here
    5. fix interface issues
    5. cast returned value as ElementTagNameMap
  
    */
    return {
        // TODO - move to separate function
        "a": /** @class */ (function (_super) {
            __extends(SEnvHTMLAnchorElement, _super);
            function SEnvHTMLAnchorElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLAnchorElement;
        }(SEnvHTMLElement)),
        "applet": /** @class */ (function (_super) {
            __extends(SEnvHTMLAppletElement, _super);
            function SEnvHTMLAppletElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLAppletElement;
        }(SEnvHTMLElement)),
        "area": /** @class */ (function (_super) {
            __extends(SEnvHTMLAreaElement, _super);
            function SEnvHTMLAreaElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLAreaElement;
        }(SEnvHTMLElement)),
        "audio": /** @class */ (function (_super) {
            __extends(SEnvHTMLAudioElement, _super);
            function SEnvHTMLAudioElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLAudioElement.prototype.addTextTrack = function (kind, label, language) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLAudioElement.prototype.canPlayType = function (type) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLAudioElement.prototype.load = function () {
            };
            SEnvHTMLAudioElement.prototype.msClearEffects = function () {
            };
            SEnvHTMLAudioElement.prototype.msGetAsCastingSource = function () {
            };
            SEnvHTMLAudioElement.prototype.msInsertAudioEffect = function (activatableClassId, effectRequired, config) {
            };
            SEnvHTMLAudioElement.prototype.msSetMediaKeys = function (mediaKeys) {
            };
            SEnvHTMLAudioElement.prototype.msSetMediaProtectionManager = function (mediaProtectionManager) {
            };
            SEnvHTMLAudioElement.prototype.pause = function () {
            };
            SEnvHTMLAudioElement.prototype.play = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLAudioElement.prototype.setMediaKeys = function (mediaKeys) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLAudioElement;
        }(SEnvHTMLElement)),
        "base": /** @class */ (function (_super) {
            __extends(SEnvHTMLBaseElement, _super);
            function SEnvHTMLBaseElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBaseElement;
        }(SEnvHTMLElement)),
        "basefont": /** @class */ (function (_super) {
            __extends(SEnvHTMLBaseFontElement, _super);
            function SEnvHTMLBaseFontElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBaseFontElement;
        }(SEnvHTMLElement)),
        "blockquote": /** @class */ (function (_super) {
            __extends(SEnvHTMLQuoteElement, _super);
            function SEnvHTMLQuoteElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLQuoteElement;
        }(SEnvHTMLElement)),
        "slot": getSEnvHTMLSlotElementClass(context),
        "body": /** @class */ (function (_super) {
            __extends(SEnvHTMLBodyElement, _super);
            function SEnvHTMLBodyElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBodyElement;
        }(SEnvHTMLElement)),
        "br": /** @class */ (function (_super) {
            __extends(SEnvHTMLBRElement, _super);
            function SEnvHTMLBRElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLBRElement;
        }(SEnvHTMLElement)),
        "button": /** @class */ (function (_super) {
            __extends(SEnvHTMLButtonElement, _super);
            function SEnvHTMLButtonElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLButtonElement.prototype.checkValidity = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLButtonElement.prototype.setCustomValidity = function (error) {
            };
            return SEnvHTMLButtonElement;
        }(SEnvHTMLElement)),
        "canvas": exports.getSEnvHTMLCanvasElementClass(context),
        "caption": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableCaptionElement, _super);
            function SEnvHTMLTableCaptionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableCaptionElement;
        }(SEnvHTMLElement)),
        "col": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableColElement, _super);
            function SEnvHTMLTableColElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableColElement;
        }(SEnvHTMLElement)),
        "colgroup": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableColElement, _super);
            function SEnvHTMLTableColElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableColElement;
        }(SEnvHTMLElement)),
        "data": /** @class */ (function (_super) {
            __extends(SEnvHTMLDataElement, _super);
            function SEnvHTMLDataElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDataElement;
        }(SEnvHTMLElement)),
        "datalist": /** @class */ (function (_super) {
            __extends(SEnvHTMLDataListElement, _super);
            function SEnvHTMLDataListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDataListElement;
        }(SEnvHTMLElement)),
        "del": /** @class */ (function (_super) {
            __extends(SEnvHTMLModElement, _super);
            function SEnvHTMLModElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLModElement;
        }(SEnvHTMLElement)),
        "dir": /** @class */ (function (_super) {
            __extends(SEnvHTMLDirectoryElement, _super);
            function SEnvHTMLDirectoryElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDirectoryElement;
        }(SEnvHTMLElement)),
        "div": /** @class */ (function (_super) {
            __extends(SEnvHTMLDivElement, _super);
            function SEnvHTMLDivElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDivElement;
        }(SEnvHTMLElement)),
        "dl": /** @class */ (function (_super) {
            __extends(SEnvHTMLDListElement, _super);
            function SEnvHTMLDListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLDListElement;
        }(SEnvHTMLElement)),
        "embed": /** @class */ (function (_super) {
            __extends(SEnvHTMLEmbedElement, _super);
            function SEnvHTMLEmbedElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLEmbedElement.prototype.getSVGDocument = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLEmbedElement;
        }(SEnvHTMLElement)),
        "fieldset": /** @class */ (function (_super) {
            __extends(SEnvHTMLFieldSetElement, _super);
            function SEnvHTMLFieldSetElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLFieldSetElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLFieldSetElement.prototype.setCustomValidity = function (error) { };
            return SEnvHTMLFieldSetElement;
        }(SEnvHTMLElement)),
        "font": /** @class */ (function (_super) {
            __extends(SEnvHTMLFontElement, _super);
            function SEnvHTMLFontElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLFontElement;
        }(SEnvHTMLElement)),
        "form": exports.getSEnvHTMLFormElementClass(context),
        "frame": /** @class */ (function (_super) {
            __extends(SEnvHTMLFrameElement, _super);
            function SEnvHTMLFrameElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLFrameElement.prototype.getSVGDocument = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLFrameElement;
        }(SEnvHTMLElement)),
        "frameset": /** @class */ (function (_super) {
            __extends(SEnvHTMLFrameSetElement, _super);
            function SEnvHTMLFrameSetElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLFrameSetElement;
        }(SEnvHTMLElement)),
        "h1": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h2": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h3": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h4": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h5": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "h6": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadingElement, _super);
            function SEnvHTMLHeadingElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadingElement;
        }(SEnvHTMLElement)),
        "head": /** @class */ (function (_super) {
            __extends(SEnvHTMLHeadElement, _super);
            function SEnvHTMLHeadElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHeadElement;
        }(SEnvHTMLElement)),
        "hr": /** @class */ (function (_super) {
            __extends(SEnvHTMLHRElement, _super);
            function SEnvHTMLHRElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHRElement;
        }(SEnvHTMLElement)),
        "html": /** @class */ (function (_super) {
            __extends(SEnvHTMLHtmlElement, _super);
            function SEnvHTMLHtmlElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLHtmlElement;
        }(SEnvHTMLElement)),
        "iframe": getSEnvHTMLIFrameElementClass(context),
        "img": /** @class */ (function (_super) {
            __extends(SEnvHTMLImageElement, _super);
            function SEnvHTMLImageElement() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.nodeName = "img";
                return _this;
            }
            Object.defineProperty(SEnvHTMLImageElement.prototype, "src", {
                get: function () {
                    return this.getAttribute("src");
                },
                set: function (value) {
                    this.setAttribute("src", value);
                },
                enumerable: true,
                configurable: true
            });
            SEnvHTMLImageElement.prototype.msGetAsCastingSource = function () { };
            SEnvHTMLImageElement.prototype.getPreviewAttribute = function (name) {
                if (name === "src") {
                    var src = this.src;
                    return getProxyUrl(utils_1.getUri(src, this.ownerDocument.defaultView.location.toString()));
                }
                return _super.prototype.getPreviewAttribute.call(this, name);
            };
            return SEnvHTMLImageElement;
        }(SEnvHTMLElement)),
        "input": getSEnvHTMLInputElementClass(context),
        "ins": /** @class */ (function (_super) {
            __extends(SEnvHTMLModElement, _super);
            function SEnvHTMLModElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLModElement;
        }(SEnvHTMLElement)),
        "isindex": /** @class */ (function (_super) {
            __extends(SEnvHTMLUnknownElement, _super);
            function SEnvHTMLUnknownElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLUnknownElement;
        }(SEnvHTMLElement)),
        "label": /** @class */ (function (_super) {
            __extends(SEnvHTMLLabelElement, _super);
            function SEnvHTMLLabelElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLLabelElement;
        }(SEnvHTMLElement)),
        "legend": /** @class */ (function (_super) {
            __extends(SEnvHTMLLegendElement, _super);
            function SEnvHTMLLegendElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLLegendElement;
        }(SEnvHTMLElement)),
        "li": /** @class */ (function (_super) {
            __extends(SEnvHTMLLIElement, _super);
            function SEnvHTMLLIElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLLIElement;
        }(SEnvHTMLElement)),
        "link": exports.getSEnvHTMLLinkElementClass(context),
        "listing": /** @class */ (function (_super) {
            __extends(SEnvHTMLPreElement, _super);
            function SEnvHTMLPreElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPreElement;
        }(SEnvHTMLElement)),
        "map": /** @class */ (function (_super) {
            __extends(SEnvHTMLMapElement, _super);
            function SEnvHTMLMapElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMapElement;
        }(SEnvHTMLElement)),
        "marquee": /** @class */ (function (_super) {
            __extends(SEnvHTMLMarqueeElement, _super);
            function SEnvHTMLMarqueeElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLMarqueeElement.prototype.start = function () { };
            SEnvHTMLMarqueeElement.prototype.stop = function () { };
            return SEnvHTMLMarqueeElement;
        }(SEnvHTMLElement)),
        "menu": /** @class */ (function (_super) {
            __extends(SEnvHTMLMenuElement, _super);
            function SEnvHTMLMenuElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMenuElement;
        }(SEnvHTMLElement)),
        "meta": /** @class */ (function (_super) {
            __extends(SEnvHTMLMetaElement, _super);
            function SEnvHTMLMetaElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMetaElement;
        }(SEnvHTMLElement)),
        "meter": /** @class */ (function (_super) {
            __extends(SEnvHTMLMeterElement, _super);
            function SEnvHTMLMeterElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLMeterElement;
        }(SEnvHTMLElement)),
        "nextid": /** @class */ (function (_super) {
            __extends(SEnvHTMLUnknownElement, _super);
            function SEnvHTMLUnknownElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLUnknownElement;
        }(SEnvHTMLElement)),
        "object": /** @class */ (function (_super) {
            __extends(SEnvHTMLObjectElement, _super);
            function SEnvHTMLObjectElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLObjectElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLObjectElement.prototype.setCustomValidity = function (error) { };
            SEnvHTMLObjectElement.prototype.getSVGDocument = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLObjectElement;
        }(SEnvHTMLElement)),
        "ol": /** @class */ (function (_super) {
            __extends(SEnvHTMLOListElement, _super);
            function SEnvHTMLOListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLOListElement;
        }(SEnvHTMLElement)),
        "optgroup": /** @class */ (function (_super) {
            __extends(SEnvHTMLOptGroupElement, _super);
            function SEnvHTMLOptGroupElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLOptGroupElement;
        }(SEnvHTMLElement)),
        "option": /** @class */ (function (_super) {
            __extends(SEnvHTMLOptionElement, _super);
            function SEnvHTMLOptionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLOptionElement;
        }(SEnvHTMLElement)),
        "output": /** @class */ (function (_super) {
            __extends(SEnvHTMLOutputElement, _super);
            function SEnvHTMLOutputElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLOutputElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLOutputElement.prototype.reportValidity = function () {
                return false;
            };
            SEnvHTMLOutputElement.prototype.setCustomValidity = function (error) {
            };
            return SEnvHTMLOutputElement;
        }(SEnvHTMLElement)),
        "p": /** @class */ (function (_super) {
            __extends(SEnvHTMLParagraphElement, _super);
            function SEnvHTMLParagraphElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLParagraphElement;
        }(SEnvHTMLElement)),
        "param": /** @class */ (function (_super) {
            __extends(SEnvHTMLParamElement, _super);
            function SEnvHTMLParamElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLParamElement;
        }(SEnvHTMLElement)),
        "picture": /** @class */ (function (_super) {
            __extends(SEnvHTMLPictureElement, _super);
            function SEnvHTMLPictureElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPictureElement;
        }(SEnvHTMLElement)),
        "pre": /** @class */ (function (_super) {
            __extends(SEnvHTMLPreElement, _super);
            function SEnvHTMLPreElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPreElement;
        }(SEnvHTMLElement)),
        "progress": /** @class */ (function (_super) {
            __extends(SEnvHTMLProgressElement, _super);
            function SEnvHTMLProgressElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLProgressElement;
        }(SEnvHTMLElement)),
        "q": /** @class */ (function (_super) {
            __extends(SEnvHTMLQuoteElement, _super);
            function SEnvHTMLQuoteElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLQuoteElement;
        }(SEnvHTMLElement)),
        "script": exports.getSenvHTMLScriptElementClass(context),
        "select": /** @class */ (function (_super) {
            __extends(SEnvHTMLSelectElement, _super);
            function SEnvHTMLSelectElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLSelectElement.prototype.add = function (element, before) {
            };
            SEnvHTMLSelectElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLSelectElement.prototype.item = function (name, index) { };
            SEnvHTMLSelectElement.prototype.namedItem = function (name) { };
            SEnvHTMLSelectElement.prototype.remove = function (index) { };
            SEnvHTMLSelectElement.prototype.setCustomValidity = function (error) { };
            return SEnvHTMLSelectElement;
        }(SEnvHTMLElement)),
        "source": /** @class */ (function (_super) {
            __extends(SEnvHTMLSourceElement, _super);
            function SEnvHTMLSourceElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLSourceElement;
        }(SEnvHTMLElement)),
        "span": /** @class */ (function (_super) {
            __extends(SEnvHTMLSpanElement, _super);
            function SEnvHTMLSpanElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLSpanElement;
        }(SEnvHTMLElement)),
        "style": exports.getSEnvHTMLStyleElementClass(context),
        "table": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableElement, _super);
            function SEnvHTMLTableElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableElement.prototype.createCaption = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.createTBody = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.createTFoot = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.createTHead = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLTableElement.prototype.deleteCaption = function () { };
            SEnvHTMLTableElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableElement.prototype.deleteTFoot = function () { };
            SEnvHTMLTableElement.prototype.deleteTHead = function () { };
            SEnvHTMLTableElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableElement;
        }(SEnvHTMLElement)),
        "tbody": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableSectionElement, _super);
            function SEnvHTMLTableSectionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableSectionElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableSectionElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableSectionElement;
        }(SEnvHTMLElement)),
        "td": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableDataCellElement, _super);
            function SEnvHTMLTableDataCellElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableDataCellElement;
        }(SEnvHTMLElement)),
        "template": /** @class */ (function (_super) {
            __extends(SEnvHTMLTemplateElement, _super);
            function SEnvHTMLTemplateElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTemplateElement;
        }(SEnvHTMLElement)),
        "textarea": /** @class */ (function (_super) {
            __extends(SEnvHTMLTextAreaElement, _super);
            function SEnvHTMLTextAreaElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTextAreaElement.prototype.checkValidity = function () {
                return false;
            };
            SEnvHTMLTextAreaElement.prototype.select = function () { };
            SEnvHTMLTextAreaElement.prototype.setCustomValidity = function (error) { };
            SEnvHTMLTextAreaElement.prototype.setSelectionRange = function (start, end) { };
            return SEnvHTMLTextAreaElement;
        }(SEnvHTMLElement)),
        "tfoot": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableSectionElement, _super);
            function SEnvHTMLTableSectionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableSectionElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableSectionElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableSectionElement;
        }(SEnvHTMLElement)),
        "th": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableHeaderCellElement, _super);
            function SEnvHTMLTableHeaderCellElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTableHeaderCellElement;
        }(SEnvHTMLElement)),
        "thead": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableSectionElement, _super);
            function SEnvHTMLTableSectionElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableSectionElement.prototype.deleteRow = function (index) { };
            SEnvHTMLTableSectionElement.prototype.insertRow = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableSectionElement;
        }(SEnvHTMLElement)),
        "time": /** @class */ (function (_super) {
            __extends(SEnvHTMLTimeElement, _super);
            function SEnvHTMLTimeElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTimeElement;
        }(SEnvHTMLElement)),
        "title": /** @class */ (function (_super) {
            __extends(SEnvHTMLTitleElement, _super);
            function SEnvHTMLTitleElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTitleElement;
        }(SEnvHTMLElement)),
        "tr": /** @class */ (function (_super) {
            __extends(SEnvHTMLTableRowElement, _super);
            function SEnvHTMLTableRowElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLTableRowElement.prototype.deleteCell = function (index) { };
            SEnvHTMLTableRowElement.prototype.insertCell = function (index) {
                this._throwUnsupportedMethod();
                return null;
            };
            return SEnvHTMLTableRowElement;
        }(SEnvHTMLElement)),
        "track": /** @class */ (function (_super) {
            __extends(SEnvHTMLTrackElement, _super);
            function SEnvHTMLTrackElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLTrackElement;
        }(SEnvHTMLElement)),
        "ul": /** @class */ (function (_super) {
            __extends(SEnvHTMLUListElement, _super);
            function SEnvHTMLUListElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLUListElement;
        }(SEnvHTMLElement)),
        "video": /** @class */ (function (_super) {
            __extends(SEnvHTMLVideoElement, _super);
            function SEnvHTMLVideoElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SEnvHTMLVideoElement.prototype.addTextTrack = function (kind, label, language) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.canPlayType = function (type) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.load = function () { };
            SEnvHTMLVideoElement.prototype.msClearEffects = function () { };
            SEnvHTMLVideoElement.prototype.msGetAsCastingSource = function () { };
            SEnvHTMLVideoElement.prototype.msInsertAudioEffect = function (activatableClassId, effectRequired, config) { };
            SEnvHTMLVideoElement.prototype.msSetMediaKeys = function (mediaKeys) { };
            SEnvHTMLVideoElement.prototype.msSetMediaProtectionManager = function (mediaProtectionManager) {
            };
            SEnvHTMLVideoElement.prototype.pause = function () { };
            SEnvHTMLVideoElement.prototype.play = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.setMediaKeys = function (mediaKeys) {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.getVideoPlaybackQuality = function () {
                this._throwUnsupportedMethod();
                return null;
            };
            SEnvHTMLVideoElement.prototype.msFrameStep = function (forward) { };
            SEnvHTMLVideoElement.prototype.msInsertVideoEffect = function (activatableClassId, effectRequired, config) { };
            SEnvHTMLVideoElement.prototype.msSetVideoRectangle = function (left, top, right, bottom) { };
            SEnvHTMLVideoElement.prototype.webkitEnterFullscreen = function () { };
            SEnvHTMLVideoElement.prototype.webkitEnterFullScreen = function () { };
            SEnvHTMLVideoElement.prototype.webkitExitFullscreen = function () { };
            SEnvHTMLVideoElement.prototype.webkitExitFullScreen = function () { };
            return SEnvHTMLVideoElement;
        }(SEnvHTMLElement)),
        "xmp": /** @class */ (function (_super) {
            __extends(SEnvHTMLPreElement, _super);
            function SEnvHTMLPreElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SEnvHTMLPreElement;
        }(SEnvHTMLElement))
    };
});
exports.diffHTMLNode = function (oldElement, newElement) {
    if (oldElement.nodeName.toLowerCase() === "link") {
        return exports.diffHTMLLinkElement(oldElement, newElement);
    }
    else if (oldElement.nodeName.toLowerCase() === "style") {
        return exports.diffHTMLStyleElement(oldElement, newElement);
    }
    else if (oldElement.nodeName.toLowerCase() === "canvas") {
        return difHTMLCanvasElement(oldElement, newElement);
    }
    return element_1.diffBaseNode(oldElement, newElement, exports.diffHTMLNode);
};
exports.baseHTMLElementMutators = __assign({}, element_1.baseElementMutators, css_1.cssStyleSheetMutators, canvasMutators);
var _a;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/html-elements.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/html-elements.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/document.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/element.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/html-elements.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/named-node-map.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/exceptions.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/text.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/comment.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/node.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/utils.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/bound-utils.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/light-document.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/environment/nodes/mutation.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/light-document.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var parent_node_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/parent-node.ts");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var constants_2 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
var collections_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/collections.ts");
exports.getSenvLightDocumentClass = function (context) {
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    var _a = collections_1.getSEnvHTMLCollectionClasses(context), SEnvStyleSheetList = _a.SEnvStyleSheetList, SEnvHTMLAllCollection = _a.SEnvHTMLAllCollection;
    var SEnvLightDocument = /** @class */ (function (_super) {
        __extends(SEnvLightDocument, _super);
        function SEnvLightDocument() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvLightDocument.prototype.getSelection = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        Object.defineProperty(SEnvLightDocument.prototype, "stylesheets", {
            get: function () {
                return this._stylesheets || (this._stylesheets = this._createStyleSheetList());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvLightDocument.prototype, "innerHTML", {
            get: function () {
                return "";
            },
            set: function (value) {
                this._throwUnsupportedMethod();
            },
            enumerable: true,
            configurable: true
        });
        SEnvLightDocument.prototype._createStyleSheetList = function () {
            var styleSheets = [];
            Array.prototype.forEach.call(this.querySelectorAll("*"), function (element) {
                if (element.nodeType === constants_1.SEnvNodeTypes.ELEMENT && element["sheet"]) {
                    styleSheets.push(element["sheet"]);
                }
            });
            return new (SEnvStyleSheetList.bind.apply(SEnvStyleSheetList, [void 0].concat(styleSheets)))();
        };
        Object.defineProperty(SEnvLightDocument.prototype, "styleSheets", {
            get: function () {
                return this.stylesheets;
            },
            enumerable: true,
            configurable: true
        });
        SEnvLightDocument.prototype.elementFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvLightDocument.prototype.elementsFromPoint = function (x, y) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvLightDocument.prototype.getElementById = function (elementId) {
            return this.querySelector("#" + elementId);
        };
        SEnvLightDocument.prototype._onMutation = function (event) {
            _super.prototype._onMutation.call(this, event);
            var mutation = event.mutation;
            if (mutation.type === constants_2.INSERT_CHILD_NODE_EDIT || mutation.type === constants_2.REMOVE_CHILD_NODE_EDIT) {
                this._stylesheets = null;
            }
        };
        return SEnvLightDocument;
    }(SEnvParentNode));
    return SEnvLightDocument;
};
exports.getHostDocument = function (node) {
    var p = node;
    // return shadow root since :host selector may be applied
    if (p["shadowRoot"]) {
        return p["shadowRoot"];
    }
    while (p && p.nodeType !== constants_1.SEnvNodeTypes.DOCUMENT && p.nodeType !== constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT) {
        p = p.parentNode;
    }
    return p;
};
exports.getSEnvShadowRootClass = function (context) {
    var SEnvLightDocument = exports.getSenvLightDocumentClass(context);
    var SEnvShadowRoot = /** @class */ (function (_super) {
        __extends(SEnvShadowRoot, _super);
        function SEnvShadowRoot() {
            var _this = _super.call(this) || this;
            _this.nodeType = constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT;
            _this.nodeName = "#document-fragment";
            return _this;
        }
        SEnvShadowRoot.prototype.cloneShallow = function () {
            return new SEnvShadowRoot();
        };
        SEnvShadowRoot.prototype.createStruct = function () {
            return __assign({}, _super.prototype.createStruct.call(this), { hostId: this.host ? this.host.$id : null });
        };
        return SEnvShadowRoot;
    }(SEnvLightDocument));
    return SEnvShadowRoot;
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/light-document.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/light-document.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/mutation.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/nodes/constants.ts");
exports.createInsertHTMLMutation = function (target, childIndex, html) { return ({
    type: constants_1.INSERT_HTML_EDIT,
    html: html,
    childIndex: childIndex,
    target: target
}); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/mutation.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/mutation.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../aerial-browser-sandbox/src/environment/nodes/utils.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
// TODO - break this into other util files
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var parse5 = __webpack_require__("./node_modules/parse5/lib/index.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/src/environment/constants.ts");
var source_1 = __webpack_require__("../aerial-browser-sandbox/src/utils/source.ts");
var VOID_ELEMENTS = __webpack_require__("./node_modules/void-elements/index.js");
exports.parseHTMLDocument = aerial_common2_1.weakMemo(function (content) {
    var ast = parse5.parse(content, { locationInfo: true });
    return ast;
});
exports.parseHTMLDocumentFragment = aerial_common2_1.weakMemo(function (content) {
    var ast = parse5.parseFragment(content, { locationInfo: true });
    return ast;
});
exports.evaluateHTMLDocumentFragment = function (source, document, parentNode) { return exports.mapExpressionToNode(exports.parseHTMLDocumentFragment(source), source_1.generateSourceHash(source), document, parentNode); };
exports.getHTMLASTNodeLocation = function (expression) {
    var loc = expression.__location;
    if (!loc)
        return undefined;
    if (loc.startTag) {
        return { line: loc.startTag.line, column: loc.startTag.col };
    }
    else {
        return { line: loc.line, column: loc.col };
    }
};
var addNodeSource = function (node, fingerprint, expressionOrLocation) {
    var start = expressionOrLocation.__location ? exports.getHTMLASTNodeLocation(expressionOrLocation) : { line: expressionOrLocation.line, column: expressionOrLocation.col };
    var window = node.ownerDocument.defaultView;
    node.source = {
        uri: window.getSourceUri(node.ownerDocument && node.ownerDocument.defaultView.location.toString()),
        fingerprint: fingerprint,
        start: start
    };
    return node;
};
var p = Promise.resolve().then(function () {
    return new Promise(function (resolve) {
    });
});
exports.mapChildExpressionsToNodes = function (promise, childExpressions, fingerprint, document, parentNode, async) {
    if (async === void 0) { async = false; }
    var _loop_1 = function (childExpression) {
        if (async) {
            promise = promise.then(function () {
                var p = exports.mapExpressionToNode(childExpression, fingerprint, document, parentNode, async);
                return p;
            });
        }
        else {
            exports.mapExpressionToNode(childExpression, fingerprint, document, parentNode, async);
        }
    };
    for (var _i = 0, childExpressions_1 = childExpressions; _i < childExpressions_1.length; _i++) {
        var childExpression = childExpressions_1[_i];
        _loop_1(childExpression);
    }
    return promise;
};
exports.mapExpressionToNode = function (expression, fingerprint, document, parentNode, async) {
    if (async === void 0) { async = false; }
    var promise = Promise.resolve();
    switch (expression.nodeName) {
        case "#document-fragment": {
            var fragmentExpression = expression;
            var fragment = document.createDocumentFragment();
            promise = exports.mapChildExpressionsToNodes(promise, fragmentExpression.childNodes, fingerprint, document, fragment, async);
            addNodeSource(fragment, fingerprint, expression);
            parentNode.appendChild(fragment);
            break;
        }
        case "#text": {
            var textNode = addNodeSource(document.createTextNode(expression.value), fingerprint, expression);
            parentNode.appendChild(textNode);
            break;
        }
        case "#comment": {
            var comment = addNodeSource(document.createComment(expression.data), fingerprint, expression);
            parentNode.appendChild(comment);
            break;
        }
        case "#documentType": {
            break;
        }
        case "#document": {
            var documentExpression = expression;
            promise = exports.mapChildExpressionsToNodes(promise, documentExpression.childNodes, fingerprint, document, parentNode, async);
            break;
        }
        default: {
            var elementExpression = expression;
            var element_1 = document.createElement(elementExpression.nodeName);
            for (var _i = 0, _a = elementExpression.attrs; _i < _a.length; _i++) {
                var attr = _a[_i];
                element_1.setAttribute(attr.name, attr.value);
            }
            addNodeSource(element_1, fingerprint, expression);
            promise = exports.mapChildExpressionsToNodes(promise, elementExpression.childNodes, fingerprint, document, element_1, async);
            if (async) {
                // append to document so that connectedCallback called, triggering a load
                parentNode.appendChild(element_1);
                promise = promise.then(function () {
                    return element_1.contentLoaded;
                });
            }
            else {
                parentNode.appendChild(element_1);
            }
        }
    }
    return promise;
};
exports.whenLoaded = function (node) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, node.interactiveLoaded];
            case 1:
                _a.sent();
                return [4 /*yield*/, Promise.all(Array.prototype.map.call(node.childNodes, function (child) { return exports.whenLoaded(child); }))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var querySelectorFilter = function (selector) { return function (node) {
    return node.nodeType === constants_1.SEnvNodeTypes.ELEMENT
        && node.ownerDocument.defaultView.$selector.match(node, selector);
}; };
exports.matchesSelector = function (node, selector) {
    return node.nodeType === constants_1.SEnvNodeTypes.ELEMENT
        && node.ownerDocument.defaultView.$selector.match(node, selector);
};
exports.querySelector = function (node, selector) {
    return exports.findNode(node, querySelectorFilter(selector));
};
exports.querySelectorAll = function (node, selector) {
    return exports.filterNodes(node, querySelectorFilter(selector));
};
exports.findNode = function (parent, filter) {
    if (filter(parent)) {
        return parent;
    }
    var found;
    for (var _i = 0, _a = Array.prototype.slice.call(parent.childNodes); _i < _a.length; _i++) {
        var child = _a[_i];
        found = exports.findNode(child, filter);
        if (found) {
            return found;
        }
    }
};
exports.filterNodes = function (parent, filter, ary) {
    if (ary === void 0) { ary = []; }
    if (filter(parent)) {
        ary.push(parent);
    }
    ;
    for (var _i = 0, _a = Array.prototype.slice.call(parent.childNodes); _i < _a.length; _i++) {
        var child = _a[_i];
        exports.filterNodes(child, filter, ary);
    }
    return ary;
};
function traverseDOMNodeExpression(target, each) {
    if (target.nodeName === "#document" || target.nodeName === "#document-fragment") {
    }
    for (var _i = 0, _a = target["childNodes"] || []; _i < _a.length; _i++) {
        var child = _a[_i];
        if (each(child) === false)
            return;
        traverseDOMNodeExpression(child, each);
    }
}
exports.traverseDOMNodeExpression = traverseDOMNodeExpression;
function findDOMNodeExpression(target, filter) {
    var found;
    traverseDOMNodeExpression(target, function (expression) {
        if (filter(expression)) {
            found = expression;
            return false;
        }
    });
    return found;
}
exports.findDOMNodeExpression = findDOMNodeExpression;
function filterDOMNodeExpressions(target, filter) {
    var found = [];
    traverseDOMNodeExpression(target, function (expression) {
        if (filter(expression)) {
            found.push(expression);
        }
    });
    return found;
}
exports.filterDOMNodeExpressions = filterDOMNodeExpressions;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/utils.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/aerial-browser-sandbox/src/environment/nodes/utils.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})