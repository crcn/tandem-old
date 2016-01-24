
import React from 'react';
import assert from 'assert';
import { Fragment } from 'common/registry';

export { Fragment };


/**
 * fragment for a factory -- used to instantiate new objects
 */

export class FactoryFragment extends Fragment {

  /**
   * @param {{create:Function}} properties.factory the object factory
   */

  constructor(properties) {
    assert(properties.factory, 'factory is missing');
    var factory = properties.factory;
    super({
      ...properties,
      factory: {
        create: (props = {}, ...args) => {
          props.fragmentId = this.id;
          return factory.create(props, ...args);
        }
      }
    });
  }
}

/**
 * Application plugin fragment
 */

export class ApplicationFragment extends FactoryFragment {
  constructor(properties) {
    super({ namespace: 'application', ...properties });
  }
}
