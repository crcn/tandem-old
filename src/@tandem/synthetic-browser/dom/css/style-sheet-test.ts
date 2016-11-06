import { expect } from "chai";
import { SyntheticCSSStyleSheet, SyntheticCSSStyleRule } from "@tandem/synthetic-browser";

describe(__filename + "#", () => {
  it("can be created", () => {
    new SyntheticCSSStyleSheet([]);
  });

  it("properly parses !important flags", () => {
    const styleSheet = new SyntheticCSSStyleSheet([]);
    styleSheet.cssText = `
      .a {
        color: red !important;
      }
    `;

    expect((styleSheet.rules[0] as SyntheticCSSStyleRule).style["color"]).to.equal("red !important");
  });
});