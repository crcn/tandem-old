import expect from 'expect.js';
import BaseObject from 'saffron-common/object/base';
import { InvalidError } from 'saffron-common/errors';
import FactoryValueObject from './factory';

describe(__filename + '#', function() {
  it('throws an error if the value is not a factory', function() {
    var err;
    try {
      FactoryValueObject.create({});
    } catch(e) {
      err = e;
    }

    expect(err).to.be.an(InvalidError);
  });

  it('accepts a factory', function() {
    var vo = FactoryValueObject.create(BaseObject);
  });

  it('can create an object', function() {
    expect(FactoryValueObject.create(BaseObject).create()).to.be.an(BaseObject);
  })
});
