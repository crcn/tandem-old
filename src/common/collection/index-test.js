import Collection from './index';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    var ref = Collection.create();
    expect(ref).to.be.an(Collection);
    expect(ref).to.be.an(Array);
  });

  it('can be created with initial array data', function() {
    var ref = Collection.create([1, 2, 3, 4]);
    expect(ref.length).to.be(4);
    expect(ref[0]).to.be(1);
    expect(ref[2]).to.be(3);
  });

  it('can be created with properties', function() {
    var ref = Collection.create({a: 1, b: 2});
    expect(ref.a).to.be(1);
    expect(ref.b).to.be(2);
  });

  it('can push items onto the array', function() {
    var ref = Collection.create();
    ref.push(1, 2);
    expect(ref[0]).to.be(1);
    expect(ref.length).to.be(2);
  });

  it('can unshift items onto the array', function() {
    var ref = Collection.create([1, 2]);
    ref.unshift(3, 4);
    expect(ref[0]).to.be(3);
    expect(ref.length).to.be(4);
  });

  it('can pop() the collection', function() {
    var ref = Collection.create([1, 2]);
    expect(ref.pop()).to.be(2)
    expect(ref.length).to.be(1);
  });

  it('can shift() the collection', function() {
    var ref = Collection.create([1, 2]);
    expect(ref.shift()).to.be(1);
    expect(ref.length).to.be(1);
  });
});
