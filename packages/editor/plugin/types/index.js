// TODO - some of these components are plugin classes specific
// to other plugin classes. These will need to be moved their own packages at some point (CC)

import React from 'react';
import assert from 'assert';
import { Plugin } from 'common/registry';

export const ROOT_COMPONENT_ID = 'rootComponent';

export { Plugin };

export class FactoryPlugin extends Plugin {
  constructor(properties) {
    assert(properties.factory, 'factory is missing');
    var factory = properties.factory;
    super({
      ...properties,
      factory: {
        create: (props, ...args) => {
          props.pluginId = this.id;
          return factory.create(props, ...args);
        }
      }
    });
  }
}

export class ComponentPlugin extends Plugin {

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

// export var ComponentPlugin ComponentPlugin;

export class RootComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

export class PaneComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ componentType: 'pane', ...properties });
  }
}

export class AppPaneComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'app', ...properties });
  }
}

export class EntityPaneComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'entity', ...properties });
  }
  matchesQuery(query) {
    return query.paneType === this.paneType && query.entity && query.entity.type === this.entityType;
  }
}

export class EntityLayerLabelComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ componentType: 'label', labelType: 'text', ...properties });
  }
}

export class ApplicationPlugin extends FactoryPlugin {
  constructor(properties) {
    super({ type: 'application', ...properties });
  }
}

export class PreviewComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ componentType: 'preview', ...properties });
  }
}

export class KeyCommandPlugin extends Plugin {
  constructor(properties) {
    assert(properties.keyCommand, 'key command must exist');
    super({ type: 'keyCommand', ...properties });
  }
}

export class EntityPlugin extends FactoryPlugin {
  constructor(properties) {
    super({ type: 'entity', ...properties });
  }
}
