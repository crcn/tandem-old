import * as LogLevel from "./levels";

import { IActor } from "sf-base/actors";
import { sprintf } from "sprintf";
import { LogAction } from "../actions";

export class Logger {

  constructor(public bus: IActor, public prefix: string = "") { }

  verbose(text: string, ...rest) {
    this._log(LogLevel.VERBOSE, text, ...rest);
  }

  info(text: string, ...rest) {
    this._log(LogLevel.INFO, text, ...rest);
  }

  warn(text: string, ...rest) {
    this._log(LogLevel.WARN, text, ...rest);
  }

  error(text: string, ...rest) {
    this._log(LogLevel.ERROR, text, text, ...rest);
  }

  _log(level: number, text: string, ...params: Array<any>) {

    function stringify(value) {
      if (typeof value === "object") {
        value = JSON.stringify(value, null, 2);
      }
      return value;
    }

    const message = sprintf(
      `${this.prefix}${stringify(text)}`,
      ...params.map(stringify)
    );

    this.bus.execute(new LogAction(level, message));
  }
}
