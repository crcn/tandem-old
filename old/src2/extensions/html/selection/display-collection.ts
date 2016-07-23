import * as assert from 'assert';
import Selection from 'saffron-front-end/src/selection/collection';
import CoreObject from 'saffron-common/src/object/index';
import observable from 'saffron-common/src/decorators/observable';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import BoundingRect from 'saffron-front-end/src/geom/bounding-rect';

// TODO - use existing group-preview class
@observable
class Preview extends CoreObject {

  constructor(public selection:any, public bus:any) {
    super({});
  }

  setProperties(properties) {
    for (const entity of this.selection) {
      entity.preview.setProperties(properties);
    }
    super.setProperties(properties);
  }

  setPositionFromAbsolutePoint(point) {

    const bounds = this.bounds;

    this.selection.forEach(function (entity) {
      const pstyle = entity.preview.bounds;
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

  get capabilities() {

    var capabilities = {};
    for (const item of this.selection) {
      const ic = item.preview.capabilities;
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

  set bounds(bounds:BoundingRect) {

    var cbounds = this.bounds;

    // otherwise reposition the items
    this.selection.forEach(function (entity) {
      var ebounds = entity.preview.bounds;

      var percLeft   = (ebounds.left - cbounds.left) / cbounds.width;
      var percTop    = (ebounds.top  - cbounds.top)  / cbounds.height;
      var percWidth  = (ebounds.width / cbounds.width);
      var percHeight = (ebounds.height / cbounds.height)

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

  get bounds() {
    return BoundingRect.merge(this.selection.map(function (entity) {
      return entity.preview.bounds;
    }));
  }

  /**
   * what is actually calculated in CSS
   */

  getStyle() {
    return BoundingRect.merge(this.selection.map(function (entity) {
      return entity.preview.getStyle();
    }));
  }
}

export default class HTMLEntitySelection extends Selection {

  public preview:any;
  public bus:any;

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

export const fragment = new ClassFactoryFragment('selection-collections/display', HTMLEntitySelection);