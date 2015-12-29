import React from 'react';

class RegisteredComponent extends React.Component {
  render() {
    var app = this.props.app;
    var entries = app.fragments.query(this.props.query);
    var components = entries.map((fragment, i) => {
      return fragment.factory.create({
        fragment: fragment,
        key   : fragment.id,
        ...this.props
      });
    });

    return components.length === 1 ? components[0] : <span>{
      components
    }</span>;
  }
}

export default RegisteredComponent;
