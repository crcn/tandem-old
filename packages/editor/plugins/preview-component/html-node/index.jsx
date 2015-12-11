import React from 'react';
import ReactDOM from 'react-dom';

class HTMLNode extends React.Component {
  componentDidMount() {

    this.props.node.getComputedStyle = () => {

      var rect = this.refs.element.getBoundingClientRect();

      var w = rect.right - rect.left;
      var h = rect.bottom - rect.top;

      return {
        resizable : window.getComputedStyle(this.refs.element).display !== 'inline',
        left      : this.refs.element.offsetLeft,
        top       : this.refs.element.offsetTop,
        width     : w,
        height    : h
      };
    };
  }

  render() {

    var props = this.props;
    var node = props.node;
    var Type = node.componentType === 'text' ? 'span' : node.componentType;

    return <Type ref='element' data-node-id={node.id} {...node.attributes}>
      { props.children.length ? props.children : node.value }
    </Type>;
  }
}

export default HTMLNode;
