import React from 'react';
import EntityPreview from './entity-preview';
import { ENTITY_PREVIEW_CLICK } from 'editor/message-types';

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

  focus(event) {
    this.props.app.notifier.notify({
      ...event,
      type    : ENTITY_PREVIEW_CLICK,
      preview : this._preview,
      entity  : this.props.entity,
      stopPropagation: function() {
        event.stopPropagation();
      }
    });
  }

  onDoubleClick(event) {
    console.log('double click');
  }

  render() {

    this._invalidateCache = false;

    var entity = this.props.entity;

    var children = entity.children.map((child) => {
      return <HTMLEntityComponent {...this.props} key={child.id} entity={child} />
    });

    var Type = entity.componentType === 'text' ? 'span' : entity.tagName;

    return <Type ref='element' id={entity.id} onDoubleClick={this.onDoubleClick.bind(this)} onMouseUp={this.focus.bind(this)} {...entity.attributes}>
      { children.length ? children : entity.value }
    </Type>;
  }
}

export default HTMLEntityComponent;
