import { findNode, getNodePath } from "./utils";
import { expect } from "chai";
import { Element } from "./base";

describe(__filename + "#", function() {
  it("can find the node path of a root element", function() {
    const element = new Element("div");
    expect(getNodePath(element).length).to.equal(0);
  });

  it("can find the path to a nested element", function() {
    let currentChild = new Element("div");
    currentChild.appendChild(new Element("div"));
    currentChild.appendChild(currentChild = new Element("span"));
    currentChild.appendChild(currentChild = new Element("div"));
    currentChild.appendChild(currentChild = new Element("div"));
    expect(getNodePath(currentChild)).to.eql([1, 0, 0]);
  });

  it("can find a node based on the nested path", function() {
    let root = new Element("div");
    let currentChild = root;
    currentChild.appendChild(new Element("div"));
    currentChild.appendChild(currentChild = new Element("span"));
    currentChild.appendChild(currentChild = new Element("div"));
    currentChild.appendChild(currentChild = new Element("div"));
    expect(findNode<any>(getNodePath(currentChild), root)).to.eql(currentChild);
  });
});