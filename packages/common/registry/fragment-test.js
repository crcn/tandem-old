import expect from 'expect.js';
import Fragment from './fragment';
import BaseObject from 'common/object/base';

describe(__filename + '#', function() {
  it('can be created', function() {
    Fragment.create({ id: '1', type: 'a', factory: BaseObject });
  });

  it('throws an error if the id does not exist', function() {
    var err;
    try {
      Fragment.create({});
    } catch(e) { err = e; }
    expect(err.message).to.be('id must be defined for fragments');
  });
});
