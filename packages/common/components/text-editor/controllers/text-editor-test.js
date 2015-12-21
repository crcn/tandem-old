import expect from 'expect.js';
import TextEditor from './text-editor';
import NotifierCollection from 'common/notifiers/collection';

describe(__filename + '#', function() {
  it('can be created', function() {
    TextEditor.create({
      notifier: NotifierCollection.create()
    });
  });

  it('doesn\'t have a limit to the max columns initially', function() {
    expect(TextEditor.create({
      notifier: NotifierCollection.create()
    }).maxColumns).to.be(Infinity);
  });

  it('breaks lines based on newline characters', function() {

    var te = TextEditor.create({
      source: 'abc\n123',
      notifier: NotifierCollection.create()
    });

    expect(te.lines.length).to.be(2);
    expect(te.lines[0].length).to.be(4);
    expect(te.lines[1].length).to.be(3);
  });

  it('calculates the cell position based on the buffer position', function() {

    var te = TextEditor.create({
      source: 'abc\n123 456\n\n8910 11  12',
      notifier: NotifierCollection.create()
    });

    expect(te.getCellFromPosition(0)).to.eql({ row: 0, column: 0 }); expect(te.getCellFromPosition(3)).to.eql({ row: 0, column: 3 }); expect(te.getCellFromPosition(4)).to.eql({ row: 1, column: 0 }); expect(te.getCellFromPosition(11)).to.eql({ row: 1, column: 7 }); expect(te.getCellFromPosition(12)).to.eql({ row: 2, column: 0 }); expect(te.getCellFromPosition(Infinity)).to.eql({ row: 3, column: 11 });
  });
});
