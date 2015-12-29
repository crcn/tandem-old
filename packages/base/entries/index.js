
import React from 'react';
import Schema from 'common/schema';
import { Fragment } from 'common/registry';
import mixinSchema from 'common/class/mixins/schema';

export const ROOT_COMPONENT_ID = 'rootComponent';

// export SymbolPaneFragment from './symbol-pane';
// export AppPaneFragment from './app-pane';

var schema = new Schema({
  fields: {
    componentClass: {
      type: Function,
      required: true
    }
  }
});

// class AppPaneFragment extends Fragment {
//   type = 'appPane';
// }

class ComponentFragment extends Fragment {

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

ComponentFragment = mixinSchema(schema, ComponentFragment);

// export var ComponentFragment ComponentFragment;

export class RootComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

export class PaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', ...properties });
  }
}

export class AppPaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', paneType: 'app', ...properties });
  }
}

export class SymbolPaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ type: 'component', componentType: 'pane', paneType: 'symbol', ...properties });
  }
}

export class SymbolFragment extends Fragment {
  type = 'symbol';
}
