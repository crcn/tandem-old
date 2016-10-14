import * as React from "react";

export class RegisteredComponent extends React.Component<any, any> {
  render() {
    return (<span> {
      this.props.app.dependencies.queryAll(this.props.ns).map((dependency, key) => (
        dependency.create(Object.assign({}, this.props, { key: key, dependency: dependency }))
      ))
    } </span>);
  }
}
