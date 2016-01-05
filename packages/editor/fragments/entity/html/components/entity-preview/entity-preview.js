// TODO - cache ALL computed information here until entity, or
// parent entity changes.

import memoize from 'memoizee';
import BoundingRect from 'common/geom/bounding-rect';
import { DisplayEntityComputer } from 'common/entities';
import { translateStyleToIntegers } from 'common/utils/html/css/translate-style';
import InvalidatePropChanges from 'common/components/mixins/invalidate-prop-changes';

import {
  translateStyle,
  translateLength as translateCSSLength
} from 'common/utils/html/css';

import {
  calculateZoom,
  multiplyStyle
} from 'common/utils/html';

class ReactEntityComputer extends DisplayEntityComputer {

  constructor(entity, component) {
    super(entity, component);

    // todo - don't do this - instead setup memoization to check
    // global cache key - if changed then return new result. This
    // will cut down on listeners drastically
    this.entity.notifier.push(this);
    this.getBoundingRect = memoize(this.getBoundingRect.bind(this), { primitive: true });
    this.getStyle = memoize(this.getStyle.bind(this), { primitive: true });
  }

  notify(message) {
    this.getBoundingRect.clear();
    this.getStyle.clear();
  }

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

  getCapabilities() {

    var style = window.getComputedStyle(this.getDisplayElement());

    var movable   = style.position !== 'static';
    var resizable = /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display);

    return {
      movable,
      resizable
    };
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

  _clearCache() {
    this._memos = {};
  }

  toJSON() {
    return null;
  }

  getBoundingRect(zoomProperties = false) {

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

  getStyle(zoomProperties = false) {

    var refs = this.displayObject.refs;


    var entity = this.entity;


    var style = entity.getStyle();

    var left = style.left || 0;
    var top  = style.top  || 0;

    // this might happen then the user is changing the css styles
    try {
      if (left) left = translateStyleToIntegers({
        left: left
      }, refs.element).left;
    } catch(e) {
      console.warn('style left is not valid, setting to 0');
      left = 0;
    }

    try {
      if (top) top = translateStyleToIntegers({
        top: top
      }, refs.element).top;
    } catch(e) {
      console.warn('style top is not valid, setting to 0');
      top = 0;
    }

    var cs   = window.getComputedStyle(refs.element);

    // normalize computed styles to pixels
    var cStyle = translateStyleToIntegers({
      marginLeft: cs.marginLeft,
      marginTop : cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      paddingLeft: cs.paddingLeft,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom
    }, refs.element);

    // zooming happens a bit further down
    var rect = this.getBoundingRect(false);
    var w = rect.right  - rect.left;
    var h = rect.bottom - rect.top;

    var style = {
      ...cStyle,
      left      : left,
      top       : top,
      width     : w,
      height    : h
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

export default ReactEntityComputer;
