import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base-application';
import ReactDOM from 'react-dom';
import React from 'react';

import EditorPlugin from 'plugins-editor';
import sift from 'sift';

class Application extends BaseApplication {

  static plugins = [
    EditorPlugin
  ]

  initialize(config) {
    var rootComponentEntry = this.registry.find(sift({ id: 'rootComponent' }));
    ReactDOM.render(rootComponentEntry.create({ application: this }), config.element);
  }
}

export default Application;
