import { BaseNode } from "./base";
import { expect } from "chai";

describe(__filename + "#", () => {

  class TestNode extends BaseNode<TestNode> { }

  it("can be created", function() {
    new TestNode();
  });

  it("can append a child", function() {
    const node = new TestNode();
    node.appendChild(new TestNode());
    expect(node.childNodes.length).to.equal(1);
    expect(node.childNodes[0].parentNode).to.equal(node);
  });

  it("removes a node from a previous parent", function() {
    const p1 = new TestNode();
    const p2 = new TestNode();

    p1.appendChild(new TestNode());
    p2.appendChild(p1.childNodes[0]);
    expect(p1.childNodes.length).to.equal(0);
    expect(p2.childNodes[0].parentNode).to.equal(p2);
  });

  it("can insert a child before the first child", function() {
    const p1 = new TestNode();
    const c1 = new TestNode();
    const c2 = new TestNode();
    p1.appendChild(c1);
    p1.insertBefore(c2, c1);
    expect(p1.childNodes[0]).to.equal(c2);
  });

  it("can insert a child somewhere in the middle", function() {
    const p1 = new TestNode();
    const c1 = new TestNode();
    const c2 = new TestNode();
    const c3 = new TestNode();
    p1.appendChild(c1);
    p1.appendChild(c2);
    p1.insertBefore(c3, c2);
    expect(p1.childNodes[0]).to.equal(c1);
    expect(p1.childNodes[1]).to.equal(c3);
    expect(p1.childNodes[2]).to.equal(c2);
  });

  it("throws an error if inserting before a child that doesnot exist", function() {
    const p1 = new TestNode();
    expect(() => {
      p1.insertBefore(new TestNode(), new TestNode());
    }).to.throw("Cannot insert a child before a node that doesn't exist in the parent.");
  });
});