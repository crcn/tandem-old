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
const lodash_1 = require('lodash');
const index_1 = require('./ruler/index');
const index_2 = require('./guide/index');
const index_3 = require('./resizer/index');
const index_4 = require('saffron-common/src/utils/geom/index');
const index_5 = require('saffron-common/src/react/fragments/index');
class SelectorComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            moving: false,
        };
    }
    get targetPreview() {
        return this.props.selection.preview;
    }
    render() {
        const { selection } = this.props;
        const preview = selection.preview;
        if (!preview)
            return null;
        const sections = {};
        if (this.targetPreview.moving) {
            sections.guides = (React.createElement("div", null, 
                React.createElement(index_1.default, __assign({}, this.props)), 
                this.state.dragBounds ? React.createElement(index_2.default, __assign({}, this.props, {bounds: this.state.dragBounds})) : void 0));
        }
        const entireBounds = index_4.mergeBoundingRects(lodash_1.flatten(selection.map(function (entity) {
            return entity.flatten().map(function (entity2) {
                return entity2.preview ? entity2.preview.getBoundingRect(true) : void 0;
            });
        })));
        const boundsStyle = {
            position: 'absolute',
            left: entireBounds.left + 1,
            top: entireBounds.top + 1,
            width: entireBounds.width - 1,
            height: entireBounds.height - 1,
        };
        return (React.createElement("div", {className: 'm-selector-component'}, 
            React.createElement(index_3.default, __assign({}, this.props)), 
            React.createElement("div", {className: 'm-selector-component--bounds', style: boundsStyle}), 
            sections.guides, 
            sections.size));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectorComponent;
exports.fragment = new index_5.ReactComponentFactoryFragment('components/tools/pointer/selector', SelectorComponent);
//# sourceMappingURL=index.js.map