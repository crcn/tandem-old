import DispatcherCollection from './Collection';
import CallbackDispatcher from './Callback';
import Event from 'common/events/Event';
import { expect } from 'chai';

describe(__filename + '#', () => {
  xit('dispatches an event to all children', () => {

    const events   = [];
    const d        = new DispatcherCollection();
    const callback = (event) => events.push(event);

    d.push(
      CallbackDispatcher.create(callback),
      CallbackDispatcher.create(callback)
    );

    d.dispatch(Event.create('hello'));

    expect(events.length).to.be(2);
    expect(events[0].type).to.be('hello');
    expect(events[1].type).to.be('hello');
  });
});
