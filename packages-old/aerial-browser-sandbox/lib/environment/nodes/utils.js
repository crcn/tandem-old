"use strict";
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
var parse5 = require("parse5");
var aerial_common2_1 = require("aerial-common2");
var constants_1 = require("../constants");
var source_1 = require("../../utils/source");
var VOID_ELEMENTS = require("void-elements");
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
//# sourceMappingURL=utils.js.map