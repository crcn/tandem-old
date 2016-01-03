import { DisplayEntityComputer } from 'common/entities';
import { translateStyleToIntegers } from 'common/utils/html/css/translate-style';
import BoundingRect from 'common/geom/bounding-rect';

import {
  translateStyle,
  translateLength as translateCSSLength
} from 'common/utils/html/css';

import {
  calculateZoom
} from 'common/utils/html';

class ReactEntityComputer extends DisplayEntityComputer {

  setPositionFromAbsolutePoint(point) {

    // absolute positions are always in pixels - always round
    // to the nearest one
    var newStyle = translateStyle({
      left: point.left,
      top: point.top
    }, this.entity.getStyle(), this.getDisplayElement());

    this.entity.setStyle(newStyle);
  }

  getZoom() {
    return calculateZoom(this.getDisplayElement());
  }

  getDisplayElement() {
    return this.displayObject.refs.element;
  }

  setBounds(bounds) {

    // NO zoom here - point is NOT fixed, but relative
    var absStyle = this.getStyle();
    var entStyle = this.entity.getStyle();

    var props = { ...bounds };
    for (var k in bounds) {
      if (entStyle[k] == void 0) continue;

      // TODO - want to use translateStyle here instead
      props[k] = translateCSSLength(
        absStyle[k],
        entStyle[k],
        bounds[k]
      );
    }

    this.entity.setStyle(props);
  }

  toJSON() {
    return null;
  }

  getBoundingRect() {

    var refs = this.displayObject.refs;

    if (!refs.element) {
      throw new Error('trying to calculate display information on entity that is not mounted');
      return { };
    }

    var entity = this.entity;

    // eeeesh - this is yucky, but we *need* to offset the position
    // of the preview canvas so that we can get the correct position
    // of this element. This is the *simplest* solution I can think of.
    // TODO - this *will not work* when we start adding multiple canvases
    var pcrect = document.getElementById('preview-canvas').getBoundingClientRect();
    var rect = refs.element.getBoundingClientRect();

    var zoom = calculateZoom(refs.element);

    var left   = rect.left   - pcrect.left;
    var top    = rect.top    - pcrect.top;
    var right  = rect.right  - pcrect.left;
    var bottom = rect.bottom - pcrect.top;

    var width = right - left;
    var height = bottom - top;

    left *= zoom;
    top  *= zoom;
    width *= zoom;
    height *= zoom;

    right = left + width;
    bottom = top + height;

    return BoundingRect.create({
      left   : left,
      top    : top,
      right  : right,
      bottom : bottom
    });
  }

  getStyle() {

    var refs = this.displayObject.refs;

    var rect = this.getBoundingRect();

    var entity = this.entity;

    var cs   = window.getComputedStyle(refs.element);

    var w = rect.right  - rect.left;
    var h = rect.bottom - rect.top;

    var resizable = cs.display !== 'inline';
    var style = entity.getStyle();

    var left = style.left || 0;
    var top  = style.top || 0;

    if (left) left = translateStyleToIntegers({
      left: left
    }, refs.element).left;

    if (top) top = translateStyleToIntegers({
      top: top
    }, refs.element).top;

    return {
      resizable : resizable,
      left      : left,
      top       : top,
      width     : w,
      height    : h
    };
  }
}

export default ReactEntityComputer;
