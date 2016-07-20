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
class FooterComponent extends React.Component {
    render() {
        // TODO - add more project information here such as file name
        // TODO - ability to edit canvas width & height in the footer
        // TODO - each one of these should be slideable, or be their own button
        const app = this.props.app;
        const { zoom } = app;
        return (React.createElement("div", {className: 'm-preview-footer'}, 
            Math.round((zoom || 0) * 100), 
            "%", 
            React.createElement(registered_1.default, __assign({}, this.props, {ns: 'components/stage/footer'}))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FooterComponent;
//# sourceMappingURL=index.js.map