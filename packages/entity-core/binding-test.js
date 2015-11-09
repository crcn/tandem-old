import expect from 'expect.js';
import Property from './property';
import Binding  from './binding';
import Container from './container';

describe(__filename + '#', function() {
  it('can bind two properties together', function() {

    var ref = new Reference({
      _id: 'a'
    });

    // ref.subscribe()

    var container = new Container({
      children: [
        new Reference({
          _id: 'a'
        })
        new Reference({
          _id: 'a'
        }),
        new Assignment({
          _id: 'a1',
          target: { _id: 'b' }
        }),
        new Connection({
          _id: 'c1',
          from: { _id: 'a' },
          to: { _id: 'a1' },
        })
        new Reference({
          _id: 'b'
        })
      ]
    });

    // transpile here

  });
});
