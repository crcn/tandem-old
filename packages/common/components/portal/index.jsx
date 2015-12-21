import React from 'react';
import ReactDOM from 'react-dom';

class PortalComponent extends React.Component {

  componentDidMount() {
    this._placeholder = document.createElement('div');
    document.body.appendChild(this._placeholder);
    ReactDOM.render(this.props.children, this._placeholder);
    var bounds = this.refs.portal.getBoundingClientRect();

    Object.assign(this._placeholder.style, {
      position: 'absolute',
      zIndex: 9999,
      left: bounds.left + 'px',
      top: bounds.top + 'px'
    });
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this._placeholder);
  }

  render() {
    return <span ref='portal'></span>;
  }
}

export default PortalComponent;
