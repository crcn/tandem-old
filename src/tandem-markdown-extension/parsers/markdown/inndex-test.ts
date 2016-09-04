import { expect } from "chai";
import { parseMarkdown } from "./index";

describe(__filename + "#", () => {
  [
    ["a", "<p>a</p>"],
    ["# a", "<h1>a</h1>"],
    ["## a", "<h2>a</h2>"],
    ["### a", "<h3>a</h3>"],
    ["#### a", "<h4>a</h4>"],
    ["##### a", "<h5>a</h5>"],
    ["```\a\n```", "<block>a</block>"],
    ["```\a\nb\n```", "<block>a\nb</block>"],
    ["[label](url)", `<a href="url">label</a>`]
  ].forEach(([input, output]) => {
    it(`translates ${input} to ${output}`, () => {
      const expr = parseMarkdown(input);
      expect(expr.toHTML()).to.equal(output);
    });
  });
});

