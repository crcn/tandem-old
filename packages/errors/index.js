// TODO - this shit.
import { create, createFactory } from 'utils-class';

var code = 1;

export class BaseError extends Error {

  constructor() {
    super();
  }

  static create = function(message) {
    var error = new Error(message);
    error.__proto__ = this.prototype;
    error.code = this.code;
    this.apply(error, arguments);
    return error;
  }
}

export class InvalidError extends BaseError {
  static code = code = code << 1;
}
