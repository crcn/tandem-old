import React from 'react';
import ReactDOM from 'react-dom';

class HTMLEntityComponent extends React.Component {
  setHook(entity) {
    entity.getComputedStyle = () => {

      // eeeesh - this is yucky, but we *need* to offset the position
      // of the preview canvas so that we can get the correct position
      // of this element. This is the *simplest* solution I can think of.
      var pcrect = document.getElementById('preview-canvas').getBoundingClientRect();


      var rect = this.refs.element.getBoundingClientRect();

      var w = rect.right - rect.left;
      var h = rect.bottom - rect.top;

      return {
        resizable : window.getComputedStyle(this.refs.element).display !== 'inline',

        // calculate the actual coords based on the entity, and what is visible
        // to the user. Gotta use some yucky strategies to make this work.
        left      : rect.left - pcrect.left,
        top       : rect.top  - pcrect.top,
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
