import observable from './observable';
import CoreObject from '../index';
import Collection from '../collection';

describe(__filename + '#', function() {
  describe('objects', function() {
    it('can be made observable', function() {

      class ObservableObject extends CoreObject { }

      ObservableObject = observable(ObservableObject);

      var ref = ObservableObject.create();
    });

    it('includes all the changes on the object', function() {
        class ObservableObject extends CoreObject { }

        ObservableObject = observable(ObservableObject);

        var ref = ObservableObject.create();
        var changes = [];

        ref.observe({
          dispatch(event) { changes = event.changes; }
        });

        ref.setProperties({ a: 1 });

        expect(changes.length).to.be(1);
        expect(changes[0].type).to.be('create');
        expect(changes[0].property).to.be('a');
        expect(changes[0].value).to.be(1);
        expect(changes[0].oldValue).to.be(void 0);

        ref.setProperties({ a: void 0 });

        expect(changes[0].type).to.be('delete');
        expect(changes[0].oldValue).to.be(1);
        expect(changes[0].property).to.be('a');

        ref.setProperties({ a: 1});
        ref.setProperties({ a: 2, b: 2 });

        expect(changes.length).to.be(2);
        expect(changes[0].type).to.be('update');
        expect(changes[0].oldValue).to.be(1);
        expect(changes[0].property).to.be('a');
        expect(changes[0].value).to.be(2);
    });
  });

  describe('collection', function() {
    it('can be made observable', function() {

      class ObservableCollection extends Collection { }

      ObservableCollection = observable(ObservableCollection);

      var ref = ObservableCollection.create();
      var i = 0;
      ref.observe({
        dispatch() { i++ }
      });

      ref.push(1, 2, 3);
      expect(i).to.be(1);
    });

    it('includes all changes', function() {
      class ObservableCollection extends Collection { }

      ObservableCollection = observable(ObservableCollection);

      var ref = ObservableCollection.create();
      var changes = [];

      ref.observe({
        dispatch(event) { changes = event.changes; }
      });

      ref.push(1, 2);
      expect(changes.length).to.be(1);
      expect(changes[0].type).to.be('splice');
      expect(changes[0].values.length).to.be(2);
    });
  });

  it('throws an error if a class is made observable twice', function() {
    class ObservableObject extends CoreObject { }

    ObservableObject = observable(ObservableObject);

    class ObservableObject2 extends ObservableObject { }

    expect(function() {
      observable(ObservableObject2);
    }).to.throwError()
  });
});
