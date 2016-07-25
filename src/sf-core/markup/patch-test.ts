import {
  diff
} from './diff';

import {
  INode
} from './base';

import { patch } from './patch';
import { expect } from 'chai';

describe(__filename + '#', function() {
  [
    // node value change
    ['hello', 'world'],

    // add attribute
    ['<div />', '<div id="b" />'],

    // update attribute
    ['<div id="a" />', '<div id="b" />'],

    // remove attribute
    ['<div />', '<div id="b" />'],

    // add child
    ['<div />', '<div>hello</div>'],

    // remove child
    ['<div />', '<div></div>'],

    // replace child
    ['<div />', '<div><!--hello--></div>'],

    // Other Smokey, Mc. Smoke tests


  ].forEach(function([source, destSource]) {
    it(`can diff and patch ${source} to ${destSource}`, function() {
      var a = document.createElement('div');
      a.innerHTML = source;
      var b = document.createElement('div');
      b.innerHTML = destSource;
      const changes = diff(a as any, b as any);
      console.log(changes);
      console.log(a.innerHTML);
      patch(a as any, changes);

      expect(a.innerHTML).to.equal(b.innerHTML);
    });
  });
});