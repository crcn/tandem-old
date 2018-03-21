"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlScanner_1 = require("./htmlScanner");
var htmlTags_1 = require("../tagProviders/htmlTags");
var Node = /** @class */ (function () {
    function Node(start, end, children, parent) {
        this.start = start;
        this.end = end;
        this.children = children;
        this.parent = parent;
    }
    Object.defineProperty(Node.prototype, "attributeNames", {
        get: function () {
            return Object.keys(this.attributes);
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.isSameTag = function (tagInLowerCase) {
        return (this.tag &&
            tagInLowerCase &&
            this.tag.length === tagInLowerCase.length &&
            this.tag.toLowerCase() === tagInLowerCase);
    };
    Object.defineProperty(Node.prototype, "firstChild", {
        get: function () {
            return this.children[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "lastChild", {
        get: function () {
            return this.children.length ? this.children[this.children.length - 1] : void 0;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.findNodeBefore = function (offset) {
        var idx = findFirst(this.children, function (c) { return offset <= c.start; }) - 1;
        if (idx >= 0) {
            var child = this.children[idx];
            if (offset > child.start) {
                if (offset < child.end) {
                    return child.findNodeBefore(offset);
                }
                var lastChild = child.lastChild;
                if (lastChild && lastChild.end === child.end) {
                    return child.findNodeBefore(offset);
                }
                return child;
            }
        }
        return this;
    };
    Node.prototype.findNodeAt = function (offset) {
        var idx = findFirst(this.children, function (c) { return offset <= c.start; }) - 1;
        if (idx >= 0) {
            var child = this.children[idx];
            if (offset > child.start && offset <= child.end) {
                return child.findNodeAt(offset);
            }
        }
        return this;
    };
    return Node;
}());
exports.Node = Node;
function parse(text) {
    var scanner = htmlScanner_1.createScanner(text);
    var htmlDocument = new Node(0, text.length, [], null);
    var curr = htmlDocument;
    var endTagStart = -1;
    var pendingAttribute = '';
    var token = scanner.scan();
    var attributes = {};
    while (token !== htmlScanner_1.TokenType.EOS) {
        switch (token) {
            case htmlScanner_1.TokenType.StartTagOpen:
                var child = new Node(scanner.getTokenOffset(), text.length, [], curr);
                curr.children.push(child);
                curr = child;
                break;
            case htmlScanner_1.TokenType.StartTag:
                curr.tag = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.StartTagClose:
                curr.end = scanner.getTokenEnd(); // might be later set to end tag position
                if (htmlTags_1.isEmptyElement(curr.tag) && curr !== htmlDocument) {
                    curr.closed = true;
                    curr = curr.parent;
                }
                break;
            case htmlScanner_1.TokenType.EndTagOpen:
                endTagStart = scanner.getTokenOffset();
                break;
            case htmlScanner_1.TokenType.EndTag:
                var closeTag = scanner.getTokenText().toLowerCase();
                while (!curr.isSameTag(closeTag) && curr !== htmlDocument) {
                    curr.end = endTagStart;
                    curr.closed = false;
                    curr = curr.parent;
                }
                if (curr !== htmlDocument) {
                    curr.closed = true;
                    curr.endTagStart = endTagStart;
                }
                break;
            case htmlScanner_1.TokenType.StartTagSelfClose:
                if (curr !== htmlDocument) {
                    curr.closed = true;
                    curr.end = scanner.getTokenEnd();
                    curr = curr.parent;
                }
                break;
            case htmlScanner_1.TokenType.EndTagClose:
                if (curr !== htmlDocument) {
                    curr.end = scanner.getTokenEnd();
                    curr = curr.parent;
                }
                break;
            case htmlScanner_1.TokenType.AttributeName:
                pendingAttribute = scanner.getTokenText();
                attributes = curr.attributes;
                if (!attributes) {
                    curr.attributes = attributes = {};
                }
                attributes[pendingAttribute] = ''; // Support valueless attributes such as 'checked'
                break;
            case htmlScanner_1.TokenType.AttributeValue:
                var value = scanner.getTokenText();
                if (attributes && pendingAttribute) {
                    attributes[pendingAttribute] = value;
                    pendingAttribute = '';
                }
                break;
        }
        token = scanner.scan();
    }
    while (curr !== htmlDocument) {
        curr.end = text.length;
        curr.closed = false;
        curr = curr.parent;
    }
    return {
        roots: htmlDocument.children,
        findNodeBefore: htmlDocument.findNodeBefore.bind(htmlDocument),
        findNodeAt: htmlDocument.findNodeAt.bind(htmlDocument)
    };
}
exports.parse = parse;
function parseHTMLDocument(document) {
    return parse(document.getText());
}
exports.parseHTMLDocument = parseHTMLDocument;
/**
 * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
 * are located before all elements where p(x) is true.
 * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
 */
function findFirst(array, p) {
    var low = 0, high = array.length;
    if (high === 0) {
        return 0; // no children
    }
    while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (p(array[mid])) {
            high = mid;
        }
        else {
            low = mid + 1;
        }
    }
    return low;
}
//# sourceMappingURL=htmlParser.js.map