import { Element, TextNode } from "./base";
import { default as diff, ValueNodeChange } from "./diff";
import { expect } from "chai";

describe(__filename + "#", function() {
  it("can add a TextNode value change", function() {
    const changes = diff(new TextNode("a"), new TextNode("b"));
    expect(changes.length).to.equal(1);
    expect((<ValueNodeChange>changes[0]).nodeValue).to.equal("b");
  });
});