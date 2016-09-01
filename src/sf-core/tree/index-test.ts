import { expect } from "chai";
import { TreeNode } from "./index";

describe(__filename + "#", () => {
  it("can create a new node", () => {
    new TreeNode();
  });

  it("can add a new child", () => {
    const node = new TreeNode();
    node.children.push(new TreeNode());
    expect(node.children.length).to.equal(1);
  });

  it("can remove a child", () => {
    const node = new TreeNode();
    node.children.push(new TreeNode());
    expect(node.children.length).to.equal(1);
    node.children.remove(node.children[0]);
    expect(node.children.length).to.equal(0);
  });

  it("returns the parent node", () => {
    const parent = new TreeNode();
    const child  = new TreeNode();
    parent.children.push(child);
    expect(child.parent).to.equal(parent);
  });

  it("removes a child from an existing parent when moving to another", () => {

    const parent = new TreeNode();
    const parent2  = new TreeNode();
    const child  = new TreeNode();
    parent.children.push(child);
    expect(parent.children.length).to.equal(1);
    parent2.children.push(child);
    expect(child.parent).to.equal(parent2);
    expect(parent.children.length).to.equal(0);
  });

  it("can return the ancestors of a child", () => {

    const p1 = new TreeNode();
    const p2 = new TreeNode();
    const p3 = new TreeNode();

    p1.children.push(p2);
    p2.children.push(p3);
    const ancenstors = p3.ancestors;
    expect(ancenstors.length).to.equal(2);
    expect(ancenstors[0]).to.equal(p2);
    expect(ancenstors[1]).to.equal(p1);
  });

  it("can return the root", () => {

    const p1 = new TreeNode();
    const p2 = new TreeNode();
    const p3 = new TreeNode();

    p1.children.push(p2);
    p2.children.push(p3);
    expect(p3.root).to.equal(p1);
  });

  it("can return the depth", () => {

    const p1 = new TreeNode();
    const p2 = new TreeNode();
    const p3 = new TreeNode();

    p1.children.push(p2);
    p2.children.push(p3);
    expect(p3.depth).to.equal(2);
  });

  it("can return the height", () => {

    const p1 = new TreeNode();
    const p2 = new TreeNode();
    const p3 = new TreeNode();

    p1.children.push(p2);
    p2.children.push(p3);
    expect(p1.height).to.equal(2);
  });

  it("can return the next sibling", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.children.push(c1, c2);
    expect(c1.nextSibling).to.equal(c2);
  });

  it("can return the previous sibling", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.children.push(c1, c2);
    expect(c2.previousSibling).to.equal(c1);
  });

  it("can return the first child", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.children.push(c1, c2);
    expect(p1.children.first).to.equal(c1);
  });

  it("can return the last child", () => {

    const p1 = new TreeNode();
    const c1 = new TreeNode();
    const c2 = new TreeNode();

    p1.children.push(c1, c2);
    expect(p1.children.last).to.equal(c2);
  });
});