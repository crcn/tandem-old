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

    this._addListeners();
  }

  componentDidUpdate() {
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

  _addListeners() {
    var el = this.containerBody;
    var container = this.refs.container; 

    // TODO - this should be in its own util function
    function bubbleEvent(event) {
      var clonedEvent = new Event(event.type, {
        bubbles: true,
        cancelable: true
      });

      for (var key in event) {
        var value = event[key];
        if (typeof value === 'function') {
          value = value.bind(event);
        }
        // bypass read-only issues here
        try {
          clonedEvent[key] = value;
        } catch (e) { }
      } 

      container.dispatchEvent(clonedEvent);
      
      if (clonedEvent.defaultPrevented) {
        event.preventDefault();
      }
    }
    el.addEventListener('keypress', bubbleEvent);
    el.addEventListener('copy', bubbleEvent);
    el.addEventListener('paste', bubbleEvent);
    el.addEventListener('keydown', bubbleEvent);
    el.addEventListener('keyup', bubbleEvent);
  }

  render() {
    var style = this.props.style || {};
    return <iframe ref='container' style={{ border: 0, ...style }} className={this.props.className} />;
  }
}
