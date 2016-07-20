"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
require('./index.scss');
const cx = require('classnames');
const React = require('react');
const lodash_1 = require('lodash');
const index_1 = require('saffron-front-end/src/actions/index');
const index_2 = require('saffron-common/src/utils/geom/index');
const index_3 = require('saffron-common/src/react/fragments/index');
class SelectableComponent extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    onMouseDown(event) {
        this.onMouseOut(event);
        this.props.bus.execute(new index_1.SelectAction(this.props.entity, event.shiftKey));
        event.stopPropagation();
    }
    onMouseOver() {
        this.props.app.setProperties({
            hoverItem: this.props.entity,
        });
    }
    onMouseOut(event) {
        this.props.app.setProperties({
            hoverItem: void 0,
        });
    }
    render() {
        var { entity, selection, app } = this.props;
        if (!entity.preview || entity.selectable === false)
            return null;
        const entities = entity.flatten();
        if (lodash_1.intersection(entities, selection || []).length)
            return null;
        const bounds = index_2.mergeBoundingRects(entities.map(function (entity2) {
            return entity2.preview ? entity2.preview.getBoundingRect(true) : void 0;
        }).filter(function (value) {
            return !!value;
        }));
        const classNames = cx({
            'm-selectable': true,
            hover: app.hoverItem === entity
        });
        const style = {
            background: 'transparent',
            position: 'absolute',
            width: bounds.width,
            height: bounds.height,
            left: bounds.left,
            top: bounds.top
        };
        return (React.createElement("div", {style: style, className: classNames, onMouseOver: this.onMouseOver.bind(this), onMouseOut: this.onMouseOut.bind(this), onMouseDown: this.onMouseDown.bind(this)}));
    }
}
class SelectablesComponent extends React.Component {
    render() {
        const selection = this.props.selection || [];
        const allEntities = this.props.allEntities;
        // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.
        if (selection.preview && selection.preview.moving)
            return null;
        // if (selection.preview.currentTool.type !== 'pointer') return null;
        const selectables = allEntities.filter((entity) => (!!entity.preview)).map((entity) => (React.createElement(SelectableComponent, __assign({}, this.props, {selection: selection, entity: entity, key: entity.id}))));
        return (React.createElement("div", null, 
            " ", 
            selectables, 
            " "));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectablesComponent;
exports.fragment = new index_3.ReactComponentFactoryFragment('components/tools/pointer/selectable', SelectablesComponent);
//# sourceMappingURL=index.js.map