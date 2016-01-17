import React from 'react';
import EntityPreview from './entity-preview';
import { clone } from 'common/utils/object';

class HTMLEntityComponent extends React.Component {

  constructor() {
    super();
  }

  setHook(entity) {
    this._cleanup();
    if (!entity) return;
    this._preview = entity.preview = EntityPreview.create(entity, this);
    entity.notifier.push(this);

    // global messages should purge preview cache. E.g: user zooms
    // in - bounds need to be updated
    this.props.app.notifier.push(this._preview);
    this._invalidateCache = true;
  }

  componentWillUnmount() {
    this.props.entity.notifier
  }

  _cleanup() {
    if (this._preview) {
      this._preview.entity.notifier.remove(this);
      this.props.app.notifier.remove(this._preview);
    }
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
    var attribs = clone(entity.attributes);

    // react likes className instead of class here. This silences
    // The warning for us
    if (attribs.class) {
      attribs.className = attribs.class;
      attribs.class = void 0;
    }

    return <Type ref='element' id={entity.id} {...attribs}>
      { children.length ? children : entity.value }
    </Type>;
  }
}

export default HTMLEntityComponent;
