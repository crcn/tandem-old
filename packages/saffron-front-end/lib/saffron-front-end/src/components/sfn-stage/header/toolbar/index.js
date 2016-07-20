"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
require('./index.scss');
const React = require('react');
const tool_1 = require('./tool');
class ToolsComponent extends React.Component {
    render() {
        // TODO - these can be added as entries as well
        return (React.createElement("div", {className: 'm-editor-toolbar'}, 
            React.createElement("ul", {className: 'm-toolbar-tools'}, this
                .props
                .app
                .stageTools
                .filter((stageTool) => !!stageTool.icon).map((stageTool) => (React.createElement(tool_1.default, __assign({}, this.props, {tool: stageTool, key: stageTool.name})))))
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolsComponent;
//# sourceMappingURL=index.js.map