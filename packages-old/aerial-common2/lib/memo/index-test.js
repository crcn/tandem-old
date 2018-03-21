"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("./index");
describe(__filename + "#", function () {
    describe("weakMemo#", function () {
        it("can memoize a function with an object that's already been processed", function () {
            var calls = 0;
            var mfn = index_1.weakMemo(function (_a) {
                var count = _a.count;
                calls++;
                return count + 1;
            });
            var obj = { count: 1 };
            chai_1.expect(mfn(obj)).to.eql(2);
            chai_1.expect(mfn(obj)).to.eql(2);
            chai_1.expect(calls).to.eql(1);
        });
        it("does not memoize two different objects that share the same shape", function () {
            var calls = 0;
            var mfn = index_1.weakMemo(function (_a) {
                var count = _a.count;
                calls++;
                return count + 1;
            });
            var obj = { count: 1 };
            chai_1.expect(mfn({ count: 1 })).to.eql(2);
            chai_1.expect(mfn({ count: 1 })).to.eql(2);
            chai_1.expect(calls).to.eql(2);
        });
        it("can take multiple arguments", function () {
            var calls = 0;
            var add = index_1.weakMemo(function (a, b) {
                calls++;
                return a.count + b.count;
            });
            var a = { count: 1 };
            var b = { count: 2 };
            chai_1.expect(add(a, b)).to.eql(3);
            chai_1.expect(add(a, b)).to.eql(3);
            chai_1.expect(calls).to.eql(1);
        });
        it("can take multiple arguments2", function () {
            var calls = 0;
            var add = index_1.weakMemo(function (a, b, c) {
                calls++;
                return a.count + b.count;
            });
            var a = { count: 1 };
            var b = { count: 2 };
            chai_1.expect(add(a, b, 1)).to.eql(3);
            chai_1.expect(add(a, b, 1)).to.eql(3);
            chai_1.expect(calls).to.eql(1);
        });
        it("can take multiple arguments3", function () {
            var calls = 0;
            var add = index_1.weakMemo(function (c) {
                calls++;
                return c;
            });
            chai_1.expect(add(1)).to.eql(1);
            chai_1.expect(add(1)).to.eql(1);
            chai_1.expect(calls).to.eql(1);
        });
    });
});
//# sourceMappingURL=index-test.js.map