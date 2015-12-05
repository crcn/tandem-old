import Collection from './index';

describe(__filename + '#', function() {
  it('can can be created', function() {
    var a = Collection.create();
  });

  it('set properties from the constructor', function() {
    var a = Collection.create({ name: 'a' });
    expect(a.name).to.be('a');
  });

  it('can push items into the collection', function() {
    var a = Collection.create();
    a.push(1, 2, 3);
    expect(a.length).to.be(3);
  });

  it('can unshift() items', function() {
    var a = Collection.create();
    a.unshift(1, 4);
    expect(a.length).to.be(2);
  });

  it('can pop() items', function() {
    var a = Collection.create();
    a.push(1, 2);
    a.pop();
    expect(a.length).to.be(1);
  });

  it('can shift() items', function() {
    var a = Collection.create();
    a.push(1, 2);
    a.shift();
    expect(a.length).to.be(1);
  });

  it('can remove() items', function() {
    var a = Collection.create();
    a.push(2, 3, 4);
    a.remove(2, 4);
    expect(a.length).to.be(1);
  });
});
