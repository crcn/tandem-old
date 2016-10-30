import * as React from "react";
import { BaseApplicationComponent, appComponentContextTypes } from "@tandem/common";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";

export class RegisteredComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <span> { this.injector.queryAll<ReactComponentFactoryProvider>(this.props.ns).map((dependency, i) => {
      return dependency.create(Object.assign({ key: i }, this.props));
      // return <dependency.ComponentClass {...this.props} key={i} />
    })} </span>;
  }
}
