import React from 'react';
import EntityPreview from './entity-preview';


class BaseNode {

  constructor(entity, element) {

    this.element  = element;
    element.setAttribute('id', this.id = entity.id);

    this.entity   = entity;
    this._preview = entity.preview = EntityPreview.create(entity, this);

    this.entity.notifier.push(this);
  }

  notify() {
    this._preview.invalidateCache();
  }

  dispose() {
    this.entity.notifier.remove(this);
  }
}

class ElementNode extends BaseNode {

  constructor(entity, element) {
    super(entity, element || document.createElement(entity.tagName));
    this._addChildren();
    this._updateAttributes();
  }

  notify(message) {
    super.notify(message);

    this._updateAttributes();

    for (var change of message.changes) {
      if (change.target === this.entity.children) {
        this._updateChildren(change);
      }
    }
  }

  _updateChildren(change) {
    change.added.forEach((entity) => {
      var i = this.entity.children.indexOf(entity);
      var child = createNode(entity);
      this._children.splice(i, 0, child);
      if (i === this.entity.children.length - 1) {
        this.element.appendChild(child.element);
      } else {
        this.element.insertBefore(child.element, this.element.childNodes[i + 1]);
      }
    });

    change.removed.forEach((entity) => {
      for (var i = this._children.length; i--;) {
        var child = this._children[i];
        if (child.id === entity.id) {
          this.element.removeChild(child.element);
          this._children.splice(i, 1);
          break;
        }
      }
    });
  }

  _addChildren() {
    this._children = this.entity.children.map(createNode);
    this._children.forEach((child) => {
      this.element.appendChild(child.element);
    })
  }

  _updateAttributes() {
    var attributes = this.entity.attributes;

    for (var key in attributes) {
      var value = attributes[key];
      if (key === 'style') {
        // this.element.setAttribute('style', '');
        for (var styleName in value) {
          var v = value[styleName];
          if (!isNaN(v)) v = v + 'px';
          this.element.style[styleName] = v;
        }
      } else {
        this.element.setAttribute(key, value);
      }
    }
  }
}

class TextNode extends ElementNode {
  constructor(entity) {
    super(entity, document.createElement('span'));
  }

  notify() {
    this.element.textContent = this.entity.value;
  }
}

function createNode(entity) {
  if (entity.componentType === 'text') {
    return new TextNode(entity)
  } else {
    return new ElementNode(entity);
  }
}

class HTMLEntityComponent extends React.Component {

  constructor() {
    super();
  }

  _cleanup() {
    this._root.dispose();
  }

  componentDidMount() {
    this._root = new ElementNode(this.props.entity);
    this.refs.placeholder.appendChild(this._root.element);
  }

  render() {
    return <div ref='placeholder'></div>;
  }
}

export default HTMLEntityComponent;
