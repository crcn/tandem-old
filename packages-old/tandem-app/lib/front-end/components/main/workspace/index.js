"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var recompose_1 = require("recompose");
var element_gutter_1 = require("./element-gutter");
var project_gutter_1 = require("./project-gutter");
var stage_1 = require("./stage");
// import { TextEditor } from "./text-editor";
var breadcrumbs_1 = require("./breadcrumbs");
var react_dnd_1 = require("react-dnd");
var react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
var banner_1 = require("front-end/components/banner");
exports.WorkspaceBase = function (_a) {
    var state = _a.state, workspace = _a.workspace, dispatch = _a.dispatch;
    var stage = workspace.stage;
    return React.createElement("div", { className: "workspace-component" },
        stage.showLeftGutter ? React.createElement(project_gutter_1.ProjectGutter, { workspace: workspace, dispatch: dispatch }) : null,
        React.createElement("div", { className: "workspace-editors" },
            React.createElement(banner_1.WorkspaceBanner, { workspace: workspace, dispatch: dispatch }),
            React.createElement("div", { className: "workspace-stage" },
                React.createElement(stage_1.Stage, { workspace: workspace, dispatch: dispatch }),
                React.createElement(breadcrumbs_1.Breadcrumbs, { workspace: workspace, dispatch: dispatch }))),
        stage.showRightGutter ? React.createElement(element_gutter_1.ElementGutter, { workspace: workspace, dispatch: dispatch }) : null);
};
exports.Workspace = recompose_1.compose(recompose_1.pure, react_dnd_1.DragDropContext(react_dnd_html5_backend_1.default))(exports.WorkspaceBase);
//# sourceMappingURL=index.js.map