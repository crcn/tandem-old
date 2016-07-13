import React from 'react';
import CoreObject from 'common/object';
import EntityPreview from './entity-preview';

import { ReactComponentFactoryFragment } from 'common/react/fragments';

function convertStyle(style) {
  const converted = {};
  for (const key in style) {
    let v = style[key];
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
    // OVERRIDE ME
  }

  execute(event) {
    if (event.type !== 'change') return;
    this._didChange = this._didChange || !!event.changes.find((change) => (
      change.target === this.entity
    ));

    this.update();
  }

  update() {
    this._didChange = false;
    this.didChange();
  }

  didChange() {

  }
}

class HTMLElementPreview extends HTMLNodePreview {

  didChange() {
    if (this.entity.style) {
      Object.assign(this.node.style, convertStyle(this.entity.style));
    }

    for (const key in this.entity.attributes) {
      if (/style/.test(key)) continue;
      this.node.setAttribute(key, this.entity.attributes[key]);
    }
  }

  update() {
    super.update();
    for (const child of this.childNodes) {
      child.update();
    }
  }

  dispose() {
    super.dispose();
    for (const child of this.childNodes) {
      child.dispose();
    }
  }

  createNode() {
    var element = document.createElement(this.entity.nodeName);

    if (this.entity.style) {
      Object.assign(element.style, this.entity.style);
    }

    for (const key in this.entity.attributes) {
      element.setAttribute(key, this.entity.attributes[key]);
    }

    (this.childNodes = this.entity.childNodes.map(createNodePreview)).forEach(function (preview) {
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
      backgroundColor: '#FFF',
    }, this.entity.style);

    node.addEventListener('load', () => {
      var body = node.contentWindow.document.body;
      body.style.margin =
      body.style.padding =
      '0px';

      (this.childNodes = this.entity.childNodes.map(createNodePreview)).forEach(function (preview) {
        node.contentWindow.document.body.appendChild(preview.node);
      });
    });
    return node;
  }

  didChange() {
    Object.assign(this.node.style, convertStyle(this.entity.style));
  }
}

function createNodePreview(entity) {
  switch (entity.displayType) {
    case 'htmlElement': return new HTMLElementPreview(entity);
    case 'htmlText'   : return new HTMLTextPreview(entity);
    case 'htmlFrame'  : return new HTMLFramePreview(entity);
    default           : throw new Error(`cannot find entity ${entity.displayType}`);
  }
}

export default class PreviewComponent extends React.Component {

  _resetPreview() {

    if (this._preview) {
      this.props.app.busses.remove(this._preview);
      this.refs.preview.removeChild(this._preview.node);
    }

    this._preview = createNodePreview(this.props.entity);
    this.refs.preview.appendChild(this._preview.node);
    this._preview.update();
  }

  componentWillUpdate() {
    if (this._preview.entity !== this.props.entity) {
      this._resetPreview();
    } else {
      this._preview.update();
    }
  }

  componentDidMount() {
    this._resetPreview();
  }

  componentWillUnmount() {
    this._preview.dispose();
  }

  render() {
    return (<div className='m-preview' ref='preview'>

    </div>);
  }
}

export const fragment = ReactComponentFactoryFragment.create({ ns: 'components/preview', componentClass: PreviewComponent });
