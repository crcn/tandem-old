"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enhanced_1 = require("front-end/components/enhanced");
exports.ProjectGutterBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch;
    return React.createElement(enhanced_1.Gutter, { left: true, right: false },
        React.createElement(enhanced_1.ArtboardsPane, { artboards: workspace.artboards || [], dispatch: dispatch, workspace: workspace }),
        React.createElement(enhanced_1.ComponentsPane, { workspace: workspace, dispatch: dispatch }));
};
exports.ProjectGutter = exports.ProjectGutterBase;
// export * from "./file-navigator"; 
//# sourceMappingURL=index.js.map