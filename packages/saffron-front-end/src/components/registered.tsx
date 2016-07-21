import * as React from 'react';
import IApplication from 'saffron-common/src/application/interface';

export default class RegisteredComponent extends React.Component<any, any> {
  render() {
    return (<span> {
      this.props.app.fragments.queryAll(this.props.ns).map((fragment, key) => (
        fragment.create(Object.assign({}, this.props, { key: key, fragment: fragment }))
      ))
    } </span>);
  }
}
