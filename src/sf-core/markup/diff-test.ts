import { Element, TextNode, CommentNode } from "./base";
import { default as diff, ValueNodeChange } from "./diff";
import { expect } from "chai";

describe(__filename + "#", function() {

  xit("can add a TextNode value change", async function() {
    const textNode = await diff(new TextNode("a"), new TextNode("b"));
  });

  xit("can add a CommentNode value change", async function() {
    const changes = await diff(new CommentNode("a"), new CommentNode("b"));
  });

});