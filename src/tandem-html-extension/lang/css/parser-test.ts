import { expect } from "chai";
import { parseCSS } from "./index";
import {
  CSSRootExpression,
  CSSRuleExpression,
} from "./ast";

describe(__filename + "#", () => {
  [
    `.a {color: green;}`,
    `.b {color: blue;background: red;}`,
    `.a > .b {color: blue;background: red;}`,
    `@keyframes ab {from: {color: red;} to: {color: blue;}}`,
    `@keyframes ab {0%: {color: red;} 100%: {color: blue;}}`,
    `@media screen and (min-width: 480px) {body {color: red;}}`,
  ].forEach((source) => {
    it(`can parse ${source}`, () => {
      expect(parseCSS(source).toString()).to.equal(source);
    });
  });
});