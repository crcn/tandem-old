import * as LogLevel from './levels';

import { Bus } from 'mesh';
import { sprintf } from 'sprintf';
import { LogAction } from '../actions/index';

export default class Logger {

  constructor(public bus:Bus, public prefix:string = '') { }

  verbose(text:string, ...rest) {
    this._log(LogLevel.VERBOSE, text, ...rest);
  }

  info(text:string, ...rest) {
    this._log(LogLevel.INFO, text, ...rest);
  }

  warn(text:string, ...rest) {
    this._log(LogLevel.WARN, text, ...rest);
  }

  error(text:string, ...rest) {
    this._log(LogLevel.ERROR, text, text, ...rest);
  }

  _log(level:number, text:string, ...params:Array<any>) {

    function stringify(value) {
      if (typeof value === 'object') {
        value = JSON.stringify(value, null, 2);
      }
      return value;
    }

    var message = sprintf(
      `${this.prefix}${stringify(text)}`,
      ...params.map(stringify)
    );

    this.bus.execute(new LogAction(level, message));
  }
}
