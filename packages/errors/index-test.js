import { BaseError, InvalidError } from './index';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('invalid error is an error', function() {
    var error = InvalidError.create('test');
    expect(error).to.be.an(InvalidError);
    expect(error).to.be.an(BaseError);
    expect(error).to.be.an(Error);
    expect(error.message).to.be('test');
  });
});
