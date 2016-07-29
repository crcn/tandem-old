import * as React from "react";
import { FactoryFragment } from "sf-core/fragments";

/**
 */

export class ReactComponentFactoryFragment extends FactoryFragment {
  constructor(ns: string, componentClass: React.ComponentClass<any>) {
    super(ns, {
      create(props, children) {
        return React.createElement(componentClass, props, children);
      }
    });
  }
}
