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
const registered_1 = require('saffron-common/src/react/components/registered');
class ToolsComponent extends React.Component {
    render() {
        var entity = this.props.entity;
        var allEntities = entity.flatten();
        var currentTool = this.props.app.currentTool || {};
        var selectedEntities = this.props.app.selection || [];
        const zoom = this.props.app.zoom;
        return (React.createElement("div", {className: 'm-stage-tools'}, 
            React.createElement(registered_1.default, __assign({}, this.props, {ns: `components/tools/${currentTool.name}/**`, allEntities: allEntities, selection: selectedEntities, zoom: zoom}))
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolsComponent;
//# sourceMappingURL=index.js.map