import React from 'react';
import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import { ReactComponentFactoryFragment } from 'common/react/fragments';
import { translateStyleToIntegers } from 'common/utils/css/translate-style';
import { EmptyResponse } from 'mesh';
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

function convertStyle(style) {
  var converted = {};
  for (var key in style) {
    var v = style[key];
    if (/left|top|margin|width|height/.test(key) && !isNaN(v)) {
      v = v + 'px';
    }
    converted[key] = v;
  }
  return converted;
}

class HTMLNodePreview extends CoreObject {
  constructor(entity) {
    super();

    this.entity = entity;
    this.node = this.createNode();
    this.entity.setProperties({ preview: EntityPreview.create(this.entity, this.node) });
  }

  dispose() {
    this.entity.bus.remove(this);
  }

  execute(event) {
    if (event.type !== 'change') return;
    this._didChange = this._didChange || !!event.changes.find((change) => {
      return change.target === this.entity;
    });

    this.update();
  }

  update() {
    if (this._didChange || true) {
      this._didChange = false;
      this.didChange();
    }
  }

  didChange() {

  }
}

class HTMLElementPreview extends HTMLNodePreview {

  didChange() {
    if (this.entity.style) {
      Object.assign(this.node.style, convertStyle(this.entity.style));
    }

    for (var key in this.entity.attributes) {
      if (/style/.test(key)) continue;
      this.node.setAttribute(key, this.entity.attributes[key]);
    }
  }

  update() {
    super.update();
    for (var child of this.childNodes) {
      child.update();
    }
  }

  dispose() {
    super.dispose();
    for (var child of this.childNodes) {
      child.dispose();
    }
  }

  createNode() {
    var element = document.createElement(this.entity.nodeName);

    if (this.entity.style) {
      Object.assign(element.style, this.entity.style);
    }

    for (var key in this.entity.attributes) {
      element.setAttribute(key, this.entity.attributes[key]);
    }

    (this.childNodes = this.entity.childNodes.map(createNodePreview)).forEach(function(preview) {
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

class HTMLFramePreview extends HTMLElementPreview {
  createNode() {
    var node = document.createElement('iframe');

    Object.assign(node.style, {
      position: 'absolute',
      border: '0px',
      overflow: 'scroll',
      backgroundColor: '#FFF'
    }, this.entity.style);

    node.addEventListener('load', () => {
      var body = node.contentWindow.document.body;
      body.style.margin =
      body.style.padding =
      '0px';

      (this.childNodes = this.entity.childNodes.map(createNodePreview)).forEach(function(preview) {
        node.contentWindow.document.body.appendChild(preview.node);
      })
    });
    return node;
  }

  didChange() {
    Object.assign(this.node.style, convertStyle(this.entity.style));
  }
}

function createNodePreview(entity) {
  switch(entity.displayType) {
    case 'htmlElement': return new HTMLElementPreview(entity);
    case 'htmlText'   : return new HTMLTextPreview(entity);
    case 'htmlFrame'  : return new HTMLFramePreview(entity);
  }
}

export default class PreviewComponent extends React.Component {

  componentWillUpdate() {
    if (this._preview.entity !== this.props.entity) {
      this._resetPreview();
    }
  }

  _resetPreview() {

    if (this._preview) {
      this.props.app.busses.splice(this.props.app.busses.indexOf(this._preview), 1);
      this.refs.preview.removeChild(this._preview.node);
    }

    this._preview = createNodePreview(this.props.entity);
    this.refs.preview.appendChild(this._preview.node);
    this.props.app.busses.push(this._preview);
    this._preview.update();
  }

  componentDidMount() {
    this._resetPreview();
  }

  componentWillUnmount() {
    this._preview.dispose();
  }

  render() {
    return <div className='m-preview' ref='preview'>

    </div>;
  }
}

export const fragment = ReactComponentFactoryFragment.create('components/preview', PreviewComponent);
