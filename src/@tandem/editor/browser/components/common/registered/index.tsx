import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";
import { ReactComponentFactoryDependency } from "@tandem/editor/browser/dependencies";

export class RegisteredComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <span> {
      this.dependencies.queryAll(this.props.ns).map((dependency, key) => {
        return (dependency as ReactComponentFactoryDependency).create();
      })
    } </span>;
  }
}
