
import { Entry } from 'common/registry';
import React from 'react';

export const ROOT_COMPONENT_ID = 'rootComponent';

// export SymbolPaneEntry from './symbol-pane';
// export AppPaneEntry from './app-pane';

// class AppPaneEntry extends Entry {
//   type = 'appPane';
// }

export class ComponentEntry extends Entry {

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

// export var ComponentEntry ComponentEntry;

export class RootComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

export class PaneComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ componentType: 'pane', ...properties });
  }
}

export class AppPaneComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'app', ...properties });
  }
}

export class SymbolPaneComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'symbol', ...properties });
  }
}

export class PreviewComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ componentType: 'preview', ...properties });
  }
}

export { Entry };

export class SymbolEntry extends Entry {
  type = 'symbol';
}
