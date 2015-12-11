import Plugin from './entry';
import BaseObject from 'common/object/base';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    Plugin.create({ id: '1', type: 'a', factory: BaseObject });
  });

  it('throws an error if the id does not exist', function() {
    var err;
    try {
      Plugin.create({});
    } catch(e) { err = e; }
    expect(err.message).to.be('id.invalid');
  });
});
