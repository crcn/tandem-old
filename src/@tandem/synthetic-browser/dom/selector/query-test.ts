import { expect } from "chai";
export { querySelectorAll } from "./query";
import {
  parseMarkup,
  evaluateMarkup,
  querySelectorAll,
  SyntheticDocument
} from "@tandem/synthetic-browser";

describe(__filename + "#", () => {
  [
    [".item", `<div class="div">a</div>b<span>c</span><div class="item">d</div>`, `<div class="item">d</div>`],
    ["#item", `<div id="item">a</div>b<span>c</span>`, `<div id="item">a</div>`],
    ["*", "<div>a</div>b<span>c</span>", "<div>a</div><span>c</span>"],
    ["div", "<div>a</div>b<span>c</span><div>d</div>", "<div>a</div><div>d</div>"],
    ["h1, h2", "<h1>a</h1><h2>b</h2><h3>c</h3>", "<h1>a</h1><h2>b</h2>"],
    ["h1 b", "<h1><span><b>a</b></span></h1><h1><strong>b</strong></h1>", "<b>a</b>"],
    ["h1 > span", "<h1><span>a</span></h1><h1><strong><span>b</span></strong></h1>", "<span>a</span>"],
    ["div + span", "<div>a</div><span>b</span>", "<span>b</span>"],
    ["div ~ span", "<div>a</div><strong>b</strong><span>c</span>", "<span>c</span>"],
    ["[data-test]", "<div data-test>a</div><span>c</span>", `<div data-test="">a</div>`],
    ["[data-test=1]", `<div data-test="1">a</div><span>c</span>`, "<div data-test=\"1\">a</div>"],
    ["[data-test~=b]", `<div data-test="abc">a</div><span data-test="ac">c</span>`, `<div data-test="abc">a</div>`],
    ["[data-test|=b]", `<div data-test="ab">a</div><span data-test="bc">c</span>`, `<span data-test="bc">c</span>`],
    ["[data-test^=b]", `<div data-test="ab">a</div><span data-test="bc">c</span>`, `<span data-test="bc">c</span>`],
    ["[data-test$=b]", `<div data-test="ab">a</div><span data-test="bc">c</span>`, `<div data-test="ab">a</div>`],
    ["[data-test*=b]", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div><span data-test="bc">c</span>`],
    [`[data-test*=b][class="test"]`, `<div data-test="abc" class="test">a</div><span data-test="bc">c</span>`, `<div data-test="abc" class="test">a</div>`],
    ["div[data-test*=b]", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div>`],
    ["*[data-test]", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div><span data-test="bc">c</span>`],
    ["div:active", `<div data-test="abc">a</div><span data-test="bc">c</span>`, ``],
    ["audio:not([controls])", `<audio></audio><audio controls></audio>`, `<audio></audio>`],
    ["div::before", `<div data-test="abc">a</div><span data-test="bc">c</span>`, ``],
    ["[data-test]::before", `<div data-test="abc">a</div><span data-test="bc">c</span>`, ``],
    ["svg:not(:root)", `<div data-test="abc">a</div><span data-test="bc">c</span>`, ``],
    ["a:not([href]):not([tabindex])", `<div data-test="abc">a</div><span data-test="bc">c</span>`, ``],
  ].forEach(([selector, a, b]) => {
    it(`selector ${selector} for ${a} equals ${b}`, () => {
      const el = evaluateMarkup(parseMarkup(a), new SyntheticDocument(""));
      const nodes = querySelectorAll(el, selector);
      expect(nodes.join("")).to.equal(b);
    });
  });
});