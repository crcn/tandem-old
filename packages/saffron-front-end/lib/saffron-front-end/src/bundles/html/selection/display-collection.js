"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const assert = require('assert');
const collection_1 = require('saffron-front-end/src/selection/collection');
const index_1 = require('saffron-common/src/object/index');
const observable_1 = require('saffron-common/src/decorators/observable');
const index_2 = require('saffron-common/src/fragments/index');
const index_3 = require('saffron-common/src/utils/geom/index');
let Preview = class Preview extends index_1.default {
    constructor(selection, bus) {
        super({});
        this.selection = selection;
        this.bus = bus;
    }
    setProperties(properties) {
        for (const entity of this.selection) {
            entity.preview.setProperties(properties);
        }
        super.setProperties(properties);
    }
    setPositionFromAbsolutePoint(point) {
        const bounds = this.getBoundingRect();
        this.selection.forEach(function (entity) {
            const pstyle = entity.preview.getBoundingRect();
            entity.preview.setPositionFromAbsolutePoint({
                left: point.left + (pstyle.left - bounds.left),
                top: point.top + (pstyle.top - bounds.top),
            });
        });
    }
    /**
     * returns the capabilities of the element - is it movable? Basically
     * things that turn tools on or off
     * @returns {{movable:Boolean}}
     */
    getCapabilities() {
        var capabilities = {};
        for (const item of this.selection) {
            const ic = item.preview.getCapabilities();
            for (const name in ic) {
                capabilities[name] = capabilities[name] === false ? false : ic[name];
            }
        }
        return capabilities;
    }
    /**
     *
     * @param bounds
     */
    setBoundingRect(bounds) {
        var cstyle = this.getBoundingRect(false);
        // otherwise reposition the items
        this.selection.forEach(function (entity) {
            var style = entity.preview.getBoundingRect(false);
            var percLeft = (style.left - cstyle.left) / cstyle.width;
            var percTop = (style.top - cstyle.top) / cstyle.height;
            var percWidth = style.width / cstyle.width;
            var percHeight = style.height / cstyle.height;
            entity.preview.setBoundingRect({
                left: bounds.left + bounds.width * percLeft,
                top: bounds.top + bounds.height * percTop,
                width: bounds.width * percWidth,
                height: bounds.height * percHeight,
            });
        });
    }
    /**
     * what is actually visible to the user - this is used by tools
     * @param zoomProperties
     */
    getBoundingRect(zoomProperties = false) {
        return index_3.mergeBoundingRects(this.selection.map(function (entity) {
            return entity.preview.getBoundingRect(zoomProperties);
        }));
    }
    /**
     * what is actually calculated in CSS
     */
    getStyle() {
        return index_3.mergeBoundingRects(this.selection.map(function (entity) {
            return entity.preview.getStyle();
        }));
    }
};
Preview = __decorate([
    observable_1.default
], Preview);
class HTMLEntitySelection extends collection_1.default {
    constructor(properties) {
        super(properties);
        this.preview = new Preview(this, this.bus);
    }
    set style(value) {
        this.forEach(function (entity) {
            entity.style = value;
        });
    }
    setAttribute(key, value) {
        for (const entity of this) {
            entity.setAttribute(key, value);
        }
    }
    get value() {
        return this.length ? this[0].value : void 0;
    }
    get type() {
        return this.length ? this[0].type : void 0;
    }
    get componentType() {
        return this.length ? this[0].componentType : void 0;
    }
    get attributes() {
        return this.length ? this[0].attributes : void 0;
    }
    setProperties(properties) {
        super.setProperties(properties);
        for (const item of this) {
            item.setProperties(properties);
        }
    }
    serialize() {
        return {
            type: 'html-selection',
            items: this.map(function (entity) {
                return entity.serialize();
            }),
        };
    }
    dispose() {
        this.preview.dispose();
    }
    notify(message) {
        this.preview.notify(message);
    }
    getStyle() {
        var selectionStyle = Object.assign({}, this[0].getStyle());
        // take away styles from here
        this.slice(1).forEach(function (entity) {
            const style = entity.style;
            for (const key in selectionStyle) {
                if (selectionStyle[key] !== style[key]) {
                    delete selectionStyle[key];
                }
            }
        });
        return selectionStyle;
    }
    deleteAll() {
        const deleted = this.splice(0, this.length);
        for (const entity of deleted) {
            assert(entity.parent, 'Attempting to delete selected entity which does not belong to any parent entity. Therefore it\'s a root entity, or it should not exist.');
            entity.parent.children.remove(entity);
        }
        return deleted;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HTMLEntitySelection;
exports.fragment = new index_2.ClassFactoryFragment('selection-collections/display', HTMLEntitySelection);
//# sourceMappingURL=display-collection.js.map