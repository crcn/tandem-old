import { patchTreeNode } from "./patch";
import { expect } from "chai";
import { TreeNode } from "./index";
import { IComparable, IPatchable } from "sf-core/object";

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

abstract class HTMLNode extends TreeNode<HTMLNode> implements IComparable, IPatchable {
  readonly nodeName: string;
  constructor(public target: Node) {
    super();
    this.nodeName = target.nodeName.toLowerCase();
    this.updateFromTarget();
    Array.prototype.forEach.call(target.childNodes, (childNode) => {
      this.appendChild(convertDOMToTreeNode(childNode));
    });
  }
  compare(node: HTMLNode) {
    return Number(this.constructor === node.constructor && this.nodeName === node.nodeName);
  }
  patch(node: HTMLNode) {
    this.target = node.target;
    this.updateFromTarget();
  }

  abstract updateFromTarget();
}

class HTMLTextNode extends HTMLNode {
  public nodeValue: string;
  toString() {
    return this.nodeValue;
  }
  updateFromTarget() {
    this.nodeValue = this.target.nodeValue;
  }
}

class HTMLElement extends HTMLNode {
  public attributes: any;
  updateFromTarget() {
    this.attributes = {};
    for (const key in this.target.attributes) {
      const attr: Attr = this.target.attributes[key];
      if (attr.value) {
        this.attributes[key] = attr.value;
      }
    }
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