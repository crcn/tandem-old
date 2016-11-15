import TextEditor from "./text-editor";
import  { expect } from "chai";
import { BrokerBus } from "@tandem/common/dispatchers";

describe(__filename + "#", function() {

  if (typeof window === "undefined") return;

  let te;

  beforeEach(function() {
    te = new TextEditor(new BrokerBus());
    te.source = "123 456  789\n" +
    "abc def\n\n" +
    "g h   i" +
    "j";
  });

  xit("ctrl+E moves the caret to the end of the line", function() {
    te.notifier.notify({ type: "keyCommand", keyCode: "E".charCodeAt(0), ctrlKey: true });
    expect(te.marker.position).to.equal(12);
  });

  xit("ctrl+A moves the caret to the beginning of the current line", function() {
    te.caret.setPosition(15);
    te.notifier.notify({ type: "keyCommand", keyCode: "A".charCodeAt(0), ctrlKey: true });
    expect(te.marker.position).to.equal(13);
  });

  xit("ctrl+K removes the proceeding characters from the caret position", function() {
    te.caret.setPosition(3);
    te.notifier.notify({ type: "keyCommand", keyCode: "K".charCodeAt(0), ctrlKey: true });
    expect(te.caret._getLine().toString()).to.equal("123abc def\n");
  });

  xit("can move to the end of the last line", function() {
    const te = new TextEditor(new BrokerBus());
    te.source = "123\n456";

    te.caret.setPosition(4);
    te.bus.dispatch(<any>{ type: "keyCommand", keyCode: "E".charCodeAt(0), ctrlKey: true });
    expect(te.marker.position).to.equal(7);
  });

  // it("can add text anywhere ")
});
