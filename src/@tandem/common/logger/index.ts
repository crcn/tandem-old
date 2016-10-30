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

export class LogTimer {
  private _startTime: number;
  private _interval: any;

  constructor(readonly logger: Logger, readonly intervalMessage?: string, readonly timeout?: number) {
    this._startTime = Date.now();

    if (intervalMessage && timeout) {
      this._interval = setInterval(() => {
        this.logTime(intervalMessage);
      }, timeout);
    }
  }

  stop(message?: string) {
    clearInterval(this._interval);
    this.logTime(message || "completed");
  }

  private logTime(message: string) {
    this.logger.verbose(`${message} %ss`, ((Date.now() - this._startTime) / 1000).toFixed(0));
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
   * @deprecated. Use verbose.
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

  startTimer(timeoutMessage?: string, interval: number = 5000) {
    return new LogTimer(this, timeoutMessage, interval);
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