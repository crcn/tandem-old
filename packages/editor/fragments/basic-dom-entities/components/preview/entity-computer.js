import { DisplayEntityComputer } from 'editor/entities';
import { translateStyleToIntegers } from 'common/utils/html/css/translate-style';;

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

  getZoom() {
    return calculateZoom(this.displayObject.refs.element);
  }

  getZoomedStyle() {
    var style = this.getStyle();
    var zoom  = this.getZoom();

    // TODO - use scale util
    return {
      left   : style.left   * zoom,
      top    : style.top    * zoom,
      width  : style.width  * zoom,
      height : style.height * zoom
    };
  }

  getStyle() {

    var refs = this.displayObject.refs;

    if (!refs.element) {
      console.warn('trying to calculate display information on entity that is not mounted');
      return { };
    }

    var entity = this.entity;

    // eeeesh - this is yucky, but we *need* to offset the position
    // of the preview canvas so that we can get the correct position
    // of this element. This is the *simplest* solution I can think of.
    var pcrect = document.getElementById('preview-canvas').getBoundingClientRect();

    var rect = refs.element.getBoundingClientRect();
    var cs   = window.getComputedStyle(refs.element);

    var w = rect.right  - rect.left;
    var h = rect.bottom - rect.top;

    var resizable = cs.display !== 'inline';
    var zoom = this.getZoom();

    var style = entity.getStyle();

    // left & top positions are not computed properly in Chrome
    // if an element is zoomed out. Need to translate the style stored
    // on the entity, compute that with the given element, then return the style
    var { left, top } = translateStyleToIntegers({
      left: style.left || (rect.left - pcrect.left),
      top : style.top  || (rect.top  - pcrect.top)
    }, refs.element);


    return {
      resizable : resizable,
      zoom      : zoom,
      left      : left,
      top       : top,
      width     : w,
      height    : h
    };
  }
}

export default ReactEntityComputer;
