import Registry from './registry';
import Entry from './entry';
import BaseObject from 'base-object';
import { InvalidError, ExistsError } from 'errors';
import sift from 'sift';

describe(__filename + '#', function() {

  it('can be created', function() {
    Registry.create();
  });

  it('can registry a new dependency', function() {
    var r = Registry.create();
    var entry = r.register(Entry.create({ id: '1', factory: BaseObject }));
    expect(r.length).to.be(1);
  });

  it('can find one dependency', function() {
    var r = Registry.create();
    var e1 = r.register(Entry.create({ id: '1', type: 'component', factory: BaseObject }))
    var e2 = r.register(Entry.create({ id: '2', type: 'model', factory: BaseObject }));
    expect(r.find(sift({ type: 'model' }))).to.be(e2);
  });

  it('throws an error if an entry already exists with the same ID', function() {
    var r = Registry.create();
    var err;
    try {
      var e1 = r.register(Entry.create({ id: '1', type: 'abb', factory: BaseObject }));
      var e2 = r.register(Entry.create({ id: '1', type: 'abb', factory: BaseObject }));
    } catch(e) {
      err = e;
    }
    expect(err).to.be.an(ExistsError);
  });
});
