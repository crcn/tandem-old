import DataObject from './core/data/object';
import MainBus from './bus';
import Logger from './logger';

class Application extends DataObject {

  constructor(properties) {
    super(properties);

    this.bus    = MainBus.create();
    this.logger = Logger.create();
  }

  initialize() {
    this.logger.info('initialize');
  }
}

export default Application;
