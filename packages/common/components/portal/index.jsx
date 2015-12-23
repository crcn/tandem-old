import React from 'react';
import ReactDOM from 'react-dom';

class PortalComponent extends React.Component {

  componentDidMount() {
    this._placeholder = document.createElement('div');
    document.body.appendChild(this._placeholder);
    var bounds = this.refs.portal.getBoundingClientRect();

    Object.assign(this._placeholder.style, {
      position: 'absolute',
      zIndex: 9999,
      left: bounds.left + 'px',
      top: bounds.top + 'px'
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
  }
}

export default PortalComponent;
