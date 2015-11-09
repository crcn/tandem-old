import expect from 'expect.js';
import Property from '../property';
import Binding  from '../binding';
import Container from '../container';

describe(__filename + '#', function() {
  it('can bind two properties together', function() {

    var container = new Container({
      children: [
        new Property({
          _id: 'a'
        }),
        new Binding({
          from : { _id: 'a' },
          to   : { _id: 'b' }
        }),
        new Property({
          _id: 'b'
        })
      ]
    });

    // transpile here

  });
});
