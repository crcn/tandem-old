import React from 'react';
import ReactDOM from 'react-dom';
import ReactEntityComputer from './entity-computer';
import { ENTITY_PREVIEW_CLICK } from 'editor/message-types';

class HTMLEntityComponent extends React.Component {

  setHook(entity) {
    entity.preview = ReactEntityComputer.create(entity, this);
  }

  componentDidMount() {
    this.setHook(this.props.entity);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.setHook(nextProps.entity);
    }
  }

  onClick(event) {
    this.props.app.notifier.notify({
      type: ENTITY_PREVIEW_CLICK,
      entity: this.props.entity
    });

    // don't want stage to get handler
    event.stopPropagation();
  }

  render() {

    var props = this.props;
    var entity = props.entity;

    var children = entity.children.map((child) => {
      return <HTMLEntityComponent {...this.props} key={child.id} entity={child} />
    });

    var Type = entity.componentType === 'text' ? 'span' : entity.componentType;

    return <Type ref='element' onClick={this.onClick.bind(this)} {...entity.attributes}>
      { children.length ? children : entity.value }
    </Type>;
  }
}

export default HTMLEntityComponent;
