"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
describe(__filename + "#", function () {
    describe("typed#", function () {
        it("can make a typed struct factory", function () {
            var createShape = utils_1.typed("shape", lodash_1.identity);
            var shape = createShape({ a: "b" });
            chai_1.expect(shape.$type).to.eql("shape");
        });
    });
    describe("idd#", function () {
        it("can make an id'd structure", function () {
            var createShape = utils_1.idd(lodash_1.identity);
            var s1 = createShape({ a: 1 });
            var s2 = createShape({ a: 1 });
            chai_1.expect(s1.$id).not.to.eql(undefined);
            chai_1.expect(s1.a).to.eql(1);
        });
    });
});
//# sourceMappingURL=utils-test.js.map