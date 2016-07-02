
import expect from 'expect.js';
import Collection from './collection';
import CallbackNotifier from './callback';

describe(__filename + '#', function() {

  it('can be created', function() {
    Collection.create();
  });

  it('promisifies all notifications', function(next) {
    var c = Collection.create();

    c.push(CallbackNotifier.create(function() {
      return Promise.resolve(1);
    }));

    c.push(CallbackNotifier.create(function() {
      return Promise.resolve(2);
    }));

    c.notify({}).then(function([a, b]) {
      expect(a).to.be(1);
      expect(b).to.be(2);
      next();
    });
  });
});
