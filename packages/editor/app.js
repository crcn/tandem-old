import 'ionicons/css/ionicons.css';
import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import BaseApplication from 'base/app';

import CoreFragment from './fragments/core';
import HistoryFragment from './fragments/history';
import SettingsFragment from './fragments/settings';
import ShortcutFragment from './fragments/shortcuts';
import SelectionFragment from './fragments/selection';
import ClipboardFragment from './fragments/clipboard';
import BasicFontFragment from './fragments/basic-fonts';
import BasicToolsFragment from './fragments/basic-tools';
import TestProjectFragment from './fragments/test-project';
import EntityPreviewFragment from './fragments/entity-preview';
import LoadRootEntityFragment from './fragments/root-entity-loader';
import BasicDOMEntitiesFragment from './fragments/basic-dom-entities';
import ClipboardPasteEntityFragment from './fragments/clipboard-paste-entity';

import { SET_FOCUS, SET_ROOT_ENTITY } from 'editor/message-types';

class Application extends BaseApplication {

  static fragments = BaseApplication.fragments.concat([
    CoreFragment,
    HistoryFragment,
    ShortcutFragment,
    SettingsFragment,
    ClipboardFragment,
    BasicFontFragment,
    SelectionFragment,
    BasicToolsFragment,
    TestProjectFragment,
    EntityPreviewFragment,
    LoadRootEntityFragment,
    ClipboardPasteEntityFragment,
    BasicDOMEntitiesFragment
  ]);

  didInitialize() {
    var rootComponentFragment = this.fragments.queryOne({ id: 'rootComponent' });
    ReactDOM.render(rootComponentFragment.factory.create({ app: app, fragments: this.fragments }), this.config.element);
  }

  notify(message) {
    switch(message.type) {
      case SET_FOCUS       : return this._setFocus(message.target);
      case SET_ROOT_ENTITY : return this.setProperties({
        rootEntity: message.entity
      });
    }
  }

  /**
   *
   * @param item the item to focus on
   * @deprecated handled by selection fragment instead
   * @private
   */

  _setFocus(item) {

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
