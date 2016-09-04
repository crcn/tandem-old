import { parseHTML } from "./index";
import { expect } from "chai";

describe(__filename + "#", () => {
  [
    `    <div />`,
    `
    <div />
    `,
    `
      <div />
      <div />
    `,
    `
      <div>
        <div />
      </div>
    `,
    `
      <span>a</span>
    `,
    `
      <span>  hello </span>
    `,
    `
      <div class="item">
  <div>a</div>
</div>
    `
  ].forEach((source) => {
    it(`preserves the whitespace for ${source.replace(/\n/g, "\\n")}`, () => {
      expect(parseHTML(source).toString()).to.equal(source);
    });
  });

  xit("adds a new line when copying the first node", () => {
    const source = `<div>\n  a\n</div>`;
    const ast = parseHTML(source);
    const div = ast.childNodes[0];
    ast.appendChild(div.clone());
    expect(ast.toString()).to.equal(source + `\n` + source);
  });
});

