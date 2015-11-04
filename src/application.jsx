import DataObject from './core/data/object';
import MainBus from './bus';
import Logger from './logger';
import React from 'react';
import ReactDOM from 'react-dom';
import MainComponent from './components/main';

class Application extends DataObject {

  constructor(properties) {
    super(properties);

    this.bus    = MainBus.create();
    this.logger = Logger.create();
  }

  initialize(config) {
    this.config = config;
    ReactDOM.render(<MainComponent app={this} />, config.element);
  }
}

export default Application;
