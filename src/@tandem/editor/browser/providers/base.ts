import React =  require("React");
import { FactoryProvider } from "@tandem/common";

/**
 */

export class ReactComponentFactoryProvider extends FactoryProvider {
  constructor(ns: string, readonly ComponentClass: any) {
    super(ns, {
      create(props, children) {
        return React.createElement(ComponentClass, props, children);
      }
    });
  }
}
