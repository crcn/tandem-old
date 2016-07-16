import React from 'react';
import ReactDOM from 'react-dom';

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
    var el = this.body;
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

    const eventTypes = [
      'keypress',
      'copy',
      'paste',
      'mousemove',
      'keyup',
      'keydown'
    ];

    for (const eventType of eventTypes) {
      el.addEventListener(eventType, bubbleEvent);
    }

    if (this.props.onWheel) {
      this.window.addEventListener('wheel', this.props.onWheel);
    }

    if (this.props.onScroll) {
      this.window.addEventListener('scroll', this.props.onScroll);
    }
  }

  render() {
    var style = this.props.style || {};
    return <iframe ref='container' onScroll={this.props.onScroll} className={this.props.className} />;
  }
}
