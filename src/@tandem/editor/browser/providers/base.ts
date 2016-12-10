import React =  require("react");
import { FactoryProvider } from "@tandem/common";

/**
 */

export class ReactComponentFactoryProvider extends FactoryProvider {
  constructor(ns: string, readonly ComponentClass: any, priority?: number) {
    super(ns, {
      create(props, children) {
        return React.createElement(ComponentClass, props, children);
      }
    }, true, priority);
  }
}
