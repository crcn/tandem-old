import BaseObject from './Base';
import { expect } from 'chai';

describe(__filename + '#', () => {
  xit('can be created', () => {
    BaseObject.create();
  });

  xit('can be created with properties in the constructor', () => {
    expect(BaseObject.create({
      a: 'b',
    }).a).to.be('b');
  });
});
