import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base/app';
import BasicSymbolsPlugin from './plugins/basic-symbols';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';
import { RootComponentEntry } from 'editor/entries';
import TestProjectPlugin from './plugins/test-project';
import SettingsPlugin from './plugins/settings';
import RootComponent from './components/root';

import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([
    TestProjectPlugin,
    BasicSymbolsPlugin,
    BasicPaneComponentsPlugin,
    SettingsPlugin
  ])

  didInitialize() {
    ReactDOM.render(React.createElement(RootComponent, { app }), this.config.element);
  }
}

export default Application;
