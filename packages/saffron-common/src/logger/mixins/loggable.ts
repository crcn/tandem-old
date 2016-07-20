import Logger from '../../logger/index'; 
import { NoopBus } from 'mesh';

const noopBus = new NoopBus();

export default (clazz) => {

  Object.defineProperty(clazz.prototype, 'logger', {
    get() {
      return this._logger || (this._logger = new Logger({
        bus: this.bus || noopBus,
        prefix: `${this.constructor.name}: `,
      }));
    },
  });

  return clazz;
};
