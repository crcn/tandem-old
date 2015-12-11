
import { Plugin } from 'common/registry';
import React from 'react';

export const ROOT_COMPONENT_ID = 'rootComponent';

export class ComponentPlugin extends Plugin {

  constructor(properties) {
    super({ type: 'component', ...properties });
  }

  setProperties(properties) {
    if (properties.componentClass) {
      properties.factory = {
        create(props, children) {
          return React.createElement(properties.componentClass, props, children);
        }
      }
    }
    super.setProperties(properties);
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

export class SymbolPaneComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'entity', ...properties });
  }
}

export class PreviewComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ componentType: 'preview', ...properties });
  }
}

export { Plugin };

export class EntityPlugin extends Plugin {
  type = 'entity';
}
