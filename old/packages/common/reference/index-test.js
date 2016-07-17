import expect from 'expect.js';
import Reference from './index';
import BaseObject from 'saffron-common/object/base';

describe(__filename + '#', function() {
  it('can get a referenced value', function() {
    var ref = Reference.create(BaseObject.create({ a: 1 }), 'a');
    expect(ref.getValue()).to.be(1);
  });

  it('can set a referenced value', function() {
    var ref = Reference.create(BaseObject.create(), 'a');
    expect(ref.getValue()).to.be(void 0);
    ref.setValue(2);
    expect(ref.getValue()).to.be(2);
  });
});
