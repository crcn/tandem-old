var code = 1;

export class BaseError extends Error {

  static create = function (message) {
    var error = new Error(message);
    (error as any).__proto__ = this.prototype;
    (error as any).code = (this as any).code;
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
