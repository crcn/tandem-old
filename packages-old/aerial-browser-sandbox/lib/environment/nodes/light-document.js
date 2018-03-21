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
Object.defineProperty(exports, "__esModule", { value: true });
var parent_node_1 = require("./parent-node");
var constants_1 = require("../constants");
var constants_2 = require("./constants");
var collections_1 = require("./collections");
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
//# sourceMappingURL=light-document.js.map