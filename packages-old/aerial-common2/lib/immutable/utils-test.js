"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("./index");
describe(__filename + "#", function () {
    describe("immutable#", function () {
        it("can convert a simple object into an ImmutableObject", function () {
            chai_1.expect(index_1.immutable({})).to.be.an.instanceof(index_1.ImmutableObject);
        });
        it("can convert a simple object with props into an ImmutableObject", function () {
            var obj = index_1.immutable({ a: "b" });
            chai_1.expect(obj).to.be.an.instanceof(index_1.ImmutableObject);
            chai_1.expect(obj.a).to.eql("b");
        });
        it("can convert a simple array to an ImmutableArray", function () {
            var obj = index_1.immutable([]);
            chai_1.expect(obj).to.be.an.instanceof(index_1.ImmutableArray);
        });
        it("can convert a simple array with values to an ImmutableArray", function () {
            var obj = index_1.immutable([{ a: "b" }]);
            chai_1.expect(obj).to.be.an.instanceof(index_1.ImmutableArray);
            chai_1.expect(obj[0]).to.be.an.instanceof(index_1.ImmutableObject);
        });
        it("can convert a small nested object into an immutable one", function () {
            var obj = index_1.immutable([{ a: { b: "c" } }]);
            chai_1.expect(obj).to.be.an.instanceof(index_1.ImmutableArray);
            chai_1.expect(obj[0]).to.be.an.instanceof(index_1.ImmutableObject);
            chai_1.expect(obj[0].a).to.be.an.instanceof(index_1.ImmutableObject);
            chai_1.expect(obj[0].a.b).to.eql("c");
        });
    });
    describe("mutable#", function () {
        it("can convert an ImmutableObject into a mutable one", function () {
            var obj = index_1.mutable(index_1.immutable({}));
            obj.a = "b";
            chai_1.expect(obj.a).to.be.eql("b");
        });
        it("can convert an ImmutableArray", function () {
            var obj = index_1.mutable(index_1.immutable([{ a: "b" }]));
            obj[1] = 1;
            chai_1.expect(obj.length).to.eql(2);
            obj[0].c = "d";
            chai_1.expect(obj[0].c).to.eql("d");
        });
        it("can convert a nested immutable object into a mutable one", function () {
            var obj = index_1.mutable(index_1.immutable([{ a: { b: "c" } }]));
            obj[1] = 1;
            obj[0].b = "d";
            chai_1.expect(obj[0].b).to.eql("d");
        });
    });
    describe("mapImmutable#", function () {
        it("can map a simple object to another", function () {
            var obj = index_1.mapImmutable(index_1.immutable({ a: "b" }), { a: "c" });
            chai_1.expect(obj.a).to.eql("c");
        });
        index_1.mapImmutable({ name: 'string' }, function (a) { return ({ name: 'jeff' }); });
        // it("can map an immutable array", () => {
        //   const obj = mapImmutable(immutable([1, 2, 3, 4]), v => v.filter(v => v !== 3));
        //   expect(obj.length).to.eql(3);
        // });
        it("can map an immutable array's value based on an object", function () {
            var target = index_1.immutable([1, 2, 3]);
            var result = index_1.mapImmutable(target, (_a = {}, _a[target.indexOf(2)] = function (v) { return v * 10; }, _a));
            chai_1.expect(result.length).to.eql(3);
            chai_1.expect(result[1]).to.eql(20);
            var _a;
        });
    });
});
//# sourceMappingURL=utils-test.js.map