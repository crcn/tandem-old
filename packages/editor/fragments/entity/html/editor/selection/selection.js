import BaseCollection from 'common/collection';
import { clone } from 'common/utils/object';

class Preview {
  constructor(selection) {
    this.selection = selection;
  }

  setPositionFromAbsolutePoint(point) {

    var bounds = this.getBounds();

    this.selection.map(function(entity) {
      var pstyle = entity.preview.getStyle();
      entity.preview.setPositionFromAbsolutePoint({
        left: point.left + (pstyle.left - bounds.left),
        top : point.top  + (pstyle.top  - bounds.top)
      });
    });
  }

  getStyle() {
    return this.getBounds();
  }

  getBounds() {
    var allStyles = this.selection.map(function(entity) {
      return entity.preview.getStyle();
    });

    var bounds = {
      top    : Infinity,
      bottom : -Infinity,
      left   : Infinity,
      right  : -Infinity
    };

    for (var style of allStyles) {

      bounds.left   = Math.min(bounds.left, style.left);
      bounds.right  = Math.max(bounds.right, style.left + style.width);
      bounds.top    = Math.min(bounds.top, style.top);
      bounds.bottom = Math.max(bounds.bottom, style.top + style.height);
    }

    bounds.width  = bounds.right - bounds.left;
    bounds.height = bounds.bottom - bounds.top;

    return bounds;
  }

  getZoomedStyle() {
    return this.selection[0].preview.getZoomedStyle();
  }
}

class HTMLEntitySelection extends BaseCollection {

  constructor() {
    super();
    this.preview = new Preview(this);
  }

  setStyle(style) {
    this.forEach(function(entity) {
      entity.setStyle(style);
    })
  }

  get type () {
    return this[0].type;
  }

  get componentType() {
    return this[0].componentType;
  }

  get attributes() {
    return this[0].attributes;
  }

  getStyle() {
    var selectionStyle = clone(this[0].getStyle());

    // take away styles from here

    this.slice(1).forEach(function(entity) {
      var style = entity.getStyle();
      for (var key in selectionStyle) {
        if (selectionStyle[key] !== style[key]) {
          delete selectionStyle[key];
        }
      }
    });

    return selectionStyle;
  }
}

export default HTMLEntitySelection;