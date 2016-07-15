import Logger from 'common/logger';
import { NoopBus } from 'mesh';

const noopBus = NoopBus.create();

export default (clazz) => {

  Object.defineProperty(clazz.prototype, 'logger', {
    get() {
      return this._logger || (this._logger = Logger.create({
        bus: this.bus || noopBus,
        prefix: `${this.constructor.name}: `,
      }));
    },
  });

  return clazz;
};
