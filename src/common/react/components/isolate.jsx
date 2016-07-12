import React from 'react';
import ReactDOM from 'react-dom';

export default class IsolateComponent extends React.Component {

  componentDidMount() {

    if (this.props.inheritCSS) {
      const head    = this.containerHead;
      Array.prototype.forEach.call(parent.document.getElementsByTagName('style'), function (style) {
        head.appendChild(style.cloneNode(true));
      });
    }

    this.containerBody.appendChild(this._mountElement = document.createElement('div'));
    this._render();
  }


  componentWillUpdate() {
    this._render();
  }

  get containerHead() {
    return this.refs.container.contentWindow.document.head;
  }

  get containerBody() {
    return this.refs.container.contentWindow.document.body;
  }

  _render() {
    ReactDOM.render(<span>{this.props.children}</span>, this._mountElement);
  }

  render() {
    return <iframe ref='container' style={{ border: 0 }} className={this.props.className} />;
  }
}
