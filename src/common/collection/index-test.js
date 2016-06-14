import Collection from './index';
import expect from 'expect.js';

describe(__filename + '#', () => {
  it('is an array', () => {
    expect(Collection.create()).to.be.an(Array);

    // ensure that the collection is treated like an array
    expect(Collection.create([1, 2, 3]).concat(4, 5, 6).length).to.be(6);
  });

  it('can assign properties in the constructor', () => {
    expect(Collection.create({ a: 'b' }).a).to.be('b');
  });
});
