import React from 'react';
import ReactDOM from 'react-dom';

class PortalComponent extends React.Component {

  componentDidMount() {
    this._placeholder = document.createElement('div');
    document.body.appendChild(this._placeholder);
    React.render(this.children, this._placeholder);
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this._placeholder);
  }

  render() {
    return void 0;
  }
}

export default PortalComponent;
