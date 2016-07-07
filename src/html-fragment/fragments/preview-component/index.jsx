import React from 'react';
import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import { ReactComponentFactoryFragment } from 'common/react/fragments';
import { translateStyleToIntegers } from 'common/utils/css/translate-style';
import BoundingRect from 'common/geom/bounding-rect';
import sift from 'sift';
import EntityPreview from './entity-preview';

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
    this.node = this.createNode();
    this.entity.setProperties({ preview: new EntityPreview(this.entity, this.node) });
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

export default class PreviewComponent extends React.Component {

  componentDidMount() {
    this.refs.preview.appendChild(createNodePreview(this.props.entity).node);
  }

  render() {
    return <div className='m-preview' ref='preview'>

    </div>;
  }
}

export const fragment = ReactComponentFactoryFragment.create('components/preview', PreviewComponent);
