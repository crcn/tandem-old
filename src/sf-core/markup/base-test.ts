import { expect } from "chai";
import { Action } from "sf-core/actions";
import { ContainerNode, Element, ValueNode } from "./base";

describe(__filename + "#", () => {

  class TestNode extends ContainerNode {
    cloneNode() {
      return new TestNode();
    }
  }

  describe("ContainerNode#", () => {

    it("can be created", () => {
      new TestNode();
    });

    it("can append a child", () => {
      const node = new TestNode();
      node.appendChild(new TestNode());
      expect(node.childNodes.length).to.equal(1);
      expect(node.childNodes[0].parentNode).to.equal(node);
    });

    it("removes a node from a previous parent", () => {
      const p1 = new TestNode();
      const p2 = new TestNode();

      p1.appendChild(new TestNode());
      p2.appendChild(p1.childNodes[0]);
      expect(p1.childNodes.length).to.equal(0);
      expect(p2.childNodes[0].parentNode).to.equal(p2);
    });

    it("can insert a child before the first child", () => {
      const p1 = new TestNode();
      const c1 = new TestNode();
      const c2 = new TestNode();
      p1.appendChild(c1);
      p1.insertBefore(c2, c1);
      expect(p1.childNodes[0]).to.equal(c2);
    });

    it("can insert a child somewhere in the middle", () => {
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

    it("throws an error if inserting before a child that doesnot exist", () => {
      const p1 = new TestNode();
      expect(() => {
        p1.insertBefore(new TestNode(), new TestNode());
      }).to.throw("Cannot insert a child before a node that doesn't exist in the parent.");
    });

    it("can return the first child", () => {
      const p1 = new TestNode();
      let first;
      p1.appendChild(first = new ValueNode("#text", "a"));
      expect(p1.firstChild).to.equal(first);
    });

    it("can return the last child", () => {
      const p1 = new TestNode();
      let last;
      p1.appendChild(last = new ValueNode("#text", "a"));
      expect(p1.lastChild).to.equal(last);
    });

    it("listens for events emitted by child nodes", () => {
      const p1 = new TestNode();
      let lastAction: Action;
      p1.observe({
        execute: (action) => lastAction = action
      });
      const c1 = new TestNode();
      p1.appendChild(c1);
      c1.notify(new Action("a"));
      expect(lastAction.type).to.equal("a");
    });

    it("bubbles events up to the root", () => {
      const p1 = new TestNode();
      let c1;
      p1.appendChild(c1 = new TestNode());
      for (let i = 10; i--; ) {
        c1.appendChild(c1 = new TestNode());
      };

      let lastAction: Action;
      p1.observe({
        execute: (action) => lastAction = action
      });

      c1.notify(new Action("b"));
      expect(lastAction.type).to.equal("b");
    });

    it("stops observing children that have been removed", () => {
      const p1 = new TestNode();
      let lastAction: Action;
      p1.observe({
        execute: (action) => lastAction = action
      });
      const c1 = new TestNode();
      p1.appendChild(c1);
      c1.notify(new Action("a"));
      expect(lastAction.type).to.equal("a");
      p1.removeChild(c1);
      c1.notify(new Action("b"));
      expect(lastAction.type).to.equal("a");
    });
  });

  describe("Node#", () => {
    it("can return the next sibling", () => {
      const el = new Element("div");
      let a, b;
      el.appendChild(a = new ValueNode("#text", "a"));
      el.appendChild(b = new ValueNode("#text", "b"));
      expect(a.nextSibling).to.equal(b);
    });

    it("next sibling is undefined if no parent", () => {
      const a = new Element("div");
      expect(a.nextSibling).to.equal(undefined);
    });

    it("next sibling is undefined if at end", () => {
      const el = new Element("div");
      let a, b;
      el.appendChild(a = new ValueNode("#text", "a"));
      expect(a.nextSibling).to.equal(undefined);
    });

    it("can return the prev sibling", () => {
      const el = new Element("div");
      let a, b;
      el.appendChild(a = new ValueNode("#text", "a"));
      el.appendChild(b = new ValueNode("#text", "b"));
      expect(b.prevSibling).to.equal(a);
    });

    it("prev sibling is undefined if at beginning", () => {
      const el = new Element("div");
      let a, b;
      el.appendChild(a = new ValueNode("#text", "a"));
      expect(a.prevSibling).to.equal(undefined);
    });

    it("prev sibling is undefined if no parent", () => {
      const a = new Element("div");
      expect(a.prevSibling).to.equal(undefined);
    });
  });

  describe("Element#", () => {
    it("can be created", () => {
      expect(new Element("name").nodeName).to.equal("NAME");
    });
    it("can set an attribute value", () => {
      const element = new Element("div");
      element.setAttribute("a", "b");
      expect(element.getAttribute("a")).to.equal("b");
    });

    it("returns TRUE if an attribute exists", () => {
      const element = new Element("div");
      element.setAttribute("a", "b");
      expect(element.hasAttribute("a")).to.equal(true);
    });

    it("returns FALSE if an attribute does not exists", () => {
      const element = new Element("div");
      element.setAttribute("a", "b");
      expect(element.hasAttribute("b")).to.equal(false);
    });
  });

  describe("ValueNode", () => {
    it("can be created", () => {
      new ValueNode("#text", "value");
      expect(new ValueNode("#text", "a").nodeName).to.equal("#text");
    });
  });
});