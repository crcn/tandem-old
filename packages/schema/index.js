import { BaseError, InvalidError } from 'errors';
import BaseObject from 'object-base';


/**
 */

class Field extends BaseObject {

  /**
   */

  constructor(properties) {
    super({});

    if (typeof properties === 'function') {
      this.type = properties;
    } else {
      Object.assign(this, properties);
    }

    if (!this.type) {
      throw BaseError.create('type must exist for schema field');
    }
  }

  coerce(value) {

    if (value == void 0) return;

    if (this.collection) {
      if (!Array.isArray(value)) value = [value];
      return value.map((value) => {
        return this._coerce(value);
      });
    }

    return this._coerce(value);
  }

  _coerce(value) {
    if (value instanceof this.type) return value;

    // primitive
    if (!!~[
      String, Number, Boolean, Function
    ].indexOf(this.type))  return this.type(value);

    return new this.type(value);
  }

  validate(value, data) {

    // TODO - check for invalid
    if (value == void 0) {
      if (this.default != void 0) {
        value = typeof this.default === 'function' ? this.default() : this.default;
      } else if (this.required) {
        throw InvalidError.create('invalid');
      } else {
        return;
      }
    }

    // if (this.validate && !this.validate(value, data)) {
    //   throw InvalidError.create('invalid');
    // }

  }
}

/**
 */

class Schema extends BaseObject {

  /**
   */

  constructor(options) {

    super();

    if (!options) options = {};

    var fields  = options.fields || {};
    var _fields = {};

    for (var key in fields) {
      var fieldOptions = fields[key];
      if (Array.isArray(fieldOptions)) {
        fieldOptions = typeof fieldOptions[0] === 'function' ? {
          type: fieldOptions[0]
        } : fieldOptions[0];

        fieldOptions = Object.assign({ collection: true }, fieldOptions);
      }
      _fields[key] = new Field(fieldOptions);
    }

    this.fields = _fields;
  }

  /**
   */

  validate(data) {
    for (var property in this.fields) {

      var field  = this.fields[property];
      var value  = data[property];

      try {
        field.validate(value, data);
      } catch(e) {

        // re-throw with a more especific error message. This is coded as well so that it can be
        // internationalized.
        if (e.code === InvalidError.code) {
          var err   = InvalidError.create(property + '.' + e.message);
          err.field = this.fields[property];
          throw err;
        }

        throw e;
      }
    }
  }

  /**
   */

  coerce(data, keepOtherProps) {
    if (!data) data = {};
    if (keepOtherProps !== false) keepOtherProps = true;
    var coercedData = {};

    for (var property in this.fields) {
      var field  = this.fields[property];
      var value  = data[property];

      try {
        coercedData[property] = field.coerce(value, data);
      } catch(e) {

        // re-throw with a more especific error message. This is coded as well so that it can be
        // internationalized.
        if (e.code === InvalidError.code) {
          var err   = InvalidError.create(property + '.' + e.message);
          err.field = this.fields[property];
          throw err;
        }

        throw e;
      }
    }

    if (keepOtherProps) {
      coercedData = Object.assign({}, data, coercedData);
    }

    return coercedData;
  }
}

/**
 */

export default Schema;
