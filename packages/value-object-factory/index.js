import ValueObject from 'value-object';

class FactoryValueObject extends ValueObject {
  validate(value) {
    return value != void 0 && value.create != void 0;
  }
  create() {
    var value = this.valueOf();
    return value.create.apply(value, arguments);
  }
}

export default FactoryValueObject;
