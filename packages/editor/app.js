import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base/app';
import { RootComponentEntry } from 'editor/entries';
import RootComponent from './components/root';

import SettingsPlugin from './plugins/settings';
import TestProjectPlugin from './plugins/test-project';
import BasicSymbolsPlugin from './plugins/basic-symbols';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';
import PreviewComponentPlugin from './plugins/preview-component';
import ShortcutPlugin from './plugins/shortcuts';

import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([
    TestProjectPlugin,
    BasicSymbolsPlugin,
    BasicPaneComponentsPlugin,
    SettingsPlugin,
    PreviewComponentPlugin,
    ShortcutPlugin
  ])

  didInitialize() {
    ReactDOM.render(React.createElement(RootComponent, { app }), this.config.element);
  }
}

export default Application;
