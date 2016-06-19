import Collection from './Collection';

describe(__filename + '#', () => {
  it('is an array', () => {
    expect(Collection.create([1, 2, 3])).to.be.an.instanceof(Array);
    expect(Collection.create([1, 2, 3]).concat([4, 5, 6])).to.be.an.instanceof(Array);
    expect(Collection.create([1, 2, 3]).concat([4, 5, 6]).length).to.equal(6);
  });

  it('can assign properties in the constructor', () => {
    expect(Collection.create({ a: 'b' }).a).to.equal('b');
  });
});
