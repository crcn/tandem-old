import 'ionicons/css/ionicons.css';
import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import BaseApplication from 'base/app';

import EntityFragment from './fragments/entity';
import DevelopFragment from './fragments/develop';
import HistoryFragment from './fragments/history';
import SettingsFragment from './fragments/settings';
import SelectionFragment from './fragments/selection';
import ClipboardFragment from './fragments/clipboard';
import KeyCommanderFragment from './fragments/key-commander';

import MainComponent from './components/main';

import { SET_FOCUS, SET_ROOT_ENTITY } from 'editor/message-types';

class Application extends BaseApplication {

  static fragments = BaseApplication.fragments.concat([
    EntityFragment,
    DevelopFragment,
    HistoryFragment,
    SettingsFragment,
    ClipboardFragment,
    SelectionFragment,
    KeyCommanderFragment
  ]);

  didInitialize() {
    ReactDOM.render(<MainComponent app={this} />, this.config.element);
  }

  notify(message) {
    switch(message.type) {
      case SET_ROOT_ENTITY : return this.setProperties({
        rootEntity: message.entity
      });
    }
  }
}

export default Application;
