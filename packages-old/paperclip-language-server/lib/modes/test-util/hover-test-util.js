"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var HoverAsserter = /** @class */ (function () {
    function HoverAsserter(hover, document) {
        this.hover = hover;
        this.document = document;
    }
    HoverAsserter.prototype.hasNothing = function () {
        var contents = this.hover.contents;
        if (Array.isArray(contents) || typeof contents === 'string') {
            assert(contents.length === 0, 'expect nothing, but get hover: ' + contents);
        }
        else {
        }
    };
    HoverAsserter.prototype.hasHoverAt = function (label, offset) {
        var contents = this.hover.contents;
        if (Array.isArray(contents) || typeof contents === 'string') {
            assert(contents.length !== 0, 'expect hover, but get nothing');
        }
        else {
            assert(contents.value.length !== 0, 'expect hover, but get nothing');
        }
        var strOrMarked = Array.isArray(contents) ? contents[0] : contents;
        var str = typeof strOrMarked === 'string' ? strOrMarked : strOrMarked.value;
        assert.equal(str, label);
        var hover = this.hover;
        assert.equal(this.document.offsetAt(hover.range.start), offset);
    };
    return HoverAsserter;
}());
exports.HoverAsserter = HoverAsserter;
function hoverDSL(setup) {
    return function test(_a) {
        var value = _a[0];
        var offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        var document = vscode_languageserver_types_1.TextDocument.create(setup.docUri, setup.langId, 0, value);
        var position = document.positionAt(offset);
        var hover = setup.doHover(document, position);
        return new HoverAsserter(hover, document);
    };
}
exports.hoverDSL = hoverDSL;
//# sourceMappingURL=hover-test-util.js.map