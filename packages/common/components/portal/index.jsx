import React from 'react';
import ReactDOM from 'react-dom';

class PortalComponent extends React.Component {

  componentDidMount() {
    this._placeholder = document.createElement('div');
    document.body.appendChild(this._placeholder);

    Object.assign(this._placeholder.style, {
      position   : 'absolute',
      zIndex     : 9999,
      top        : 0,
      left       : 0,
      visibility : 'hidden'
    });

    this._render();
  }

  componentWillReceiveProps(nextProps, nextState) {
    this._render();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this._placeholder);
  }

  render() {
    return <span ref='portal'></span>;
  }

  _render() {
    ReactDOM.render(this.props.children, this._placeholder);
    this._resize();
  }

  _resize() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      var bounds = this.refs.portal.getBoundingClientRect();
      var placeholderBounds = this._placeholder.getBoundingClientRect();

      var width  = placeholderBounds.right - placeholderBounds.left;
      var height = placeholderBounds.bottom - placeholderBounds.top;
      var left   = bounds.left;
      var top    = bounds.top;

      if (left + width > window.innerWidth) {
        left = window.innerWidth - width - 10;
      }

      Object.assign(this._placeholder.style, {
        visibility: 'visible',
        left: left + 'px',
        top: top + 'px'
      });
    }, 1);
  }
}

export default PortalComponent;
