import { SyntheticDocument, SyntheticElement, SyntheticString } from "@tandem/runtime";
import { expect } from "chai";

describe(__filename + "#", () => {

  let doc;

  beforeEach(() => {
    doc = new SyntheticDocument(null);
  });

  it("can be created", () => {
    const element = new SyntheticElement(new SyntheticString("div"), doc);
  });

  it("can set the innerHTML", () => {
    const element = new SyntheticElement(new SyntheticString("div"), doc);
    element.innerHTML = new SyntheticString("<span>hello</span>");
    expect(element.childNodes.value.length).to.equal(1);
  });
});