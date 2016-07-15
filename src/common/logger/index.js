import * as LogLevel from './levels';

import { create } from 'common/utils/class';
import { sprintf } from 'sprintf';
import { LogEvent } from './events';

export default class Logger {

  constructor(properties) {
    Object.assign(this, properties);

    if (!this.prefix) {
      this.prefix = '';
    }

    if (this.parent) {
      this.prefix = this.parent.prefix + this.prefix;
    }
  }

  createChild(properties) {
    return Logger.create({
      ...properties,
      bus: this.bus,
      level: this.level,
      parent: this,
    });
  }

  verbose() {
    this._log(LogLevel.VERBOSE, ...arguments);
  }

  info() {
    this._log(LogLevel.INFO, ...arguments);
  }

  warn() {
    this._log(LogLevel.WARN, ...arguments);
  }

  error() {
    this._log(LogLevel.ERROR, ...arguments);
  }

  _log(level, text, ...params) {

    var message = sprintf(`${this.prefix}${text}`, ...params.map(function (param) {
      if (typeof param === 'object') {
        param = JSON.stringify(param, null, 2);
      }
      return param;
    }));

    this.bus.execute(LogEvent.create(level, message));
  }

  static create = create;
}
