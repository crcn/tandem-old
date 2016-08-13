import { expect } from "chai";
import { Element, ValueNode, INode } from "./base";
import {
  diff,
  ADD_CHILD,
  MOVE_CHILD,
  REMOVE_CHILD,
  SET_ATTRIBUTE,
  IndexUpChange,
  SET_NODE_VALUE,
  AddChildChange,
  IndexDownChange,
  MoveChildChange,
  REMOVE_ATTRIBUTE,
  RemoveChildChange,
  SetNodeValueChange,
  SetAttributeChange,
  RemoveAttributeChange,
} from "./diff";


function element(name, attributes = {}, ...children) {
  const element = new Element(name);
  for (let key in attributes) element.setAttribute(key, attributes[key]);
  for (let child of children) element.appendChild(child);
  return element;
}

function text(nodeValue) {
  return new ValueNode("#text", nodeValue);
}

function comment(nodeValue) {
  return new ValueNode("#comment", nodeValue);
}

describe(__filename + "#", () => {

  class CustomElement1 extends Element { }
  class CustomElement2 extends Element { }

  [
    [
      element("a"),
      element("div"),
      [
        new RemoveChildChange(0),
        new AddChildChange(undefined)
      ]
    ],
    [
      text("a"),
      text("b"),
      [
        new SetNodeValueChange(0, "b")
      ]
    ],
    [
      element("a", {}, text("a"), text("b")),
      element("a", {}, text("b"), text("c")),
      [
        new SetNodeValueChange(0, "b"),
        new SetNodeValueChange(1, "c")
      ]
    ],

    // test case where nodeValue is undefined for ValueNode instance.
    [
      text(undefined),
      text("a"),
      [
        new SetNodeValueChange(0, "a")
      ]
    ],
     // test case where nodeValue is undefined for ValueNode instance.
    [
      text("a"),
      text(undefined),
      [
        new SetNodeValueChange(0, undefined)
      ]
    ],
    [
      element(
        "a",
        {},
        element("a", {}, text("b")),
        element("a")
      ),
      element(
        "a",
        {},
        element("a"),
        element("a", {}, text("b"))
      ),
      [
        new MoveChildChange(1, 0)
      ]
    ],
    [
      new CustomElement1("a"),
      new CustomElement2("a"),
      [
        new RemoveChildChange(0),
        new AddChildChange(undefined)
      ]
    ]
  ].forEach(function([oldNode, newNode, changeTypes]) {
    it(`diff ${JSON.stringify(changeTypes)} passes`, () => {
      expect(
        JSON.stringify(
          diff(<INode>oldNode, <INode>newNode).map((change) => {

            // clean up with stuff that's hard to compare
            if (change["node"]) delete change["node"];

            return JSON.parse(JSON.stringify(change));
          })
        )
      ).to.eql(JSON.stringify(changeTypes));
    });
  });
});