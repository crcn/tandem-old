"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
function testDSL(setup) {
    return function test(_a) {
        var value = _a[0];
        var offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        var document = vscode_languageserver_types_1.TextDocument.create(setup.docUri, setup.langId, 0, value);
        var position = document.positionAt(offset);
        var items = setup.doComplete(document, position).items;
        return new CompletionAsserter(items, document);
    };
}
exports.testDSL = testDSL;
var CompletionAsserter = /** @class */ (function () {
    function CompletionAsserter(items, doc) {
        this.items = items;
        this.doc = doc;
    }
    CompletionAsserter.prototype.count = function (expect) {
        var actual = this.items.length;
        assert.equal(actual, expect, "Expect completions has length: " + expect + ", actual: " + actual);
        return this;
    };
    CompletionAsserter.prototype.has = function (label) {
        var items = this.items;
        var matches = items.filter(function (completion) { return completion.label === label; });
        assert.equal(matches.length, 1, label + ' should only existing once: Actual: ' + items.map(function (c) { return c.label; }).join(', '));
        this.lastMatch = matches[0];
        return this;
    };
    CompletionAsserter.prototype.withDoc = function (doc) {
        assert.equal(this.lastMatch.documentation, doc);
        return this;
    };
    CompletionAsserter.prototype.withKind = function (kind) {
        assert.equal(this.lastMatch.kind, kind);
        return this;
    };
    CompletionAsserter.prototype.become = function (resultText) {
        assert.equal(applyEdits(this.doc, [this.lastMatch.textEdit]), resultText);
        return this;
    };
    CompletionAsserter.prototype.hasNo = function (label) {
        this.lastMatch = undefined;
        var items = this.items;
        var matches = items.filter(function (completion) { return completion.label === label; });
        assert.equal(matches.length, 0, label + ' should not exist. Actual: ' + items.map(function (c) { return c.label; }).join(', '));
        return this;
    };
    return CompletionAsserter;
}());
exports.CompletionAsserter = CompletionAsserter;
function applyEdits(document, edits) {
    var text = document.getText();
    var sortedEdits = edits.sort(function (a, b) { return document.offsetAt(b.range.start) - document.offsetAt(a.range.start); });
    var lastOffset = text.length;
    sortedEdits.forEach(function (e) {
        var startOffset = document.offsetAt(e.range.start);
        var endOffset = document.offsetAt(e.range.end);
        assert.ok(startOffset <= endOffset);
        assert.ok(endOffset <= lastOffset);
        text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
        lastOffset = startOffset;
    });
    return text;
}
//# sourceMappingURL=completion-test-util.js.map