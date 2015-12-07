import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base/app';
import BasicSymbolsPlugin from './plugins/basic-symbols';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';
import { RootComponentEntry } from 'editor/entries';
import SettingsPlugin from './plugins/settings';
import RenderRootComponentPlugin from './plugins/render-root';

import MainComponent from './components/main';
import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static entries = [
    RootComponentEntry.create({
      componentClass: MainComponent
    })
  ]

  static plugins = BaseApplication.plugins.concat([
    RenderRootComponentPlugin,
    BasicSymbolsPlugin,
    BasicPaneComponentsPlugin,
    SettingsPlugin
  ])
}

export default Application;
