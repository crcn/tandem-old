import Logger from 'common/logger';
import { NoopBus } from 'mesh';

var noopBus = NoopBus.create();

export default function(clazz) {

  Object.defineProperty(clazz.prototype, 'logger', {
    get() {
      return this._logger || (this._logger = Logger.create({
        bus: this.bus || noopBus,
        prefix: `${clazz.name}: `
      }));
    }
  })

  return clazz;
}
