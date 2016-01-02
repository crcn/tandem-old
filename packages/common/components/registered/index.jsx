import React from 'react';

class RegisteredComponent extends React.Component {
  render() {
    var fragments = this.props.app.fragments;

    // one or more
    var entries = toArray(
      this.props.queryOne ?
        fragments.queryOne(this.props.queryOne) :
        fragments.query(this.props.query)
    );

    var components = entries.map((fragment, i) => {
      return fragment.factory.create({
        ...this.props,

        // prevent sub registered components from getting
        // stuck in an infinite loop
        query    : void 0,
        queryOne : void 0,
        fragment : fragment,
        key      : fragment.id
      });
    });

    return components.length === 1 ? components[0] : <span>{
      components
    }</span>;
  }
}


function toArray(value) {
  return Array.isArray(value) ? value : value == void 0 ? [] : [value];
}

export default RegisteredComponent;
