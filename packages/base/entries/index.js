
import React from 'react';
import Schema from 'common/schema';
import { Plugin } from 'common/registry';
import mixinSchema from 'common/class/mixins/schema';

export const ROOT_COMPONENT_ID = 'rootComponent';

// export SymbolPanePlugin from './symbol-pane';
// export AppPanePlugin from './app-pane';

var schema = new Schema({
  fields: {
    componentClass: {
      type: Function,
      required: true
    }
  }
});

// class AppPanePlugin extends Plugin {
//   type = 'appPane';
// }

class ComponentPlugin extends Plugin {

  constructor(properties) {
    super({ type: 'component', ...properties });
  }

  setProperties(properties) {
    if (properties.componentClass) {
      properties.factory = {
        create(props) {
          return React.createElement(properties.componentClass, props);
        }
      }
    }
    super.setProperties(properties);
  }
}

ComponentPlugin = mixinSchema(schema, ComponentPlugin);

// export var ComponentPlugin ComponentPlugin;

export class RootComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

export class PaneComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', ...properties });
  }
}

export class AppPaneComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', paneType: 'app', ...properties });
  }
}

export class SymbolPaneComponentPlugin extends ComponentPlugin {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', paneType: 'symbol', ...properties });
  }
}

export class SymbolPlugin extends Plugin {
  type = 'symbol';
}
