import { FactoryFragment } from 'common/fragments';
import React from 'react';

export class ReactComponentFactoryFragment extends FactoryFragment {
  constructor(ns, ComponentClass, props = {}) {
    super(ns, {
      create(props2, children) {
        return <ComponentClass {...props2}>{children}</ComponentClass>;
      },
    });

    Object.assign(this, props);
  }
}
