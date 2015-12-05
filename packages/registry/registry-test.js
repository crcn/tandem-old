import Registry from './registry';
import Entry from './entry';
import sift from 'sift';

describe(__filename + '#', function() {

  it('can be created', function() {
    Registry.create();
  });

  it('is an array', function() {
    expect(Registry.create()).to.be.an(Array);
  });

  it('can registry a new dependency', function() {
    var r = Registry.create();
    var entry = r.register(Entry.create({ }));
    expect(r.length).to.be(1);
  });
});
