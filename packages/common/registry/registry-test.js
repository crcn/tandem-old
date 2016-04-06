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
    var e1 = r.register(Fragment.create({ id: '1', namespace: 'component1', type: 'component', factory: BaseObject }))[0]
    var e2 = r.register(Fragment.create({ id: '2', namespace: 'model1', type: 'model', factory: BaseObject }))[0];
    expect(r.queryOne('model1')).to.be(e2);
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

  it('can register & query a fragment with a namespace', function() {
    var r = Registry.create();
    var fragment = Fragment.create({ id: '1', namespace: 'a/b' });
    r.push(fragment);

    expect(r.queryOne('a/b')).to.be(fragment);
  });
});
