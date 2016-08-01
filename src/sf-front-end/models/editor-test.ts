import { Editor } from "./editor";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be created", () => {
    new Editor();
  });

  it("has a min zoom level of 20%", () => {
    const editor = new Editor();
    editor.zoom = 0;
    expect(editor.zoom).to.equal(0.2);
  });

  it("has a max zoom level of 200%", () => {
    const editor = new Editor();
    editor.zoom = 3;
    expect(editor.zoom).to.equal(2);
  });
});