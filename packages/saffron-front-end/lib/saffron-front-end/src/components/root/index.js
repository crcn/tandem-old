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
const index_1 = require('./center/index');
const index_2 = require('saffron-common/src/react/fragments/index');
class RootEditorComponent extends React.Component {
    render() {
        return (React.createElement("div", {className: 'm-editor'}, 
            React.createElement(index_1.default, __assign({}, this.props, {entity: this.props.app.rootEntity, zoom: 1}))
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootEditorComponent;
exports.fragment = new index_2.ReactComponentFactoryFragment('rootComponentClass', RootEditorComponent);
//# sourceMappingURL=index.js.map