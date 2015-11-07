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
          _id: 'model1',
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          bus: this.bus,
          outputs: [
            { target: { _id: 'model2' } },
            { target: { _id: 'model3' } }
          ]
        }),
        new Model({
          _id: 'model2',
          x: 100,
          y: 300,
          width: 100,
          height: 100,
          bus: this.bus,
          outputs: []
        }),
        new Model({
          _id: 'model3',
          x: 400,
          y: 300,
          width: 100,
          height: 100,
          bus: this.bus,
          outputs: []
        })
      ]
    });

    ReactDOM.render(<MainComponent app={this} bus={this.bus} currentTarget={project} />, config.element);
  }
}

export default Application;
