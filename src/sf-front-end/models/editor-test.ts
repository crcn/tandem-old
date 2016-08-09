import { Editor, MIN_ZOOM, MAX_ZOOM } from "./editor";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be created", () => {
    new Editor();
  });

  it(`has a min zoom level of ${MIN_ZOOM}%`, () => {
    const editor = new Editor();
    editor.zoom = 0;
    expect(editor.zoom).to.equal(MIN_ZOOM);
  });

  it(`has a max zoom level of ${MAX_ZOOM}%`, () => {
    const editor = new Editor();
    editor.zoom = 3;
    expect(editor.zoom).to.equal(MAX_ZOOM);
  });
});