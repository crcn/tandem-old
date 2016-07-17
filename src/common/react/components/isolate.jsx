import React from 'react';
import ReactDOM from 'react-dom';
import bubbleIframeEvents from 'common/utils/html/bubble-iframe-events';

export default class IsolateComponent extends React.Component {

  componentDidMount() {

    if (this.props.inheritCSS) {
      const head    = this.head;
      Array.prototype.forEach.call(parent.document.getElementsByTagName('style'), function (style) {
        head.appendChild(style.cloneNode(true));
      });
    }

    this.body.appendChild(this._mountElement = document.createElement('div'));
    this._render();

    this._addListeners();
  }

  componentDidUpdate() {
    this._render();
  }

  get window() {
    return this.refs.container.contentWindow;
  }

  get head() {
    return this.window.document.head;
  }

  get body() {
    return this.window.document.body;
  }

  _render() {
    ReactDOM.render(<span>{this.props.children}</span>, this._mountElement);
  }

  _addListeners() {
    bubbleIframeEvents(this.refs.container);
  }

  render() {
    return <iframe ref='container' onWheel={this.props.onWheel} onScroll={this.props.onScroll} className={this.props.className} />;
  }
}
