import * as React from 'react';
import IApplication from 'saffron-common/src/application/interface';

export default class RegisteredComponent extends React.Component<{ ns:string, app:IApplication }, any> {
  render() {
    return (<span> {
      this.props.app.fragments.queryAll<any>(this.props.ns).map((fragment, key) => (
        fragment.create(Object.assign({}, this.props, { key: key, fragment: fragment }))
      ))
    } </span>);
  }
}
