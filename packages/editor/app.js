import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base/app';
import { RootComponentEntry } from 'editor/entries';
import RootComponent from './components/root';

import SettingsPlugin from './plugins/settings';
import TestProjectPlugin from './plugins/test-project';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';
import PreviewComponentPlugin from './plugins/preview-component';
import ShortcutPlugin from './plugins/shortcuts';

import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([

    // temporary here until persistence starts working
    TestProjectPlugin,

    // stuff like layers, properties, and more
    BasicPaneComponentsPlugin,

    // application settings
    SettingsPlugin,

    // main preview pane with tools and such
    PreviewComponentPlugin,

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
