import React from 'react';
import ReactDOM from 'react-dom';

class FocusComponent extends React.Component {
  componentDidMount() {
    if (this.props.focus !== false) this.focus();
  }
  componentWillReceiveProps(nextProps) {
    clearTimeout(this._timeout);
    if (nextProps.focus === true) {
      this.focus();
    } else if (nextProps.focus === false) {
      this.blur();
    }
  }
  focus() {
    // need to wait a bit before focusing on element, otherwise
    // this does not work
    this._timeout = setTimeout(() => {
      this.getRef().focus();
    }, 1);
  }
  blur() {
    this._timeout = setTimeout(() => {
      this.getRef().blur();
    }, 1);
  }
  getRef() {
    var node = ReactDOM.findDOMNode(this);

    return (node.nodeName === 'INPUT' ? node : node.querySelector('input')) || node;
  }
  componentWillUnmount() {
    clearTimeout(this._timeout);
  }
  render() {
    return this.props.children;
  }
}

FocusComponent.defaultProps = {
  focus: true
};

export default FocusComponent;
