import {
  diff,
  SET_ATTRIBUTE,
  ADD_CHILD,
  INDEX_DOWN,
  INDEX_UP,
  REMOVE_ATTRIBUTE,
  REMOVE_CHILD,
  MOVE_CHILD,
  MOVE_CURSOR,
  SET_NODE_VALUE
} from "sf-core/markup";

import { parse as parseHTML } from "./index.peg";
import { expect } from "chai";

describe(__filename + "#", function() {

  [
    [
      `hello`,
      `world`,
      [SET_NODE_VALUE]
    ],
    [
      `<div />`,
      `<div id="a" />`,
      [SET_ATTRIBUTE]
    ],
    [
      `<div id="a" />`,
      `<div id="b" />`,
      [SET_ATTRIBUTE]
    ],
    [
      `<div id="a" />`,
      `<div id="b" />`,
      [SET_ATTRIBUTE]
    ],
    [
      `<div id="b" />`,
      `<div />`,
      [REMOVE_ATTRIBUTE]
    ],
    [
      `<div></div>`,
      `<div>a</div>`,
      [ADD_CHILD]
    ],
    [
      `<div>a</div>`,
      `<div></div>`,
      [REMOVE_CHILD]
    ],
    [
      `<div><h1>1</h1><h2>2</h2><h3>3</h3></div>`,
      `<div><h3>3</h3><h2>2</h2><h1>1</h1></div>`,
      [MOVE_CHILD, MOVE_CHILD]
    ],
    [
      `<div>blarg<h1>3</h1></div>`,
      `<div><h3>3</h3><h2>2</h2><h1>1</h1></div>`,
      [INDEX_DOWN, SET_NODE_VALUE, INDEX_UP, REMOVE_CHILD, ADD_CHILD, ADD_CHILD, MOVE_CHILD]
    ],
    [
      `<div><h1>1</h1><h2>2</h2><ul><li>1</li><li>2</li><li>3</li></ul></div>`,
      `<div><h1>1</h1><h2>2</h2><ul><li>1</li><li>2</li><li>3</li></ul></div>`,
      []
    ],
  ].forEach(function([source, dest, changeTyps]) {
    it(`can diff the changes from ${source} to ${dest}`, function() {
      const changes = diff(parseHTML(source as string), parseHTML(dest as string));
      expect(JSON.stringify(changes.map((change) => change.type))).to.eql(JSON.stringify(changeTyps));
    });
  });
});