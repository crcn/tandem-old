import FactoryValueObject from './factory';
import { InvalidError } from 'common/errors';
import BaseObject from 'common/object/base';
import expect from 'expect.js';

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
