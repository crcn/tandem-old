import { Element, TextNode, CommentNode, INode } from "./base";
import {
  diff,
  SetNodeValueChange,
  SET_NODE_VALUE,
  ADD_CHILD,
  MOVE_CHILD,
  REMOVE_CHILD,
  SET_ATTRIBUTE,
  REMOVE_ATTRIBUTE
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

  it("can add a TextNode value change", function() {
    const changes = diff(text('a'), text('b'));
    expect(changes.length).to.eql(1);
    const change = changes[0] as SetNodeValueChange;
    expect(change.nodePath).to.eql([]);
    expect(change.nodeValue).to.eql("b");
  });

  it("can add a CommentNode value change", function() {
    const changes = diff(comment('a'), comment('b'));
    expect(changes.length).to.eql(1);
    const change = changes[0] as SetNodeValueChange;
    expect(change.type).to.eql(SET_NODE_VALUE);
    expect(change.nodePath).to.eql([]);
    expect(change.nodeValue).to.eql("b");
  });

  it('adds a remove change if two do not match', function() {
    const changes = diff(comment("a"), text("b"));
    expect(changes.length).to.eql(2);
    expect(changes[0].type).to.equal(REMOVE_CHILD);
    expect(changes[1].type).to.equal(ADD_CHILD);
    expect(changes[1].nodePath).to.eql([]);
    expect(changes[1].node.nodeName).to.eql('#text');
  });

  it('updates attributes that have changed', function() {

    const changes = diff(
      element('div', { id: 'a' }),
      element('div', { id: 'b' })
    );

    expect(changes.length).to.eql(1);
    expect(changes[0].type).to.equal(SET_ATTRIBUTE);
  });

  it('removes attributes', function() {

    const changes = diff(
      element('div', { a: 'b', c: 'd', e: 'f' }),
      element('div', { a: 'b' })
    );

    expect(changes.length).to.eql(2);
    expect(changes[0].type).to.equal(REMOVE_ATTRIBUTE);
    expect(changes[1].type).to.equal(REMOVE_ATTRIBUTE);
  });

  it('adds new attributes', function() {

    const changes = diff(
      element('div', { a: 'b' }),
      element('div', { a: 'b', c: 'd', d: 'e' })
    );

    expect(changes.length).to.eql(2);
    expect(changes[0].type).to.equal(SET_ATTRIBUTE);
    expect(changes[1].type).to.equal(SET_ATTRIBUTE);
  });

  it('can diff nested text node values', function() {

    const changes = diff(
      element('div', {}, text('a')),
      element('div', {}, text('b'))
    );

    expect(changes.length).to.eql(1);
    expect(changes[0].type).to.equal(SET_NODE_VALUE);
  });

  [
    [
      element('a'),
      element('div'),
      [[REMOVE_CHILD, []], [ADD_CHILD, []]]
    ],
    [
      text('a'),
      text('b'),
      [[SET_NODE_VALUE, []]]
    ],
    [
      element('a', {}, text('a'), text('b')),
      element('a', {}, text('b'), text('c')),
      [[SET_NODE_VALUE, [0]], [SET_NODE_VALUE, [1]]]
    ],
    [
      element('a', {}, element('a'), element('b')),
      element('a', {}, element('b'), element('a')),
      [[MOVE_CHILD, [1]], [MOVE_CHILD, [0]]]
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
      [[MOVE_CHILD, [1]], [MOVE_CHILD, [0]]]
    ]
  ].forEach(function([oldNode, newNode, changeTypes]) {
    it(`diff ${(<any>changeTypes).join('->')} passes`, function() {
      expect(
        JSON.stringify(
          diff(<INode>oldNode, <INode>newNode).map((change) => [change.type, change.nodePath])
        )
      ).to.eql(JSON.stringify(changeTypes));
    });
  });
});