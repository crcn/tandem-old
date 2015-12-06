
import { Entry } from 'registry';
import Schema from 'schema';
import React from 'react';
import mixinSchema from 'mixin-schema';

export const ROOT_COMPONENT_ID = 'rootComponent';

// export SymbolPaneEntry from './symbol-pane';
// export AppPaneEntry from './app-pane';

var schema = new Schema({
  fields: {
    componentClass: {
      type: Function,
      required: true
    }
  }
});

// class AppPaneEntry extends Entry {
//   type = 'appPane';
// }

class ComponentEntry extends Entry {

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

ComponentEntry = mixinSchema(schema, ComponentEntry);

// export var ComponentEntry ComponentEntry;

export class RootComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

export class PaneComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', ...properties });
  }
}

export class AppPaneComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', paneType: 'app', ...properties });
  }
}

export class SymbolPaneComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', paneType: 'symbol', ...properties });
  }
}

export class SymbolEntry extends Entry {
  type = 'symbol';
}
