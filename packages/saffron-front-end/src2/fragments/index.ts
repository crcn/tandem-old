import * as React from 'react';
import { FactoryFragment } from 'saffron-common/src/fragments/index';

export class ReactComponentFactoryFragment extends FactoryFragment {
  constructor(ns:string, componentClass:React.ComponentClass<any>) {
    super(ns, {
      create(props, children) {
        return React.createElement(componentClass, props, children);
      }
    });
  }
}
