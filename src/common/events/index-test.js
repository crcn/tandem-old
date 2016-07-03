import { Event } from './index';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    Event.create('a');
  });

  it('only sets target once when setting current target', function() {
    var e = Event.create('a');
    e.currentTarget = 1;
    expect(e.currentTarget).to.be(1);
    expect(e.target).to.be(1);
    e.currentTarget = 2;
    expect(e.currentTarget).to.be(2);
    expect(e.target).to.be(1);
  });
});
