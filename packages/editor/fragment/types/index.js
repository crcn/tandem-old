// TODO - some of these components are fragment classes specific
// to other fragment classes. These will need to be moved their own packages at some point (CC)

import React from 'react';
import assert from 'assert';
import { Fragment } from 'common/registry';

export const ROOT_COMPONENT_ID = 'rootComponent';

export { Fragment };

export class FactoryFragment extends Fragment {
  constructor(properties) {
    assert(properties.factory, 'factory is missing');
    var factory = properties.factory;
    super({
      ...properties,
      factory: {
        create: (props, ...args) => {
          props.fragmentId = this.id;
          return factory.create(props, ...args);
        }
      }
    });
  }
}

export class ComponentFragment extends Fragment {

  constructor(properties) {

      assert(properties.componentClass, 'component class is missing');

      super({ type: 'component', ...properties, factory: {
        create(props, children) {
          return React.createElement(properties.componentClass, props, children);
        }
      }
    });
  }
}

// export var ComponentFragment ComponentFragment;

export class RootComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

export class PaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'pane', ...properties });
  }
}

export class AppPaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'app', ...properties });
  }
}

export class EntityPaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'entity', ...properties });
  }
  matchesQuery(query) {
    return query.paneType === this.paneType && query.entity && query.entity.type === this.entityType;
  }
}

export class EntityLayerLabelComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'label', labelType: 'text', ...properties });
  }
}

export class ApplicationFragment extends FactoryFragment {
  constructor(properties) {
    super({ type: 'application', ...properties });
  }
}

export class PreviewComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'preview', ...properties });
  }
}

export class KeyCommandFragment extends Fragment {
  constructor(properties) {
    assert(properties.keyCommand, 'key command must exist');
    super({ type: 'keyCommand', ...properties });
  }
}

export class EntityFragment extends FactoryFragment {
  constructor(properties) {
    super({ type: 'entity', ...properties });
  }
}
