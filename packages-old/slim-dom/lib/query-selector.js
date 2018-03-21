"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weak_memo_1 = require("./weak-memo");
var nwmatcher = require("nwmatcher");
var dom_wrap_1 = require("./dom-wrap");
var fakeWindow = {
    document: {
        hasFocus: false,
    }
};
exports.querySelector = function (selector, root) {
    // Use querySelectorAll because of memoization.
    var matchingElements = exports.querySelectorAll(selector, root, root);
    return matchingElements.length ? matchingElements[0] : null;
};
var ownerDocument = new dom_wrap_1.LightDocument();
var queryTester = nwmatcher({
    document: ownerDocument
});
queryTester.configure({ CACHING: true, VERBOSITY: false });
exports.elementMatches = weak_memo_1.weakMemo(function (selector, node, root) {
    // Janky as hell. Touch root element to set parent node of all child elements.
    dom_wrap_1.getLightDomWrapper(root);
    var wrappedNode = dom_wrap_1.getLightDomWrapper(node);
    wrappedNode.ownerDocument = ownerDocument;
    return wrappedNode.nodeType === 1 && queryTester.match(wrappedNode, selector);
});
exports.querySelectorAll = weak_memo_1.weakMemo(function (selector, node, root) {
    var matches = [];
    if (exports.elementMatches(selector, node, root)) {
        matches.push(node);
    }
    ;
    if (node.childNodes) {
        var parent_1 = node;
        for (var i = 0, length_1 = parent_1.childNodes.length; i < length_1; i++) {
            matches.push.apply(matches, exports.querySelectorAll(selector, parent_1.childNodes[i], root));
        }
    }
    return matches;
});
//# sourceMappingURL=query-selector.js.map