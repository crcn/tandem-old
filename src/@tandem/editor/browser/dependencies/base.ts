import * as React from "react";
import { FactoryDependency } from "@tandem/common/dependencies";

/**
 */

export class ReactComponentFactoryDependency extends FactoryDependency {
  constructor(ns: string, readonly ComponentClass: any) {
    super(ns, {
      create(props, children) {
        return React.createElement(ComponentClass, props, children);
      }
    });
  }
}
