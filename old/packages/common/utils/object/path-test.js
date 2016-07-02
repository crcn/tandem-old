import expect from 'expect.js';
import { getValue, setValue } from './path';

describe(__filename + '#', function() {

  it('can return a simple path of an object', function() {
    expect(getValue({ a : 1 }, 'a')).to.be(1);
  });

  it('can return an embedded value', function() {
    expect(getValue({ a: { b: 2 }}, 'a.b')).to.be(2);
  });

  it('does not bust if a keypath does not exist', function() {
    expect(getValue({ }, 'a.b')).to.be(void 0);
  });

  it('can set the value of an object', function() {
    var o = {};
    setValue(o, 'a', 1);
    expect(o.a).to.be(1);
  });

  it('can set a keypath value of an object', function() {
    var o = {};
    setValue(o, 'a.b.c.d', 3);
    expect(o.a.b.c.d).to.be(3);
  });
});
