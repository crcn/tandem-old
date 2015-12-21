import Caret from './caret';
import TextEditor from './text-editor';
import expect from 'expect.js';
import NotifierCollection from 'common/notifiers/collection';

describe(__filename + '#', function() {

  it('can be created', function() {
    Caret.create({
      editor: TextEditor.create({
        notifier: NotifierCollection.create()
      })
    });
  });

  it('has an initial position of 0', function() {
    var c = Caret.create({

    });
    expect(c.position).to.be(0);
  });

  it('can return the cell position', function() {
    var c = Caret.create({
      notifier: { notify: function() { }},
      editor: TextEditor.create({
        source: 'abc\n123',
        notifier: NotifierCollection.create()
      })
    });

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

  it('does not move the position of the cursor if the entered character is a new line and whiteSpace is nowrap', function() {
    var te = TextEditor.create({
      notifier: NotifierCollection.create(),
      source: 'abc',
      style: { whiteSpace: 'nowrap' }
    });

    te.notifier.notify({ type: 'input', text: '\n' });
    expect(te.caret.position).to.be(0);
  });
});
