import ValueType from './index';
import expect from 'expect.js';

describe(__filename + '#', function() {

  it('can be extended and validated properly', function() {
    class AType extends ValueType {
      validate(value) {
        return value === 'a';
      }
    }
    AType.create('a');
    var err;
    try {
      AType.create('b');
    } catch(e) {
      err = e;
    }
    expect(err.message).to.be('invalid');
  });

  it('coerces values before validating', function() {
    class AType extends ValueType {
      coerce(value) {
        return String(value).toLowerCase();
      }
      validate(value) {
        return value === 'a';
      }
    }

    AType.create('a');
    var at = AType.create('A');
    expect(at.valueOf()).to.be('a');
  });

  it('can properly compare a value object against another value object', function() {
    expect(ValueType.create(10) < ValueType.create(100)).to.be(true);
  });

  it('returns true for equals', function() {
    expect(ValueType.create(10).equals(ValueType.create(10))).to.be(true);
  });

  it('pulls the value of a value in from the constructor', function() {
    expect(ValueType.create(ValueType.create(10)).valueOf()).to.be(10);
  });

  it('can properly be converted to a JSON object', function() {
    var v = ValueType.create(10);
    expect(JSON.parse(JSON.stringify(v))).to.be(10);
  })
});
