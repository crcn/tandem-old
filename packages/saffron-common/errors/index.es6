var code = 1;

export class BaseError extends Error {

  static create = function (message) {
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

export class ExistsError extends BaseError {
  static code = code = code << 1;
}
