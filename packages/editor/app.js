import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import RootComponent from './components/root';
import BaseApplication from 'base/app';

import PreviewPlugin             from './plugins/preview';
import SettingsPlugin            from './plugins/settings';
import ShortcutPlugin            from './plugins/shortcuts';
import BasicFontPlugin           from './plugins/basic-fonts';
import TestProjectPlugin         from './plugins/test-project';
import BasicDOMEntitiesPlugin    from './plugins/basic-dom-entities';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';

import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([
    PreviewPlugin,
    ShortcutPlugin,
    SettingsPlugin,
    BasicFontPlugin,
    TestProjectPlugin,
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
    this.setProperties({
      focus: item
    });
  }
}

export default Application;
