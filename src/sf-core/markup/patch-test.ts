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

    // move child
    ['<div><span></span>ab</div>', '<div>ab<span></span></div>'],

    // Other Smokey, Mc. Smoke tests

    ['<div>hello</div>', '<div>hello<!--world--></div>'],

    [
      `<div class="another-box" id="something">
          <ul>
            <li>5</li>
            <li>4</li>
            <li>3</li>
            <li>2</li>
          </ul>
        </div>`,
      `<div class="box" style="color:red;">
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
          </ul>
        </div>`
    ],


  ].forEach(function([source, destSource]) {
    it(`can diff and patch ${source} to ${destSource}`, function() {
      var a = document.createElement('div');
      a.innerHTML = source.replace(/[\n\r\s\t]+/g, " ");
      var b = document.createElement('div');
      b.innerHTML = destSource.replace(/[\n\r\s\t]+/g, " ");
      const changes = diff(a as any, b as any);
      patch(a as any, changes);
      expect(a.innerHTML).to.equal(b.innerHTML);
    });
  });
});