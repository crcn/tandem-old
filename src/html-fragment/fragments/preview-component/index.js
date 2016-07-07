import { BaseComponent, TemplateComponent, dom } from 'paperclip';
import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import RepeatComponent from 'common/components/repeat';
import { ComponentFactoryFragment } from 'paperclip/fragments';
import { translateStyleToIntegers } from 'common/utils/css/translate-style';
import HTMLComponent from 'common/components/html';
import BoundingRect from 'common/geom/bounding-rect';
import sift from 'sift';

function getPreviewRect(node) {
  var p = node;

  // todo - should be something such as data-root
  while(p && !/m-preview/.test(p.getAttribute('class'))) {
    p = p.parentNode;
  }

  if (p) return p.getBoundingClientRect();
  return  {};
}

@observable
class HTMLNodePreview extends CoreObject {
  constructor(entity) {
    super();

    this.entity = entity;
    this.entity.setProperties({ preview: this });
    this.node = this.createNode();

    setTimeout(() => {
      this.setProperties({ a: 'b' });
    }, 1);
  }

  getBoundingRect(zoomProperties) {
    var node = this.node;

    var entity = this.entity;
    var rect   = node.getBoundingClientRect();
    var cs     = this.getComputedStyle();
    var pnr    = getPreviewRect(node);

    var offsetLeft = pnr.left;
    var offsetTop  = pnr.top;

    // margins are also considered bounds - add them here. Fixes a few issues
    // when selecting multiple items with different items & dragging them around.
    var left   = rect.left   - cs.marginLeft - offsetLeft;
    var top    = rect.top    - cs.marginTop  - offsetTop;
    var right  = rect.right  + cs.marginRight - offsetLeft;
    var bottom = rect.bottom + cs.marginBottom - offsetTop;

    var width = right - left;
    var height = bottom - top;

    // if (zoomProperties) {
    //   var {left, top, width, height } = multiplyStyle({ left, top, width, height }, this.getZoom());
    // }

    right = left + width;
    bottom = top + height;

    return BoundingRect.create({
      left   : left,
      top    : top,
      right  : right,
      bottom : bottom
    });
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
}

class HTMLElementPreview extends HTMLNodePreview {

  createNode() {
    var element = document.createElement(this.entity.name);

    if (this.entity.style) {
      Object.assign(element.style, this.entity.style);
    }

    for (var key in this.entity.attributes) {
      element.setAttribute(key, this.entity.attributes[key]);
    }

    this.entity.childNodes.map(createNodePreview).forEach(function(preview) {
      element.appendChild(preview.node);
    });

    return element;
  }
}
class HTMLTextPreview extends HTMLNodePreview {
  createNode() {
    var node = document.createElement('span');
    node.appendChild(document.createTextNode(this.entity.nodeValue));
    return node;
  }
}

class HTMLFramePreview extends HTMLNodePreview {

}

function createNodePreview(entity) {
  switch(entity.displayType) {
    case 'htmlElement': return new HTMLElementPreview(entity);
    case 'htmlText'   : return new HTMLTextPreview(entity);
    case 'htmlFrame'  : return new HTMLFramePreview(entity);
  }
}

export default class PreviewComponent extends TemplateComponent {
  static template = <div class='m-preview'>
    <HTMLComponent value={function({ application }) {
      var { rootEntity } = application;
      return rootEntity ? createNodePreview(rootEntity).node : void 0;
    }} />
  </div>
}

export const fragment = ComponentFactoryFragment.create('components/preview', PreviewComponent);
