import ObservableDispatcher from './observable';
import expect from 'expect.js';
import { Event } from 'common/events';

describe(__filename + '#', function() {
  it('can be created', function() {
    var d = ObservableDispatcher.create();
    expect(d).to.be.an(ObservableDispatcher);
  });

  it('can dispatch an event', function() {
    var d = ObservableDispatcher.create();
    var i = 0;
    d.observe({
      dispatch(e) { i++ }
    });

    d.dispatch(Event.create('change'));
    expect(i).to.be(1);

    d.observe({
      dispatch(e) { i++ }
    });
    d.dispatch(Event.create('change'));
    expect(i).to.be(3);
  });

  it('can dipose a listener', function() {
    var d = ObservableDispatcher.create();
    var i = 0;
    var listener = d.observe({
      dispatch(e) { i++ }
    });

    d.dispatch(Event.create('change'));
    expect(i).to.be(1);

    listener.dispose();

    d.dispatch(Event.create('change'));
    expect(i).to.be(1);

    // sanity. ensure that this doesn't break.
    listener.dispose();
  });

  it('sets the current target of an event to itself', function() {
    var d = ObservableDispatcher.create();
    var event;
    d.observe({
      dispatch(e) { event = e; }
    });

    d.dispatch(Event.create('event'));

    expect(event.currentTarget).to.be(d);
  });


  it('can set the target of the dispatcher in the constructor', function() {
    var target = {};
    var d = ObservableDispatcher.create(target);
    var event;
    var listener = d.observe({
      dispatch(e) { event = e; }
    });
    
    d.dispatch(Event.create('event'));

    expect(event.currentTarget).to.be(target);
  });
});
