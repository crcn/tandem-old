"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../");
var chai_1 = require("chai");
describe(__filename + "#", function () {
    [
        [{ type: _1.SlimVMObjectType.TEXT, value: "a" }, { type: _1.SlimVMObjectType.TEXT, value: "b" }, [
                {
                    target: undefined,
                    type: _1.SET_TEXT_NODE_VALUE,
                    newValue: "b"
                }
            ]],
        // element diff & patching
        [{
                type: _1.SlimVMObjectType.ELEMENT,
                tagName: "a",
                attributes: [{ name: "c", value: "1" }]
            },
            {
                type: _1.SlimVMObjectType.ELEMENT,
                tagName: "b",
                attributes: [{ name: "c", value: "2" }]
            }, [
                {
                    target: undefined,
                    index: undefined,
                    type: _1.SET_ATTRIBUTE,
                    name: "c",
                    oldName: undefined,
                    oldValue: undefined,
                    newValue: "2"
                }
            ]],
        [{
                type: _1.SlimVMObjectType.ELEMENT,
                tagName: "a",
                attributes: [{ name: "c", value: "1" }]
            },
            {
                type: _1.SlimVMObjectType.ELEMENT,
                tagName: "b",
                attributes: [{ name: "c", value: "2" }]
            }, [
                {
                    target: undefined,
                    index: undefined,
                    type: _1.SET_ATTRIBUTE,
                    name: "c",
                    oldName: undefined,
                    oldValue: undefined,
                    newValue: "2"
                }
            ]]
    ].forEach(function (_a) {
        var oldSource = _a[0], newSource = _a[1], diffs = _a[2];
        it("can diff " + JSON.stringify(oldSource) + " against " + JSON.stringify(newSource), function () {
            chai_1.expect(_1.diffNode(oldSource, newSource)).to.eql(diffs);
        });
    });
});
//# sourceMappingURL=diff-patch.js.map