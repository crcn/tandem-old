import { expect } from "chai";
import { TreeNode } from "./index";
import { patchable, patchTreeNode } from "@tandem/common";
import { IComparable, IPatchable } from "@tandem/common/object";

describe(__filename + "#", () => {
  [
    [`<div>a</div>`, `<div>b</div>`],
    [`<div>a</div>`, `<h1>b</h1>`],
    [`<div><h1>1</h1><h2>2</h2><h3>3</h3></div>`, `<div><h3>1</h3><h2>2</h2><h1>3</h1></div>`],
    [`<div><h1>1</h1><h2>2</h2><h3>3</h3></div>`, `<div><h3>1</h3><h2>2</h2><h3>3</h3></div>`],
  ].forEach(([oldSource, newSource]) => {
    it(`can patch ${oldSource} to ${newSource}`, () => {
      const a = parseDOMNode(oldSource);
      const b = parseDOMNode(newSource);
      patchTreeNode(a, b);
      expect(a.children[0].toString()).to.equal(newSource);
    });
  });
});

abstract class HTMLNode extends TreeNode<HTMLNode> implements IComparable {
  readonly nodeName: string;
  @patchable
  public target: Node;
  constructor(target: Node) {
    super();
    this.target = target;
    this.nodeName = target.nodeName.toLowerCase();
    Array.prototype.forEach.call(target.childNodes, (childNode) => {
      this.appendChild(convertDOMToTreeNode(childNode));
    });
  }
  compare(node: HTMLNode) {
    return Number(this.constructor === node.constructor && this.nodeName === node.nodeName);
  }
}

class HTMLTextNode extends HTMLNode {
  toString() {
    return this.nodeValue;
  }
  get nodeValue() {
    return this.target.nodeValue;
  }
}

class HTMLElement extends HTMLNode {
  get attributes() {
    const attributes = {};
    for (const key in this.target.attributes) {
      const attr: Attr = this.target.attributes[key];
      if (attr.value) {
        attributes[key] = attr.value;
      }
    }
    return attributes;
  }
  toString() {
    const buffer = ["<", this.nodeName];
    for (const key in this.attributes) {
      buffer.push(" ", key, "=", "\"", this.attributes[key], "\"");
    }
    buffer.push(">", this.children.join(""), "</", this.nodeName, ">");
    return buffer.join("");
  }
}

const convertDOMToTreeNode = (node: Node): HTMLNode => {
  switch (node.nodeType) {
    case 1: return new HTMLElement(<Element>node);
    case 3: return new HTMLTextNode(<Text>node);
  }
  return null;
};

const parseDOMNode = (source: string): HTMLNode => {
  const div = document.createElement("div");
  div.innerHTML = source;
  return convertDOMToTreeNode(div);
};