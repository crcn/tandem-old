import * as React from "react";
import { FactoryDependency } from "sf-core/dependencies";

/**
 */

export class ReactComponentFactoryDependency extends FactoryDependency {
  constructor(ns: string, componentClass: React.ComponentClass<any>) {
    super(ns, {
      create(props, children) {
        return React.createElement(componentClass, props, children);
      }
    });
  }
}
