import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base/app';
import { RootComponentPlugin } from 'editor/plugin-types';
import RootComponent from './components/root';

import SettingsPlugin from './plugins/settings';
import TestProjectPlugin from './plugins/test-project';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';
import PreviewPlugin from './plugins/preview';
import ShortcutPlugin from './plugins/shortcuts';
import BasicDOMEntitiesPlugin from './plugins/basic-dom-entities';

import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([

    BasicDOMEntitiesPlugin,

    // temporary here until persistence starts working
    TestProjectPlugin,

    // stuff like layers, properties, and more
    BasicPaneComponentsPlugin,

    // application settings
    SettingsPlugin,

    // main preview pane with tools and such
    PreviewPlugin,

    // authority for all application keyboard shortcuts
    ShortcutPlugin
  ])

  didInitialize() {
    ReactDOM.render(React.createElement(RootComponent, { app }), this.config.element);
  }

  /**
   * current focus of the app
   */

  setFocus(item) {
    this.setProperties({
      focus: item
    });
  }
}

export default Application;
