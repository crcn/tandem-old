import React from 'react';
import ReactDOM from 'react-dom';

class HTMLEntityComponent extends React.Component {
  setHook(entity) {
    entity.getComputedStyle = () => {

      var rect = this.refs.element.getBoundingClientRect();

      var w = rect.right - rect.left;
      var h = rect.bottom - rect.top;

      return {
        resizable : window.getComputedStyle(this.refs.element).display !== 'inline',

        // this is WRONG. need to get left position based on canvas
        left      : this.refs.element.offsetLeft,
        top       : this.refs.element.offsetTop,
        width     : w,
        height    : h
      };
    };
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
