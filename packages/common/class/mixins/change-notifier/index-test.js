
export expect from 'expect.js';
import BaseObject from 'common/object/base';
import Collection from 'common/collection';
import mixinChangeNotifier from './index';

describe(__filename + '#', function() {
  it('can be mixed into an object', function() {

    var SubObject = mixinChangeNotifier(BaseObject);
    expect(SubObject).not.to.be(BaseObject);

    var i = 0;

    var a = SubObject.create({
      notifier: {
        notify(message) {
          expect(message.type).to.be('change');
          expect(message.changes.length).to.be(1);
          i++;
        }
      }
    });

    a.setProperties({ a: 1 });
    expect(a.a).to.be(1);
    expect(i).to.be(1);
  });

  it('can be mixed into a collection', function() {
    var SubCollection = mixinChangeNotifier(Collection);
    var currentMessage;

    var a = SubCollection.create({
      notifier: {
        notify(message) {
          currentMessage = message;
        }
      }
    });

    a.push(1, 2, 3);
    expect(currentMessage.changes[0].added[0]).to.be(1);
    expect(currentMessage.changes[0].added[1]).to.be(2);
    a.splice(1, 1, 6);
    expect(currentMessage.changes[0].added[0]).to.be(6);
    expect(currentMessage.changes[0].added[0]).to.be(6);
    expect(currentMessage.changes[0].removed[0]).to.be(2);
  });

});
