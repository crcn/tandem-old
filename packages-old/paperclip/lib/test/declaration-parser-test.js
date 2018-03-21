"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../index");
describe(__filename + "#", function () {
    [
        ["bold", "bold"],
        ["--test", "--test"],
        ["10px", "10px"],
        ["10", "10"],
        ["rgba(0,0,0,1)", "rgba(0, 0, 0, 1)"],
        ["#F60", "#F60"],
        ["url('http://google.com')", "url(\"http://google.com\")"],
        ["0px #F60", "0px #F60"],
        ["2px sold var(--border-color-deep)", "2px sold var(--border-color-deep)"],
        ["10%", "10%"]
    ].forEach(function (_a) {
        var input = _a[0], output = _a[1];
        it("can parse " + input, function () {
            chai_1.expect(index_1.stringifyDeclarationAST(index_1.parseDeclaration(input).root)).to.eql(output);
        });
    });
});
//# sourceMappingURL=declaration-parser-test.js.map