
import React from 'react';
import assert from 'assert';
import { Fragment } from 'common/registry';

export const ROOT_COMPONENT_ID = 'rootComponent';

class ComponentFragment extends Fragment {

  constructor(properties) {
    super({ type: 'component', ...properties });
    assert(this.componentClass, 'component class must be defined');
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
