import * as LogLevel from './levels';

import { Bus } from 'mesh';
import { create } from '../utils/class/index';
import { sprintf } from 'sprintf';
import { LogEvent } from './events';

export default class Logger {

  public prefix:string;
  public bus:Bus;
  public parent:Logger; 
  public filterable:boolean;

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
    return Logger.create(Object.assign({}, properties, {
      bus: this.bus,
      parent: this
    }));
  }

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

    this.bus.execute(new LogEvent(level, message));
  }

  static create = create;
}
