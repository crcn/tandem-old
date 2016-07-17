import expect from 'expect.js';
import { BaseError, InvalidError } from './index';

describe(__filename + '#', () => {
  it('invalid error is an error', () => {
    var error = InvalidError.create('test');
    expect(error).to.be.an(InvalidError);
    expect(error).to.be.an(BaseError);
    expect(error).to.be.an(Error);
    expect(error.message).to.be('test');
  });
});
