import assert from 'assert';
import Selection from 'editor-fragment/selection/collection';
import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import { FactoryFragment } from 'common/fragments';
import { calculateBoundingRect } from 'common/utils/geom';

@observable
class Preview extends CoreObject {
  constructor(selection, bus) {
    super({
      selection: selection,
      bus: bus,
    });
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
        top : point.top  + (pstyle.top  - bounds.top),
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

      var percLeft   = (style.left - cstyle.left) / cstyle.width;
      var percTop    = (style.top  - cstyle.top)  / cstyle.height;
      var percWidth  = style.width / cstyle.width;
      var percHeight = style.height / cstyle.height;

      entity.preview.setBoundingRect({
        left  : bounds.left + bounds.width * percLeft,
        top   : bounds.top + bounds.height * percTop,
        width : bounds.width * percWidth,
        height: bounds.height * percHeight,
      });
    });
  }

  /**
   * what is actually visible to the user - this is used by tools
   * @param zoomProperties
   */

  getBoundingRect(zoomProperties) {
    return calculateBoundingRect(this.selection.map(function (entity) {
      return entity.preview.getBoundingRect(zoomProperties);
    }));
  }

  /**
   * what is actually calculated in CSS
   */

  getStyle() {
    return calculateBoundingRect(this.selection.map(function (entity) {
      return entity.preview.getStyle();
    }));
  }
}

class HTMLEntitySelection extends Selection {

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

export const fragment = FactoryFragment.create(
  'selectorCollection/display',
  HTMLEntitySelection
);
