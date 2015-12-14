import React from 'react';
import ReactDOM from 'react-dom';
import ReactEntityComputer from './entity-computer';

class HTMLEntityComponent extends React.Component {
  setHook(entity) {
    entity.setComputer(ReactEntityComputer.create(entity, this));
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
    var props = this.props;
    var entity = props.entity;
    var Type = entity.componentType === 'text' ? 'span' : entity.componentType;

    return <Type ref='element' data-node-id={entity.id} {...entity.attributes}>
      { props.children.length ? props.children : entity.value }
    </Type>;
  }
}

export default HTMLEntityComponent;
