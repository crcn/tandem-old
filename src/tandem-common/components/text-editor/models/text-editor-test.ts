import { expect } from "chai";
import TextEditor from "./text-editor";
import { BrokerBus } from "tandem-common/busses";


describe(__filename + "#", function() {
  it("can be created", function() {
    new TextEditor(new BrokerBus());
  });

  it("doesn\"t have a limit to the max columns initially", function() {
    expect(new TextEditor(new BrokerBus()).maxColumns).to.equal(Infinity);
  });

  it("breaks lines based on newline characters", function() {

    const te = new TextEditor(new BrokerBus());
    te.source = "abc\n123";

    expect(te.lines.length).to.equal(2);
    expect(te.lines[0].length).to.equal(4);
    expect(te.lines[1].length).to.equal(3);
  });

  it("calculates the cell position based on the buffer position", function() {

    const te = new TextEditor(new BrokerBus());
    te.source = "abc\n123 456\n\n8910 11  12";

    expect(te.getCellFromPosition(0)).to.eql({ row: 0, column: 0 }); expect(te.getCellFromPosition(3)).to.eql({ row: 0, column: 3 }); expect(te.getCellFromPosition(4)).to.eql({ row: 1, column: 0 }); expect(te.getCellFromPosition(11)).to.eql({ row: 1, column: 7 }); expect(te.getCellFromPosition(12)).to.eql({ row: 2, column: 0 }); expect(te.getCellFromPosition(Infinity)).to.eql({ row: 3, column: 11 });
  });

  it("removes new line characters if white space is nowrap", function() {

    const tw = new TextEditor(new BrokerBus());
    tw.source = "abc\n123";
    tw.style = { whitespace: "nowrap" };

    expect(tw.lines.length).to.equal(1);
  });
});
