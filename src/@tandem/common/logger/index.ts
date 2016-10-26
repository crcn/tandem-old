import { IActor } from "@tandem/common/actors";
import { sprintf } from "sprintf";
import { LogLevel } from "./levels";
import { Action } from "../actions";

export class LogAction extends Action {
  static readonly LOG        = "log";
  constructor(readonly level: number, readonly text: string) {
    super(LogAction.LOG);
  }
}

export class Logger {

  public generatePrefix: () => string;

  constructor(public bus: IActor, public prefix: string = "", private _parent?: Logger) { }

  createChild(prefix: string = "") {
    return new Logger(this.bus, prefix, this);
  }

  /**
   * Extra noisy logs which aren't very necessary
   */

  verbose(text: string, ...rest) {
    this._log(LogLevel.VERBOSE, text, ...rest);
  }

  /**
   * General logging information to help with debugging
   */

  log(text: string, ...rest) {
    this._log(LogLevel.LOG, text, ...rest);
  }

  /**
   * log which should grab the attention of the reader
   */

  info(text: string, ...rest) {
    this._log(LogLevel.INFO, text, ...rest);
  }

  warn(text: string, ...rest) {
    this._log(LogLevel.WARN, text, ...rest);
  }

  error(text: string, ...rest) {
    this._log(LogLevel.ERROR, text, text, ...rest);
  }

  private getPrefix() {
    let prefix = this.generatePrefix && this.generatePrefix() || this.prefix;

    if (this._parent) {
      prefix = this._parent.getPrefix() + prefix;
    }
    return prefix;
  }

  _log(level: number, text: string, ...params: Array<any>) {

    function stringify(value) {
      if (typeof value === "object") {
        value = JSON.stringify(value, null, 2);
      }
      return value;
    }

    const message = sprintf(
      `${this.getPrefix()}${stringify(text)}`,
      ...params.map(stringify)
    );

    this.bus.execute(new LogAction(level, message));
  }
}


export * from "./levels";