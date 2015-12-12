import React from 'react';
import ReactDOM from 'react-dom';

class FocusComponent extends React.Component {
  componentDidMount() {
    if (this.props.focus !== false) this.focus();
  }
  componentWillReceiveProps(nextProps) {
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
    return ReactDOM.findDOMNode(this);
    (node.nodeName === 'INPUT' ? node : node.querySelector('input'));
  }
  componentWillUnmount() {
    clearTimeout(this._timeout);
  }
  render() {
    return this.props.children;
  }
}

export default FocusComponent;
