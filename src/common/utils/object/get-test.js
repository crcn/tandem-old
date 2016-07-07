import get from './get';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can get a property on an object', function() {
    var target = { a: 1 };
    expect(get(target, 'a')).to.be(1);
  });

  it('can get a nested property on an object', function() {
    var target = { a: { b: 2 } };
    expect(get(target, 'a.b')).to.be(2);
  });

  it('returns undefined if a property does not exist', function() {
    var target = { a: 1, b: { c: void 0 }};

    expect(get(target, 'a.b.c')).to.be(void 0);
    expect(get(target, 'b.c.d')).to.be(void 0);
  });

  it('can return a value from a [[parent]] object', function() {
    var target = { '[[parent]]': { a: 1 }};

    expect(get(target, 'a')).to.be(1);
  });

  it('does not inherit a property if one is defined ', function() {
    var target = { '[[parent]]': { a: 1 }, a: void 0 };

    expect(get(target, 'a')).to.be(void 0);
  });
});
