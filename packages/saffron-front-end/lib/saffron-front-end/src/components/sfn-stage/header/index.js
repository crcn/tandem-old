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
const index_1 = require('./toolbar/index');
class StageEditorHeaderComponent extends React.Component {
    render() {
        return (React.createElement("div", {className: 'm-editor-stage-header'}, 
            React.createElement(index_1.default, __assign({}, this.props))
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StageEditorHeaderComponent;
//# sourceMappingURL=index.js.map