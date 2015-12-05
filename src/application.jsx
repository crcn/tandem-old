import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base-application';
import Editor from 'editor';
import ReactDOM from 'react-dom';
import React from 'react';

class Application extends BaseApplication {
  initialize(config) {
    ReactDOM.render(<Editor app={this} />, config.element);
  }
}

export default Application;
