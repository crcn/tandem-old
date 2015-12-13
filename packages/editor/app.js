import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import RootComponent from './components/root';
import BaseApplication from 'base/app';

import PreviewPlugin from './plugins/preview';
import HistoryPlugin from './plugins/history';
import SettingsPlugin from './plugins/settings';
import ShortcutPlugin from './plugins/shortcuts';
import BasicFontPlugin from './plugins/basic-fonts';
import TestProjectPlugin from './plugins/test-project';
import LoadRootEntityPlugin from './plugins/root-entity-loader';
import BasicDOMEntitiesPlugin from './plugins/basic-dom-entities';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';

import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([
    PreviewPlugin,
    HistoryPlugin,
    ShortcutPlugin,
    SettingsPlugin,
    BasicFontPlugin,
    TestProjectPlugin,
    LoadRootEntityPlugin,
    BasicDOMEntitiesPlugin,
    BasicPaneComponentsPlugin
  ])

  didInitialize() {
    ReactDOM.render(React.createElement(RootComponent, { app }), this.config.element);
  }

  /**
   * current focus of the app
   */

  setFocus(item) {

    // wait for rAF.
    // TODO - add this in runloop
    setTimeout(() => {
      this.setProperties({
        focus: item
      });
    }, 1);
  }
}

export default Application;
