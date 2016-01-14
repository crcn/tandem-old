import React from 'react';
import EntityPreview from './entity-preview';

class HTMLEntityComponent extends React.Component {

  constructor() {
    super();
  }

  setHook(entity) {
    if (this._preview) {
      this._preview.entity.notifier.remove(this);
      if (!entity) return;
    }
    this._preview = entity.preview = EntityPreview.create(entity, this);
    entity.notifier.push(this);
  }

  componentDidMount() {
    this.setHook(this.props.entity);
  }

  notify(changes) {
    this._invalidateCache = true;
  }

  componentWillUnmount() {
    this.setHook(void 0);
  }

  shouldComponentUpdate() {
    return this._invalidateCache;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.setHook(nextProps.entity);
    }

    // at this point the computed display props have changed - invalidate
    // the preview cache so that returned attributes are not memoized
    this._preview.invalidateCache();
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
