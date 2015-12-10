import { translate } from '../';
import Node from 'common/node';
import expect from 'expect.js';
import stringifyNode from './utils/stringify-node';

describe(__filename + '#', function() {

  [
    // basic
    [
      Node.create({
        type: 'displayObject'
      }),
      '<div />'
    ],

    // basic
    [
      Node.create({
        type: 'displayObject'
      }, [
        Node.create({
          type: 'displayObject'
        }),
        Node.create({
          type: 'displayObject'
        })
      ]
    ),
      '<div><div /><div /></div>'
    ]
  ].forEach(function(cases) {
    expect(stringifyNode(translate(cases[0]))).to.be(cases[1]);
  });

});
