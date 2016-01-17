import 'ionicons/css/ionicons.css';
import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import BaseApplication from 'base/app';

import EntityFragment from './fragments/entity';
import ProjectFragment from './fragments/project';
import DevelopFragment from './fragments/develop';
import HistoryFragment from './fragments/history';
import SelectorFragment from './fragments/selector';
import SettingsFragment from './fragments/settings';
import ClipboardFragment from './fragments/clipboard';
import KeyCommanderFragment from './fragments/key-commander';

import MainComponent from './components/main';

import { SET_FOCUS, SET_ROOT_ENTITY, DISPOSE } from 'editor/message-types';

class Application extends BaseApplication {

  static fragments = BaseApplication.fragments.concat([
    EntityFragment,
    ProjectFragment,
    DevelopFragment,
    HistoryFragment,
    SelectorFragment,
    SettingsFragment,
    ClipboardFragment,
    KeyCommanderFragment
  ]);

  didInitialize() {
    ReactDOM.render(<MainComponent app={this} />, this.config.element);
  }

  notify(message) {
    super.notify(message);

    switch(message.type) {
      case SET_ROOT_ENTITY : return this._setRootEntity(message);
      case DISPOSE: return this.dispose();
    }
  }

  _setRootEntity(message) {
    message.entity.notifier.push(this.notifier);
    this.setProperties({
     rootEntity: message.entity
   });
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.config.element);
  }
}

export default Application;
