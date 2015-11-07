import DataObject from './core/data/object';
import MainBus from './bus';
import Logger from './logger';
import React from 'react';
import ReactDOM from 'react-dom';
import MainComponent from './components/main';
import Model from './core/data/model';

class Application extends DataObject {

  constructor(properties) {
    super(properties);

    this.bus    = MainBus.create();
    this.logger = Logger.create();
  }

  initialize(config) {
    this.config = config;

    var project = new Model({
      children: [
        new Model({
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          bus: this.bus
        }),
        new Model({
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          bus: this.bus
        })
      ]
    });

    ReactDOM.render(<MainComponent app={this} bus={this.bus} currentTarget={project} />, config.element);
  }
}

export default Application;
