import Fragment from './fragment';
import Registry from './registry';
import BaseObject from 'common/object/base';
import { InvalidError, ExistsError } from 'common/errors';

describe(__filename + '#', function() {

  it('can be created', function() {
    Registry.create();
  });

  it('can registry a new dependency', function() {
    var r = Registry.create();
    var fragment = r.register(Fragment.create({ id: '1', type: 'a', factory: BaseObject }));
    expect(r.length).to.be(1);
  });

  it('can find one dependency', function() {
    var r = Registry.create();
    var e1 = r.register(Fragment.create({ id: '1', type: 'component', factory: BaseObject }))
    var e2 = r.register(Fragment.create({ id: '2', type: 'model', factory: BaseObject }));
    expect(r.queryOne({ type: 'model' })).to.be(e2);
  });

  it('throws an error if an entry already exists with the same ID', function() {
    var r = Registry.create();
    var err;
    try {
      var e1 = r.register(Fragment.create({ id: '1', type: 'abb', factory: BaseObject }));
      var e2 = r.register(Fragment.create({ id: '1', type: 'abb', factory: BaseObject }));
    } catch(e) {
      err = e;
    }
    expect(err).to.be.an(ExistsError);
  });
});
