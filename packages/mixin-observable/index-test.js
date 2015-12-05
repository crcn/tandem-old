import mixinObservable from './index';
import BaseObject from 'base-object';
export expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be mixed into an object', function() {

    var SubObject = mixinObservable(BaseObject);
    expect(SubObject).not.to.be(BaseObject);

    var i = 0;

    var a = SubObject.create({
      notifier: {
        notify(action) {
          expect(action.target).to.be(a);
          expect(action.type).to.be('change');
          i++;
        }
      }
    });

    a.setProperties({ a: 1 });
    expect(a.a).to.be(1);
    expect(i).to.be(1);

  });
});
