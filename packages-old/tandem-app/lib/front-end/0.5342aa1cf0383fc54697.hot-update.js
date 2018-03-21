webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/lib/environment/renderers/dom.js":
/***/ (function(module, exports, __webpack_require__) {

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
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/constants.js");
var nodes_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/nodes/index.js");
var window_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/window.js");
var nodes_2 = __webpack_require__("../aerial-browser-sandbox/lib/environment/nodes/index.js");
var events_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/events/index.js");
var base_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/renderers/base.js");
var NODE_NAME_MAP = {
    head: "span",
    html: "span",
    body: "span",
    link: "style",
    script: "span",
    iframe: "span"
};
var SEnvWrapperEvent = events_1.getSEnvEventClasses().SEnvWrapperEvent;
var RECOMPUTE_TIMEOUT = 1;
function getHostStylesheets(node) {
    var p = node.parentNode;
    while (p.parentNode)
        p = p.parentNode;
    return p.styleSheets || [];
}
// See https://github.com/crcn/tandem/blob/318095f9e8672935be4bffea6c7c72aa6d8b95cb/src/@tandem/synthetic-browser/renderers/dom/index.ts
// TODO - this should contain an iframe
var SyntheticDOMRenderer = /** @class */ (function (_super) {
    __extends(SyntheticDOMRenderer, _super);
    function SyntheticDOMRenderer(sourceWindow, targetDocument) {
        var _this = _super.call(this, sourceWindow) || this;
        _this.targetDocument = targetDocument;
        _this.onElementChange = function () {
            _this.requestRender();
        };
        _this._deferResetComputedInfo = lodash_1.throttle(function () {
            _this._resetComputedInfo();
        }, 10);
        _this.container = targetDocument.createElement("iframe");
        console.log("SET CONTAINER");
        Object.assign(_this.container.style, {
            border: "none",
            width: "100%",
            height: "100%"
        });
        _this._onContainerResize = _this._onContainerResize.bind(_this);
        _this.mount = targetDocument.createElement("div");
        _this.container.onload = function () {
            console.log("ONLOAD");
            _this.container.onload = function () { };
            _this.container.contentWindow.document.body.appendChild(_this.mount);
            _this.container.contentWindow.addEventListener("resize", _this._onContainerResize);
            _this.requestRender();
        };
        return _this;
    }
    SyntheticDOMRenderer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._documentElement) {
                    this._documentElement = renderHTMLNode(this.sourceWindow.document, {
                        nodes: this._elementDictionary = {},
                        sheets: this._cssRuleDictionary = {}
                    }, this.onElementChange, this.targetDocument);
                    this.mount.appendChild(this._documentElement);
                }
                this._resetComputedInfo();
                return [2 /*return*/];
            });
        });
    };
    SyntheticDOMRenderer.prototype._updateCSSRules = function (staleStyleSheet, syntheticStyleSheet) {
        while (staleStyleSheet.rules.length) {
            staleStyleSheet.deleteRule(0);
        }
        for (var i = 0, n = syntheticStyleSheet.cssRules.length; i < n; i++) {
            var rule = syntheticStyleSheet.cssRules[i];
            try {
                console.log(rule.previewCSSText);
                staleStyleSheet.insertRule(rule.previewCSSText, staleStyleSheet.cssRules.length);
            }
            catch (e) {
                // browser may throw errors if it cannot parse the rule -- this will
                // happen unsupported vendor prefixes.
            }
        }
    };
    SyntheticDOMRenderer.prototype._getSourceCSSText = function () {
        return Array.prototype.map.call(this.sourceWindow.document.stylesheets, function (ss) { return (ss.previewCSSText); }).join("\n");
    };
    SyntheticDOMRenderer.prototype._onContainerResize = function (event) {
        this._resetComputedInfo();
    };
    SyntheticDOMRenderer.prototype._onWindowMutation = function (event) {
        _super.prototype._onWindowMutation.call(this, event);
        var mutation = event.mutation;
        if (nodes_1.documentMutators[mutation.type]) {
            var _a = this.getElementDictItem(mutation.target), nativeNode = _a[0], syntheticObject = _a[1];
            // if(!nativeNode) {
            //   console.warn(`Unable to find DOM node for mutation ${mutation.$type}`);
            //   console.log(mutation.target);
            //   console.log(Object.assign({}, this._elementDictionary));
            // }
            if (nativeNode) {
                if (mutation.type === nodes_1.REMOVE_CHILD_NODE_EDIT) {
                    var removeMutation = mutation;
                    window_1.windowMutators[mutation.type](nativeNode, mutation);
                }
                else if (mutation.type === nodes_1.INSERT_CHILD_NODE_EDIT) {
                    var insertMutation = mutation;
                    var child = renderHTMLNode(insertMutation.child, {
                        nodes: this._elementDictionary,
                        sheets: this._cssRuleDictionary
                    }, this.onElementChange, this.targetDocument);
                    window_1.windowMutators[mutation.type](nativeNode, nodes_2.createParentNodeInsertChildMutation(nativeNode, child, insertMutation.index, false));
                }
                else if (mutation.type === nodes_1.ATTACH_SHADOW_ROOT_EDIT) {
                    var shadow = nativeNode.attachShadow({ mode: "open" });
                    this._elementDictionary[mutation.target.shadowRoot.$id] = [shadow, mutation.target.shadowRoot];
                }
                else {
                    window_1.windowMutators[mutation.type](nativeNode, mutation);
                }
            }
            else {
                // MUST replace the entire CSS text here since vendor prefixes get stripped out
                // depending on the browser. This is the simplest method for syncing changes.
                var parentStyleSheet = ((mutation.target.parentRule && mutation.target.parentRule.parentStyleSheet) || mutation.target.parentStyleSheet);
                if (parentStyleSheet) {
                    var _b = this.getCSSObjectDictItem(parentStyleSheet), getNativeStyleSheet = _b[0], syntheticStyleSheet = _b[1];
                    this._updateCSSRules(getNativeStyleSheet(), syntheticStyleSheet);
                }
            }
        }
    };
    SyntheticDOMRenderer.prototype.getElementDictItem = function (synthetic) {
        return this._elementDictionary && this._elementDictionary[synthetic.$id] || [undefined, undefined];
    };
    SyntheticDOMRenderer.prototype.getCSSObjectDictItem = function (synthetic) {
        return this._cssRuleDictionary && this._cssRuleDictionary[synthetic.$id] || [undefined, undefined];
    };
    SyntheticDOMRenderer.prototype._onWindowScroll = function (event) {
        _super.prototype._onWindowScroll.call(this, event);
        // TODO - possibly move this to render
        this.container.contentWindow.scroll(this._sourceWindow.scrollX, this._sourceWindow.scrollY);
    };
    SyntheticDOMRenderer.prototype._resetComputedInfo = function () {
        var rects = {};
        var styles = {};
        var targetWindow = this.targetDocument.defaultView;
        var containerWindow = this.container.contentWindow;
        var containerBody = containerWindow && containerWindow.document.body;
        if (!containerBody) {
            return;
        }
        for (var $id in this._elementDictionary) {
            var _a = this._elementDictionary[$id] || [undefined, undefined], native = _a[0], synthetic = _a[1];
            if (synthetic && synthetic.nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
                var rect = native.getBoundingClientRect() || { width: 0, height: 0, left: 0, top: 0 };
                if (rect.width || rect.height || rect.left || rect.top) {
                    rects[$id] = rect;
                }
                // just attach whatever's returned by the DOM -- don't wrap this in a synthetic, or else
                // there'll be massive performance penalties.
                styles[$id] = targetWindow.getComputedStyle(native);
            }
        }
        if (containerBody) {
            this.setPaintedInfo(rects, styles, {
                width: containerBody.scrollWidth,
                height: containerBody.scrollHeight
            }, {
                left: containerWindow.scrollX,
                top: containerWindow.scrollY
            });
        }
    };
    SyntheticDOMRenderer.prototype.reset = function () {
        var _this = this;
        this._documentElement = undefined;
        this._cssRuleDictionary = {};
        this._elementDictionary = {};
        var mount = this.mount;
        if (mount) {
            mount.innerHTML = "";
            mount.onclick =
                mount.ondblclick =
                    mount.onsubmit =
                        mount.onmousedown =
                            mount.onmouseenter =
                                mount.onmouseleave =
                                    mount.onmousemove =
                                        mount.onmouseout =
                                            mount.onmouseover =
                                                mount.onmouseup =
                                                    mount.onmousewheel =
                                                        mount.onkeydown =
                                                            mount.onkeypress =
                                                                mount.onkeyup = function (event) {
                                                                    for (var $id in _this._elementDictionary) {
                                                                        var _a = _this._elementDictionary[$id] || [undefined, undefined], native = _a[0], synthetic = _a[1];
                                                                        if (native === event.target) {
                                                                            _this.onDOMEvent(synthetic, event);
                                                                        }
                                                                    }
                                                                };
        }
    };
    SyntheticDOMRenderer.prototype.onDOMEvent = function (element, event) {
        // need to cast as synthetic event. This is fine for now though.
        var e = new SEnvWrapperEvent();
        e.init(event);
        element.dispatchEvent(e);
        event.stopPropagation();
        if (/submit/.test(event.type)) {
            event.preventDefault();
        }
        var ne = new base_1.SyntheticWindowRendererNativeEvent();
        ne.init(base_1.SyntheticWindowRendererNativeEvent.NATIVE_EVENT, element.$id, e);
        if (element.tagName.toLowerCase() === "input") {
            element.value = event.target.value;
        }
        this.dispatchEvent(ne);
    };
    return SyntheticDOMRenderer;
}(base_1.BaseSyntheticWindowRenderer));
exports.SyntheticDOMRenderer = SyntheticDOMRenderer;
var eachMatchingElement = function (a, b, each) {
    each(a, b);
    Array.prototype.forEach.call(a.childNodes, function (ac, i) {
        eachMatchingElement(ac, b.childNodes[i], each);
    });
};
var renderHTMLNode = function (node, dicts, onChange, document) {
    switch (node.nodeType) {
        case constants_1.SEnvNodeTypes.TEXT:
            var value = node.textContent;
            var textNode = document.createTextNode(/^[\s\r\n\t]+$/.test(value) ? "" : value);
            dicts.nodes[node.$id] = [textNode, node];
            return textNode;
        case constants_1.SEnvNodeTypes.COMMENT:
            var comment = document.createComment(node.nodeValue);
            dicts.nodes[node.$id] = [comment, node];
            return comment;
        case constants_1.SEnvNodeTypes.ELEMENT:
            var syntheticElement = node;
            var tagNameLower = syntheticElement.tagName.toLowerCase();
            var element_1 = renderHTMLElement(tagNameLower, syntheticElement, dicts, onChange, document);
            element_1.onload = onChange;
            for (var i = 0, n = syntheticElement.attributes.length; i < n; i++) {
                var syntheticAttribute = syntheticElement.attributes[i];
                if (syntheticAttribute.name === "class") {
                    element_1.className = syntheticAttribute.value;
                }
                else {
                    // some cases where the attribute name may be invalid - especially as the app is updating
                    // as the user is typing. E.g: <i </body> will be parsed, but will thrown an error since "<" will be
                    // defined as an attribute of <i>
                    try {
                        // get preview attribute value instead here
                        var value_1 = syntheticElement.getPreviewAttribute(syntheticAttribute.name);
                        element_1.setAttribute(syntheticAttribute.name, value_1);
                    }
                    catch (e) {
                        console.warn(e.stack);
                    }
                }
            }
            if (tagNameLower === "iframe") {
                var iframe = syntheticElement;
                element_1.appendChild(iframe.contentWindow.renderer.container);
            }
            if (tagNameLower === "style" || tagNameLower === "link") {
                var el = syntheticElement;
                element_1.type = "text/css";
                element_1.appendChild(document.createTextNode(el.sheet.previewCSSText));
                // define function since sheet is not set until it's added to the document
                dicts.sheets[el.sheet.$id] = [function () { return element_1.sheet; }, el.sheet];
            }
            // add a placeholder for these blacklisted elements so that diffing & patching work properly. !!!!Note that we STILL want to append child nodes so that DOM mutations can be synchronized. !!!
            if (/^(script|head)$/.test(tagNameLower)) {
                element_1.style.display = "none";
            }
            return appendChildNodes(element_1, syntheticElement.childNodes, dicts, onChange, document);
        case constants_1.SEnvNodeTypes.DOCUMENT:
        case constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT:
            var syntheticContainer = node;
            var containerElement = renderHTMLElement("span", syntheticContainer, dicts, onChange, document);
            return appendChildNodes(containerElement, syntheticContainer.childNodes, dicts, onChange, document);
    }
};
var renderHTMLElement = function (tagName, source, dicts, onChange, document) {
    var mappedTagName = NODE_NAME_MAP[tagName.toLowerCase()] || tagName;
    var element = document.createElementNS(source.namespaceURI === constants_1.SVG_XMLNS ? constants_1.SVG_XMLNS : constants_1.HTML_XMLNS, mappedTagName.toLowerCase());
    if (source.shadowRoot) {
        var shadowRoot = element.attachShadow({ mode: "open" });
        dicts.nodes[source.shadowRoot.$id] = [shadowRoot, source.shadowRoot];
        appendChildNodes(shadowRoot, source.shadowRoot.childNodes, dicts, onChange, document);
    }
    dicts.nodes[source.$id] = [element, source];
    return element;
};
var appendChildNodes = function (container, syntheticChildNodes, dicts, onChange, document) {
    for (var i = 0, n = syntheticChildNodes.length; i < n; i++) {
        var childNode = renderHTMLNode(syntheticChildNodes[i], dicts, onChange, document);
        // ignored
        if (childNode == null)
            continue;
        container.appendChild(childNode);
    }
    return container;
};
exports.createSyntheticDOMRendererFactory = function (targetDocument) { return function (window) { return new SyntheticDOMRenderer(window, targetDocument); }; };
//# sourceMappingURL=dom.js.map

/***/ })

})