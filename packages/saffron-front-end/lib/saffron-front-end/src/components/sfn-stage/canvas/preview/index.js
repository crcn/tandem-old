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
class PreviewComponent extends React.Component {
    render() {
        const style = {
            zoom: this.props.zoom
        };
        return (React.createElement("div", {className: 'm-editor-stage-preview', style: style}, 
            React.createElement("div", {className: 'm-editor-stage-preview-inner'}, 
                React.createElement(registered_1.default, __assign({}, this.props, {ns: 'components/preview'}))
            )
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PreviewComponent;
//# sourceMappingURL=index.js.map