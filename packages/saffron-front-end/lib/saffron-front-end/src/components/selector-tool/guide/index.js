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
const index_1 = require('../line/index');
class GuideComponent extends React.Component {
    render() {
        const bounds = this.props.bounds;
        const preview = this.props.app.preview;
        return (React.createElement("div", {className: 'm-guide'}, 
            ~bounds.guideLeft ?
                React.createElement(index_1.default, __assign({}, this.props, {bounds: {
                    left: bounds.guideLeft,
                    top: 0,
                    width: 1,
                    height: preview.canvasHeight,
                    direction: 'ns',
                }, showStems: false, showDistance: false}))
                : void 0, 
            ~bounds.guideTop ?
                React.createElement(index_1.default, __assign({}, this.props, {bounds: {
                    left: 0,
                    top: bounds.guideTop,
                    width: preview.canvasWidth,
                    height: 1,
                    direction: 'ew',
                }, showStems: false, showDistance: false}))
                : void 0));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GuideComponent;
//# sourceMappingURL=index.js.map