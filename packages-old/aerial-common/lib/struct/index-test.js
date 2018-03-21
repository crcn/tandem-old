"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var lodash_1 = require("lodash");
var index_1 = require("./index");
describe(__filename + "#", function () {
    describe("typed#", function () {
        it("can make a typed struct factory", function () {
            var createShape = index_1.typed("shape", lodash_1.identity);
            var shape = createShape({ a: "b" });
            chai_1.expect(shape.$type).to.eql("shape");
        });
    });
    describe("idd#", function () {
        it("can make an id'd structure", function () {
            var createShape = index_1.idd(lodash_1.identity);
            var s1 = createShape({ a: 1 });
            var s2 = createShape({ a: 1 });
            chai_1.expect(s1.$id).to.eql("1");
            chai_1.expect(s1.a).to.eql(1);
        });
    });
});
//# sourceMappingURL=index-test.js.map