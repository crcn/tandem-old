import React from 'react';
import sift from 'sift';

class RegisteredComponent extends React.Component {
  render() {
    var app = this.props.app;
    var entries = app.registry.query(this.props.query);
    var components = entries.map((entry) => {
      return entry.factory.create({
        entry: this.entry,
        ...this.props
      });
    });

    return components.length === 1 ? components[0] : <span>{
      components
    }</span>;
  }
}

export default RegisteredComponent;
