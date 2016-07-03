import CoreObject from './index';
import expect from 'expect.js';

describe(__filename + '#', () => {
  it('can be created', () => {
    var ref = CoreObject.create();
    expect(ref).to.be.an(CoreObject);
  });

  it('can be created with initial properties', () => {
    var ref = CoreObject.create({ a: 'b', c: 'd' });
    expect(ref.a).to.be('b');
    expect(ref.c).to.be('d');
  });
});
