"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var state_1 = require("../state");
describe(__filename + "#", function () {
    var createSquareBounds = function (left, top) { return aerial_common2_1.createBounds(left, left + 100, top, top + 100); };
    var SYNTHETIC_WINDOW_FIXTURE_1 = state_1.createSyntheticWindow({
        bounds: aerial_common2_1.createBounds(0, 0, 1366, 768),
        allComputedBounds: {
            n1: aerial_common2_1.createBounds(0, 0, 1366, 768),
            n2: aerial_common2_1.createBounds(0, 0, 1366, 768),
            n21: createSquareBounds(500, 500),
            n211: createSquareBounds(500, 500),
            n212: createSquareBounds(500, 500),
        },
        allComputedStyles: {
            n2: {
                position: "relative",
                left: "0px",
                top: "0px",
                width: "1366px",
                height: "768px"
            },
            n21: {
                position: "relative",
                left: "500px",
                top: "500px",
                width: "600px",
                height: "600px",
                paddingLeft: "0px",
                paddingTop: "0px",
            },
            n211: {
                position: "relative",
                left: "0px",
                top: "0px",
                width: "100px",
                height: "100px"
            },
            n212: {
                position: "fixed",
                left: "500px",
                top: "500px",
                width: "100px",
                height: "100px"
            }
        },
        document: state_1.createSyntheticDocument({
            title: "document 1",
            childNodes: state_1.createSyntheticElement({
                $id: "n1",
                nodeName: "html",
                attributes: {},
                childNodes: [
                    state_1.createSyntheticElement({
                        nodeName: "head",
                        attributes: {},
                        childNodes: []
                    }),
                    state_1.createSyntheticElement({
                        $id: "n2",
                        parentId: "n1",
                        nodeName: "body",
                        attributes: {},
                        childNodes: [
                            state_1.createSyntheticElement({
                                $id: "n21",
                                parentId: "n2",
                                attributes: {},
                                nodeName: "bounds",
                                childNodes: [
                                    state_1.createSyntheticElement({
                                        $id: "n211",
                                        parentId: "n21",
                                        attributes: {},
                                        nodeName: "bounds",
                                        childNodes: []
                                    }),
                                    state_1.createSyntheticElement({
                                        $id: "n212",
                                        parentId: "n21",
                                        attributes: {},
                                        nodeName: "bounds",
                                        childNodes: []
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        })
    });
    var allNodes = {};
    aerial_common2_1.traverseObject(SYNTHETIC_WINDOW_FIXTURE_1, function (node) {
        if (node && node.constructor === Object && node.nodeType != null) {
            allNodes[node.$id] = node;
        }
    });
    // SYNTHETIC_WINDOW_FIXTURE_1.allNodes = allNodes;
    // describe("convertAbsoluteBoundsToRelative#", () => {
    //   [
    //     ["n21", createSquareBounds(600, 600), createSquareBounds(600, 600)],
    //     ["n211", createSquareBounds(600, 600), createSquareBounds(100, 100)],
    //     ["n212", createSquareBounds(600, 600), createSquareBounds(600, 600)]
    //   ].forEach(([id, absoluteBounds, relativeBounds]: [string, Bounds, Bounds]) => {
    //     it(`for fixture n2, converts absolute boudns of ${JSON.stringify(absoluteBounds)} to ${JSON.stringify(relativeBounds)}`, () => {
    //       expect(convertAbsoluteBoundsToRelative(absoluteBounds, SYNTHETIC_WINDOW_FIXTURE_1.allNodes[id] as SyntheticElement, SYNTHETIC_WINDOW_FIXTURE_1)).to.eql(relativeBounds);
    //     });
    //   }); 
    // });
});
//# sourceMappingURL=synthetic-element-bounds-test.js.map