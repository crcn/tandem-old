import React from 'react';
import EntityPreview from './entity-preview';

class HTMLEntityComponent extends React.Component {

  constructor() {
    super();
  }

  setHook(entity) {
    this._preview = entity.preview = EntityPreview.create(entity, this);
  }

  componentDidMount() {
    this.setHook(this.props.entity);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.setHook(nextProps.entity);
    }
  }

  render() {

    this._invalidateCache = false;

    var entity = this.props.entity;

    var children = entity.children.map((child) => {
      return <HTMLEntityComponent {...this.props} key={child.id} entity={child} />
    });

    var Type = entity.componentType === 'text' ? 'span' : entity.tagName;

    return <Type ref='element' id={entity.id} {...entity.attributes}>
      { children.length ? children : entity.value }
    </Type>;
  }
}

export default HTMLEntityComponent;
