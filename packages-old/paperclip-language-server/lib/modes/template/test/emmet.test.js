"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var completion_test_util_1 = require("../../test-util/completion-test-util");
var htmlParser_1 = require("../parser/htmlParser");
var htmlCompletion_1 = require("../services/htmlCompletion");
var setup = {
    langId: 'paperclip',
    docUri: 'test://test/test.html',
    doComplete: function (doc, pos) {
        var htmlDoc = htmlParser_1.parseHTMLDocument(doc);
        return htmlCompletion_1.doComplete(doc, pos, htmlDoc, []);
    }
};
var vueHtml = completion_test_util_1.testDSL(setup);
suite('Emmet Completion', function () {
    test('Emmet HTML Expansion', function () {
        (_a = ["ul>li*2|"], _a.raw = ["ul>li*2|"], vueHtml(_a)).has("ul>li*2").become("<ul>\n\t<li>${1}</li>\n\t<li>${2}</li>\n</ul>");
        (_b = ["div+p|"], _b.raw = ["div+p|"], vueHtml(_b)).has("div+p").become("<div>${1}</div>\n<p>${2}</p>");
        var _a, _b;
    });
    (_a = ["#header|"], _a.raw = ["#header|"], vueHtml(_a)).has("#header").become("<div id=\"header\">${1}</div>");
    var _a;
});
//# sourceMappingURL=emmet.test.js.map