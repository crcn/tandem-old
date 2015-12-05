import Entry from './entry';
import BaseObject from 'base-object';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    Entry.create({ id: '1', factory: BaseObject });
  });

  it('throws an error if the id does not exist', function() {
    var err;
    try {
      Entry.create({});
    } catch(e) { err = e; }
    expect(err.message).to.be('id.invalid');
  });

  it('throws an error if the factory is not actually a factory', function() {
    var err;
    try {
      Entry.create({ id: '1', factory: {} });
    } catch(e) { err = e; }
    expect(err.message).to.be('factory.invalid');
  });

  it('can be created with props', function() {
    // expect(Entry.create({ name: 'a' }).name).to.be('a');
  });
});
