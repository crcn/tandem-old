// TODO - cache ALL computed information here until entity, or
// parent entity changes.

import BoundingRect from 'common/geom/bounding-rect';
// import { DisplayEntityComputer } from 'common/entities';
import CoreObject from 'common/object';
import { translateStyleToIntegers } from 'common/utils/css/translate-style';

import {
  translateStyle,
  translateLength as translateCSSLength
} from 'common/utils/css';

import {
  calculateZoom,
  multiplyStyle
} from 'common/utils/html';

function getElementOffset(entity) {
  var element = entity.preview.node;
  var p = element.parentNode;

  var left = 0;
  var top  = 0;

  var zoom = calculateZoom(element);

  while(p) {
    left += p.offsetLeft || 0;
    top  += p.offsetTop  || 0;
    left -= (p.scrollLeft || 0) / zoom;
    top  -= (p.scrollTop  || 0) / zoom;
    p = p.parentNode || p.host;
  }

  var frameOffset = getFrameOffset(entity);
  left += frameOffset.left;
  top  += frameOffset.top;

  return { left, top };
}

function getFrameOffset(entity) {
  var left = 0;
  var top  = 0;

  entity = entity.parentNode;

  while(entity) {
    if (entity.displayType === 'htmlFrame') {
      var bounds = entity.preview.getBoundingRect();
      left += bounds.left;
      top  += bounds.top;
    }

    entity = entity.parentNode;
  }

  return { left, top };
}

class ReactEntityPreview extends CoreObject {

  constructor(entity, node) {
    super({
      entity: entity,
      node  : node
    });
    this.getBoundingRect = this.getBoundingRect.bind(this);
  }

  setPositionFromAbsolutePoint(point) {

    // absolute positions are always in pixels - always round
    // to the nearest one
    var element = this.node;
    var offset  = getElementOffset(this.entity);

    var bounds = this.getBoundingRect(false);
    var style  = this.getStyle(false);

    var originLeft = bounds.left - style.left;
    var originTop  = bounds.top  - style.top ;

    var left = point.left;
    var top  = point.top;

    left -= offset.left;
    top  -= offset.top;

    // offset relative position (based on children)
    if (/relative|static/.test(style.position)) {
      left -= originLeft - offset.left;
      top -= originTop - offset.top;
    }

    var newStyle = translateStyle({
      left: left,
      top: top
    }, this.entity.style, element);


    this.entity.setProperties({ style: newStyle });
  }

  getZoom() {
    return calculateZoom(this.node);
  }

  getCapabilities() {

    var style = window.getComputedStyle(this.node);

    var movable   = style.position !== 'static';
    var resizable = /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display);

    return {
      movable,
      resizable
    };
  }

  setBoundingRect(bounds) {

    // NO zoom here - point is NOT fixed, but relative
    var absStyle = this.getStyle(false);

    var props = { ...bounds };

    var paddingWidth = absStyle.paddingLeft + absStyle.paddingRight;
    var paddingHeight = absStyle.paddingTop  + absStyle.paddingBottom;

    props.width = Math.max(props.width - paddingWidth, 0);
    props.height = Math.max(props.height - paddingHeight, 0);

    // convert px to whatever unit is set on the style
    Object.assign(props, translateStyle({
      width: props.width,
      height: props.height
    }, this.entity.style, this.node));

    // FIXME: wrong place here - this is just a quick
    // check to see if this *actually* works
    this.setPositionFromAbsolutePoint({
      left: bounds.left,
      top : bounds.top
    });

    delete props.left;
    delete props.top;

    this.entity.setProperties({ style: props });
  }

  toJSON() {
    return null;
  }

  /**
   * returns the computed property of the element along with all inherited styles.
   * TODO: This should be memoized -- very expensive operation
   * @returns {*}
   */

  getComputedStyle() {
    var cs   = window.getComputedStyle(this.node);
    // normalize computed styles to pixels
    return {
      position: cs.position,
      ...translateStyleToIntegers({
        marginLeft: cs.marginLeft,
        marginTop : cs.marginTop,
        marginRight: cs.marginRight,
        marginBottom: cs.marginBottom,
        paddingLeft: cs.paddingLeft,
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom
      }, this.node)
    }
  }

  getBoundingRect(zoomProperties) {

    var node = this.node;

    var entity = this.entity;
    var rect   = node.getBoundingClientRect();
    var cs     = this.getComputedStyle();
    var offset = getFrameOffset(this.entity);

    // margins are also considered bounds - add them here. Fixes a few issues
    // when selecting multiple items with different items & dragging them around.
    var left   = rect.left   - cs.marginLeft + offset.left;
    var top    = rect.top    - cs.marginTop + offset.top;
    var right  = rect.right  + cs.marginRight + offset.left;
    var bottom = rect.bottom + cs.marginBottom + offset.top;

    var width = right - left;
    var height = bottom - top;

    if (zoomProperties) {
      var {left, top, width, height } = multiplyStyle({ left, top, width, height }, this.getZoom());
    }

    right = left + width;
    bottom = top + height;

    return BoundingRect.create({
      left   : left,
      top    : top,
      right  : right,
      bottom : bottom
    });
  }

  getStyle(zoomProperties) {

    var node = this.node;

    var entity = this.entity;

    var style = entity.style;

    var { left, top } = translateStyleToIntegers({
      left: style.left || 0,
      top : style.top || 0
    }, node);

    var cs   = window.getComputedStyle(node);

    // normalize computed styles to pixels
    var cStyle = this.getComputedStyle();

    // zooming happens a bit further down
    var rect = this.getBoundingRect(false);
    var w = rect.right  - rect.left;
    var h = rect.bottom - rect.top;

    var style = {
      ...cStyle,
      left      : left,
      top       : top,
      width     : w,
      height    : h,

      // for rect consistency
      right     : left + w,
      bottom    : top  + h
    };

    // this normalizes the properties so that the calculated values
    // are also based on the zoom level. Important for overlay data such as
    // tools and information describing the target entity
    if (zoomProperties) {
      style = multiplyStyle(style, this.getZoom());
    }

    return style;
  }
}

export default ReactEntityPreview;
