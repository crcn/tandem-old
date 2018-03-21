"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var array_1 = require("./array");
describe(__filename + "#", function () {
    it("can be created without values", function () {
        var array = array_1.createImmutableArray();
        chai_1.expect(array).to.be.an.instanceof(array_1.ImmutableArray);
        chai_1.expect(array).to.be.an.instanceof(Array);
    });
    it("cannot define a property in the immutable array", function () {
        var array = array_1.createImmutableArray(1, 2, 3);
        try {
            array[0] = 2;
        }
        catch (e) {
            chai_1.expect(e.message).to.contain("Cannot assign to read only property");
        }
        chai_1.expect(array[0]).to.equal(1);
    });
    it('can set an index value with set()', function () {
        var array = array_1.createImmutableArray(1, 2, 3);
        var newArray = array.set(0, 4);
        chai_1.expect(array === newArray).to.eql(false);
        chai_1.expect(newArray[0]).to.eql(4);
        chai_1.expect(array[0]).to.eql(1);
    });
    describe("native array compliance#", function () {
        it("can be merged to an existing array via concat()", function () {
            var array = [].concat(array_1.createImmutableArray(0, 1, 2));
            chai_1.expect(array instanceof array_1.ImmutableArray).to.eql(false);
            chai_1.expect(array.length).to.equal(3);
        });
        it("can be spread to a new array", function () {
            var items = array_1.createImmutableArray(1, 2, 3).slice();
            chai_1.expect(items.length).to.eql(3);
        });
    });
});
//# sourceMappingURL=array-test.js.map