import 'ionicons/css/ionicons.css';
import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import a11y from 'react-a11y';
import React from 'react';
import ReactDOM from 'react-dom';

// a11y(React);

import BaseApplication from 'base/app';

import CorePlugin from './fragments/core';
import HistoryPlugin from './fragments/history';
import SettingsPlugin from './fragments/settings';
import ShortcutPlugin from './fragments/shortcuts';
import ClipboardPlugin from './fragments/clipboard';
import BasicFontPlugin from './fragments/basic-fonts';
import BasicToolsPlugin from './fragments/basic-tools';
import TestProjectPlugin from './fragments/test-project';
import EntityPreviewPlugin from './fragments/entity-preview';
import LoadRootEntityPlugin from './fragments/root-entity-loader';
import ClipboardPasteEntity from './fragments/clipboard-paste-entity';
import BasicDOMEntitiesPlugin from './fragments/basic-dom-entities';

import { SET_FOCUS } from 'editor/message-types';

class Application extends BaseApplication {

  static fragments = BaseApplication.fragments.concat([
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
    var rootComponentPlugin = this.fragments.queryOne({ id: 'rootComponent' });
    ReactDOM.render(rootComponentPlugin.factory.create({ app: app, fragments: this.fragments }), this.config.element);
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
