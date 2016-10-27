import * as React from "react";
import { BaseApplicationComponent, appComponentContextTypes } from "@tandem/common";
import { ReactComponentFactoryDependency } from "@tandem/editor/browser/dependencies";

export class RegisteredComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <span> { this.dependencies.queryAll<ReactComponentFactoryDependency>(this.props.ns).map((dependency, i) => {
      return dependency.create(Object.assign({ key: i }, this.props));
      // return <dependency.ComponentClass {...this.props} key={i} />
    })} </span>;
  }
}
