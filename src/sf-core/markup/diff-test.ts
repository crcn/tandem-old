import { Element, TextNode, CommentNode, INode } from "./base";
import {
  diff,
  SetNodeValueChange,
  SET_NODE_VALUE,
  ADD_CHILD,
  MOVE_CHILD,
  REMOVE_CHILD,
  SET_ATTRIBUTE,
  REMOVE_ATTRIBUTE,
  RemoveAttributeChange,
  RemoveChildChange,
  SetAttributeChange,
  AddChildChange,
  MoveChildChange,
  IndexDownChange,
  IndexUpChange
} from "./diff";
import { expect } from "chai";


function element(name, attributes = {}, ...children) {
  const element = new Element(name);
  for (const key in attributes) element.setAttribute(key, attributes[key]);
  for (const child of children) element.appendChild(child);
  return element;
}

function text(nodeValue) {
  return new TextNode(nodeValue);
}

function comment(nodeValue) {
  return new CommentNode(nodeValue);
}

describe(__filename + "#", function() {

  class CustomElement1 extends Element { }
  class CustomElement2 extends Element { }

  [
    [
      element('a'),
      element('div'),
      [
        new RemoveChildChange(0),
        new AddChildChange(undefined)
      ]
    ],
    [
      text('a'),
      text('b'),
      [
        new SetNodeValueChange(0, 'b')
      ]
    ],
    [
      element('a', {}, text('a'), text('b')),
      element('a', {}, text('b'), text('c')),
      [
        new SetNodeValueChange(0, 'b'),
        new SetNodeValueChange(1, 'c')
      ]
    ],
    [
      element(
        'a',
        {},
        element('a', {}, text('b')),
        element('a')
      ),
      element(
        'a',
        {},
        element('a'),
        element('a', {}, text('b'))
      ),
      [
        new MoveChildChange(1, 0)
      ]
    ],
    [
      new CustomElement1('a'),
      new CustomElement2('a'),
      [
        new RemoveChildChange(0),
        new AddChildChange(undefined)
      ]
    ]
  ].forEach(function([oldNode, newNode, changeTypes]) {
    it(`diff ${JSON.stringify(changeTypes)} passes`, function() {
      expect(
        JSON.stringify(
          diff(<INode>oldNode, <INode>newNode).map((change) => {
            var c = JSON.parse(JSON.stringify(change));

            // clean up with stuff that's hard to compare
            if (c.node) delete c.node;
            return c;
          })
        )
      ).to.eql(JSON.stringify(changeTypes));
    });
  });
});