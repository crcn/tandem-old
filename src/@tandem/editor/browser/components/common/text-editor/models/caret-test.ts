import Caret from "./caret";
import Marker from "./marker";
import TextEditor from "./text-editor";
import { WrapBus, NoopBus } from "mesh";
import { BrokerBus } from "@tandem/common/busses";
import { expect } from "chai";

describe(__filename + "#", function() {
  if (typeof window === "undefined") return;

  let editor: TextEditor;

  beforeEach(() => {
    editor = new TextEditor(new BrokerBus());
  });

  it("can be created", function() {
    new Caret(editor, new Marker(editor));
  });

  it("can return the cell position", function() {

    editor.source = "abc\n123";

    const c = editor.caret;

    expect(c.getCell()).to.eql({
      row: 0,
      column: 0
    });

    c.setPosition(4);

    expect(c.getCell()).to.eql({
      row: 1,
      column: 0
    });
  });

  it("does not move the position of the cursor if the entered character is a new line and whiteSpace is nowrap", function() {
    editor.style = { whitespace: "nowrap" };
    editor.source = "abc";

    editor.bus.execute(<any>{ type: "input", text: "\n", preventDefault: function() { } });
    expect(editor.marker.position).to.equal(0);
  });
});
