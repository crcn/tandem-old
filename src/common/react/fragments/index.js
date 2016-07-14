import React from 'react';
import { FactoryFragment } from 'common/fragments';
import assertPropertyExists from 'common/utils/assert/property-exists';

export class ReactComponentFactoryFragment extends FactoryFragment {
  constructor(properties) {
    super({
      ...properties,
      factory: {
        create(props, children) {
          return React.createElement(properties.componentClass, props, children);
        },
      },
    });

    assertPropertyExists(this, 'componentClass');
  }
}
