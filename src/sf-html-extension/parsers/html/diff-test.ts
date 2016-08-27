import { expect } from "chai";
import { parse as parseHTML } from "./index.peg";
import {
  diff,
  INDEX_UP,
  ADD_CHILD,
  MOVE_CHILD,
  INDEX_DOWN,
  MOVE_CURSOR,
  REMOVE_CHILD,
  SET_ATTRIBUTE,
  SET_NODE_VALUE,
  REMOVE_ATTRIBUTE,
} from "sf-core/markup";

describe(__filename + "#", () => {

  [
    [
      `hello`,
      `world`,
      [SET_NODE_VALUE]
    ],
    [
      `<div />`,
      `<div id="a" />`,
      [INDEX_DOWN, SET_ATTRIBUTE, INDEX_UP]
    ],
    [
      `<div id="a" />`,
      `<div id="b" />`,
      [INDEX_DOWN, SET_ATTRIBUTE, INDEX_UP]
    ],
    [
      `<div id="a" />`,
      `<div id="b" />`,
      [INDEX_DOWN, SET_ATTRIBUTE, INDEX_UP]
    ],
    [
      `<div id="b" />`,
      `<div />`,
      [INDEX_DOWN, REMOVE_ATTRIBUTE, INDEX_UP]
    ],
    [
      `<div></div>`,
      `<div>a</div>`,
      [INDEX_DOWN, ADD_CHILD, INDEX_UP]
    ],
    [
      `<div>a</div>`,
      `<div></div>`,
      [INDEX_DOWN, REMOVE_CHILD, INDEX_UP]
    ],
    [
      `<div><h1>1</h1><h2>2</h2><h3>3</h3></div>`,
      `<div><h3>3</h3><h2>2</h2><h1>1</h1></div>`,
      [INDEX_DOWN, MOVE_CHILD, MOVE_CHILD, INDEX_UP]
    ],
    [
      `<div>blarg<h1>3</h1></div>`,
      `<div><h3>3</h3><h2>2</h2><h1>1</h1></div>`,
      [INDEX_DOWN, INDEX_DOWN, SET_NODE_VALUE, INDEX_UP, REMOVE_CHILD, ADD_CHILD, ADD_CHILD, MOVE_CHILD, INDEX_UP]
    ],
    [
      `<div><h1>1</h1><h2>2</h2><ul><li>1</li><li>2</li><li>3</li></ul></div>`,
      `<div><h1>1</h1><h2>2</h2><ul><li>1</li><li>2</li><li>3</li></ul></div>`,
      []
    ],
  ].forEach(function([source, dest, changeTyps]) {
    it(`can diff the changes from ${source} to ${dest}`, () => {
      const changes = diff(parseHTML(source as string), parseHTML(dest as string));
      expect(JSON.stringify(changes.map((change) => change.type))).to.eql(JSON.stringify(changeTyps));
    });
  });
});