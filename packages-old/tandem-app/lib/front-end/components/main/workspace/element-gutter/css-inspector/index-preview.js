"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("front-end/scss/index.scss");
var React = require("react");
var index_1 = require("./index");
var state_1 = require("front-end/state");
exports.Preview = function () {
    var window = state_1.createSyntheticWindow({
        document: state_1.createSyntheticDocument({
            childNodes: [
                state_1.createSyntheticElement({
                    nodeName: "SPAN",
                    attributes: [],
                    childNodes: []
                })
            ]
        })
    });
    var workspace = state_1.createWorkspace({
        selectionRefs: [[state_1.SYNTHETIC_ELEMENT, "e1"]]
    });
    return React.createElement(index_1.CSSInspector, { browser: null, workspace: workspace, dispatch: null });
};
console.log(module["hot"]);
//# sourceMappingURL=index-preview.js.map