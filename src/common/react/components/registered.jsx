import React from 'react';

export default class RegisteredComponent extends React.Component {
  render() {
    return <span> {
      this.props.app.fragmentDictionary.queryAll(this.props.ns).map((fragment, key) => {
        return fragment.create({ ...this.props, key: key, fragment: fragment });
      })
    } </span>;
  }
}
