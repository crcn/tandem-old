import AcceptNotifer from './accept';
import CallbackNotifier from './callback';
import sift from 'sift';
import expect from 'expect.js';

describe(__filename + '#', function() {

  it('can be created', function() {
    AcceptNotifer.create();
  });

  it('can notify when filter returns true', function() {
    var messages = [];

    var a = AcceptNotifer.create(sift({ type: 'change'}), CallbackNotifier.create(function(message) {
        messages.push(message);
    }));

    a.notify({ type: 'change' });
    expect(messages.length).to.be(1);
    a.notify({ type: 'abba' });
    expect(messages.length).to.be(1);
    a.notify({ type: 'change' });
    expect(messages.length).to.be(2);
  });


});
