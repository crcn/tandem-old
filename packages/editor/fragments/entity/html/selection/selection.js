import BaseCollection from 'common/collection';
import { clone } from 'common/utils/object';
import { SetFocusMessage } from 'editor/message-types';

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

  setBounds(bounds) {

    var cbounds = this.getBounds();

    // otherwise reposition the items
    this.selection.forEach(function(entity) {
      var style = entity.preview.getStyle();

      var percLeft   = (style.left - bounds.left) / cbounds.width;
      var percTop    = (style.top  - bounds.top)  / cbounds.height;
      var percWidth  = style.width / cbounds.width;
      var percHeight = style.height / cbounds.height;

      entity.preview.setBounds({
        left: bounds.left + bounds.width * percLeft,
        top: bounds.top + bounds.height * percTop,
        width: bounds.width * percWidth,
        height: bounds.height * percHeight
      });
    });
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
}

class HTMLEntitySelection extends BaseCollection {

  constructor(properties) {
    super(properties);
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

  serialize() {
    return {
      type: 'html-selection',
      items: this.map(function(entity) {
        return entity.serialize();
      })
    };
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

  deleteAll() {

    for (var entity of this) {
      var entityIndex  = entity.parent.children.indexOf(focus);
      //var nextSibling = entityIndex ? entity.parent.children[entityIndex - 1] : entity.parent.children[entityIndex + 1];

      // remove the child deleted
      entity.parent.children.remove(entity);
    }

  }
}

export default HTMLEntitySelection;