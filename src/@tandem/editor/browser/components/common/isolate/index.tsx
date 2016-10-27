import * as React from "react";
import * as ReactDOM from "react-dom";
import { bubbleHTMLIframeEvents, BaseApplicationComponent, RootApplicationComponent } from "@tandem/common";

export class IsolateComponent extends BaseApplicationComponent<any, any> {

  private _mountElement: any;

  $didInject() {
    super.$didInject();
    this.state = {};
  }

  componentDidMount() {

    if (this.props.inheritCSS) {
      const head    = this.head;

      const tags = [
        ...Array.prototype.slice.call(document.getElementsByTagName("style"), 0),
        ...Array.prototype.slice.call(document.getElementsByTagName("link"), 0)
      ];

      Array.prototype.forEach.call(tags, function (style) {
        head.appendChild(style.cloneNode(true));
      });
    }

    this.body.appendChild(this._mountElement = document.createElement("div"));

    if (this.props.onMouseDown) {
      this.body.addEventListener("mousedown", this.props.onMouseDown);
    }

    if (this.props.onKeyDown) {
      this.body.addEventListener("keydown", this.props.onKeyDown);
    }
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
    ReactDOM.render(<RootApplicationComponent bus={this.bus} dependencies={this.dependencies}>{this.props.children}</RootApplicationComponent>, this._mountElement);
  }

  _addListeners() {
    bubbleHTMLIframeEvents((this.refs as any).container, {
      ignoreInputEvents: this.props.ignoreInputEvents
    });
  }

  render() {
    return <iframe ref="container" scrolling={this.props.scrolling} onWheel={this.props.onWheel} onScroll={this.props.onScroll} onLoad={this.props.onLoad} className={this.props.className} style={this.props.style} />;
  }
}
