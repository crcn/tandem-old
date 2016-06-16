import BaseObject from './Base';
import expect from 'expect.js';

describe(__filename + '#', () => {
  it('can be created', () => {
    BaseObject.create();
  });

  it('can be created with properties in the constructor', () => {
    expect(BaseObject.create({
      a: 'b',
    }).a).to.be('b');
  });
});
