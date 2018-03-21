"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var tree_1 = require("./tree");
;
describe(__filename + "#", function () {
    describe("getParentNode", function () {
        it("can return the parent of a node", function () {
            var tree = {
                $id: "1",
                childNodes: [
                    {
                        $id: "2",
                        childNodes: [
                            {
                                $id: "3",
                                childNodes: []
                            },
                            {
                                $id: "4",
                                childNodes: []
                            }
                        ]
                    }
                ]
            };
            var node = tree_1.findTreeNode(tree, function (node) { return node.$id === "4"; });
            chai_1.expect(node.$id).to.eql("4");
            var parentNode = tree_1.getTreeNodeParent(node, tree);
            chai_1.expect(parentNode.$id).to.eql("2");
        });
    });
});
//# sourceMappingURL=tree-test.js.map