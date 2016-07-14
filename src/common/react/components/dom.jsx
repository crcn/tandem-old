import React from 'react';

export default class DOMComponent extends React.Component {
  componentDidMount() {
    this._update();
  }

  shouldComponentUpdate(props) {
    return this.props.node === props.node;
  }

  componentDidUpdate() {
    this._update();
  }

  _update() {
    Array.prototype.forEach.call(this.refs.container.childNodes, (childNode) => {
      this.refs.container.removeChild(childNode);
    });

    if (this.props.node) {
      this.refs.container.appendChild(this.props.node);
    }
  }

  render() {
    return (<div ref='container'>

    </div>);
  }
}
