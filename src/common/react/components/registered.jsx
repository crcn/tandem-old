import React from 'react';

export default class RegisteredComponent extends React.Component {
  render() {
    return <span> {
      this.props.app.fragmentDictionary.queryAll(this.props.ns).map((factory, key) => {
        return factory.create({ ...this.props, key: key });
      })
    } </span>;
  }
}
