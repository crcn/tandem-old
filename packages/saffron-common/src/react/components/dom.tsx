import * as React from 'react';

export default class DOMComponent extends React.Component<any, any> {
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
    Array.prototype.forEach.call((this.refs as any).container.childNodes, (childNode) => {
      (this.refs as any).container.removeChild(childNode);
    });

    if (this.props.node) {
      (this.refs as any).container.appendChild(this.props.node);
    }
  }

  render() {
    return (<div ref='container'>

    </div>);
  }
}
