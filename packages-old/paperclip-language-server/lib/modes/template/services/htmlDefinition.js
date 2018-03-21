"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlScanner_1 = require("../parser/htmlScanner");
var TRIVIAL_TOKEN = [htmlScanner_1.TokenType.StartTagOpen, htmlScanner_1.TokenType.EndTagOpen, htmlScanner_1.TokenType.Whitespace];
function findDefinition(document, position, htmlDocument, componentInfos) {
    var offset = document.offsetAt(position);
    var node = htmlDocument.findNodeAt(offset);
    if (!node || !node.tag) {
        return [];
    }
    function getTagDefinition(tag, range, open) {
        tag = tag.toLowerCase();
        for (var _i = 0, componentInfos_1 = componentInfos; _i < componentInfos_1.length; _i++) {
            var comp = componentInfos_1[_i];
            if (tag === comp.name) {
                return comp.definition || [];
            }
        }
        return [];
    }
    var inEndTag = node.endTagStart && offset >= node.endTagStart; // <html></ht|ml>
    var startOffset = inEndTag ? node.endTagStart : node.start;
    var scanner = htmlScanner_1.createScanner(document.getText(), startOffset);
    var token = scanner.scan();
    function shouldAdvance() {
        if (token === htmlScanner_1.TokenType.EOS) {
            return false;
        }
        var tokenEnd = scanner.getTokenEnd();
        if (tokenEnd < offset) {
            return true;
        }
        if (tokenEnd === offset) {
            return TRIVIAL_TOKEN.includes(token);
        }
        return false;
    }
    while (shouldAdvance()) {
        token = scanner.scan();
    }
    if (offset > scanner.getTokenEnd()) {
        return [];
    }
    var tagRange = {
        start: document.positionAt(scanner.getTokenOffset()),
        end: document.positionAt(scanner.getTokenEnd())
    };
    switch (token) {
        case htmlScanner_1.TokenType.StartTag:
            return getTagDefinition(node.tag, tagRange, true);
        case htmlScanner_1.TokenType.EndTag:
            return getTagDefinition(node.tag, tagRange, false);
    }
    return [];
}
exports.findDefinition = findDefinition;
//# sourceMappingURL=htmlDefinition.js.map