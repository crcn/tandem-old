// TODO - some of these components are fragment classes specific.
// to other fragment classes. These will need to be moved their own packages at some point (CC)

import React from 'react';
import assert from 'assert';
import { Fragment } from 'common/registry';
import { FactoryFragment, ApplicationFragment } from 'common/fragment/types';

export const ROOT_COMPONENT_ID = 'rootComponent';

export { Fragment, ApplicationFragment };

/**
 * React Component fragment used to compose other react components
 */

export class ComponentFragment extends Fragment {

  /**
   *
   * @param {{ componentClass:Class }} properties
   */

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

/**
 * Fragment for the root react component
 */

export class RootComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

/**
 * Component fragment for sidebar panels
 */

export class PaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'pane', ...properties });
  }
}

/**
 * React component fragment for project-specific panels
 */

export class AppPaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'app', ...properties });
  }
}

/**
 * React component fragment for entity specific panels
 */

export class EntityPaneComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'pane', paneType: 'entity', ...properties });
  }
}

/**
 * label fragment for entity layers
 */

export class EntityLayerLabelComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'label', labelType: 'text', ...properties });
  }
}

/**
 * Preview fragment which displays visual representation of the entity that the
 * user is editing
 */

export class PreviewComponentFragment extends ComponentFragment {
  constructor(properties) {
    super({ componentType: 'preview', ...properties });
  }
}

/**
 * keyboard shortcut fragment
 */

export class KeyCommandFragment extends Fragment {

  /**
   *
   * @param {String} properties.keyCommand the keyboard binding to register
   * @param {BaseNotifier} properties.notifier the notifier to notify whenever the keyCommand is executed
   */

  constructor(properties) {

    assert(properties.keyCommand, 'key command must exist');
    assert(properties.notifier  , 'notifier must exist');

    super({ type: 'keyCommand', ...properties });
  }
}

/**
 * factory fragment for an entity which makes up a project
 */

export class EntityFragment extends FactoryFragment {

  /**
   *
   * @inherit
   */

  constructor(properties) {
    super({ type: 'entity', ...properties });
  }
}

/**
 * A unit of measurement such as px, %, em, cm.
 */

export class UnitFragment extends Fragment {
  constructor(unit) {
    super({ id: unit + 'UnitFragment', type: 'unit', unit: unit, label: unit, value: unit });
  }
}


/**
 * A selection is an object that the user is focused on
 */

export class SelectionFragment extends FactoryFragment {
  constructor(properties) {
    super({
      type: 'selection',
      ...properties
    });
  }
}
