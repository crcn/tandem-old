import Entry from './entry';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    Entry.create();
  });

  it('can be created with props', function() {
    expect(Entry.create({ name: 'a' }).name).to.be('a');
  });
});
