import Logger from '../logger/index'; 
import { NoopBus } from 'mesh';

const noopBus = new NoopBus();

export default (clazz) => {

  Object.defineProperty(clazz.prototype, 'logger', {
    get() {
      return this._logger || (this._logger = new Logger(
        this.bus, 
        `${this.constructor.name}:`
      ));
    },
  });

  return clazz;
};
