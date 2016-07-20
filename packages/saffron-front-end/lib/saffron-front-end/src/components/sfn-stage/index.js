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
const index_1 = require('./header/index');
const index_2 = require('./footer/index');
const index_3 = require('./canvas/index');
const index_4 = require('saffron-common/src/react/fragments/index');
class StageComponent extends React.Component {
    render() {
        var file = this.props.file;
        var entity = file.entity;
        // entity might not have been loaded yet
        if (!entity)
            return null;
        return (React.createElement("div", {className: 'm-editor-stage noselect'}, 
            React.createElement(index_1.default, __assign({}, this.props)), 
            React.createElement(index_3.default, __assign({}, this.props, {entity: entity, zoom: this.props.app.zoom})), 
            React.createElement(index_2.default, __assign({}, this.props))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StageComponent;
exports.fragment = new index_4.ReactComponentFactoryFragment('components/stage/sfn', StageComponent);
//# sourceMappingURL=index.js.map