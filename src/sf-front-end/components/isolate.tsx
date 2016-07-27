import * as React from 'react';
import * as ReactDOM from 'react-dom';
import bubbleIframeEvents from 'sf-front-end/utils/html/bubble-iframe-events';

export default class IsolateComponent extends React.Component<any, any> {

  private _mountElement:any;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    if (this.props.inheritCSS) {
      const head    = this.head;
      Array.prototype.forEach.call(document.getElementsByTagName('style'), function (style) {
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
    return (this.refs as any).container.contentWindow;
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
    bubbleIframeEvents((this.refs as any).container);
  }

  render() {
    return <iframe ref='container' onWheel={this.props.onWheel} onScroll={this.props.onScroll} className={this.props.className} />;
  }
}
