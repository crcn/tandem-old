import 'ionicons/css/ionicons.css';
import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import a11y from 'react-a11y';
import React from 'react';
import ReactDOM from 'react-dom';

// a11y(React);

import BaseApplication from 'base/app';

import CorePlugin from './plugins/core';
import HistoryPlugin from './plugins/history';
import SettingsPlugin from './plugins/settings';
import ShortcutPlugin from './plugins/shortcuts';
import ClipboardPlugin from './plugins/clipboard';
import BasicFontPlugin from './plugins/basic-fonts';
import BasicToolsPlugin from './plugins/basic-tools';
import TestProjectPlugin from './plugins/test-project';
import EntityPreviewPlugin from './plugins/entity-preview';
import BasicDOMStylesPlugin from './plugins/basic-dom-styles';
import LoadRootEntityPlugin from './plugins/root-entity-loader';
import ClipboardPasteEntity from './plugins/clipboard-paste-entity';
import BasicDOMEntitiesPlugin from './plugins/basic-dom-entities';

import { SET_FOCUS } from 'editor/message-types';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([
    CorePlugin,
    HistoryPlugin,
    ShortcutPlugin,
    SettingsPlugin,
    ClipboardPlugin,
    BasicFontPlugin,
    BasicToolsPlugin,
    TestProjectPlugin,
    EntityPreviewPlugin,
    LoadRootEntityPlugin,
    ClipboardPasteEntity,
    BasicDOMEntitiesPlugin
  ])

  didInitialize() {
    var rootComponentPlugin = this.plugins.queryOne({ id: 'rootComponent' });
    ReactDOM.render(rootComponentPlugin.factory.create({ app: app }), this.config.element);
  }

  notify(message) {
    if (message.type === SET_FOCUS) {
      this.setFocus(message.target);
    }
  }

  /**
   * current focus of the app
   * DEPRECATED - use focus message instead
   */

  setFocus(item) {

    // turn off current focus immediately. Fixes a
    // NULL exception bug when rAF fires and the focused element
    // does *not* actually exist as a child of a root entity
    this.setProperties({
      focus: void 0
    });

    // wait for rAF.
    // TODO - add this in runloop. This feels like
    // broken abstraction.
    requestAnimationFrame(() => {
      this.setProperties({
        focus: item
      });
    });
  }
}

export default Application;
