import React from 'react';

export default class RegisteredComponent extends React.Component {
  render() {
    return (<span> {
      this.props.app.fragments.queryAll(this.props.ns).map((fragment, key) => (
        fragment.create({ ...this.props, key: key, fragment: fragment })
      ))
    } </span>);
  }
}
