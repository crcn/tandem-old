import TextEditor from './text-editor';
import NotifierCollection from 'common/notifiers/collection';
import expect from 'expect.js';

describe(__filename + '#', function() {

  var te;

  beforeEach(function() {
    te = TextEditor.create({
      notifier: NotifierCollection.create(),
      source: '123 456  789\n' +
      'abc def\n\n' +
      'g h   i' +
      'j'
    });
  });

  it('ctrl+E moves the caret to the end of the line', function() {
    te.notifier.notify({ type: 'keyCommand', keyCode: 'E'.charCodeAt(0), ctrlKey: true });
    expect(te.marker.position).to.be(12);
  });

  it('ctrl+A moves the caret to the beginning of the current line', function() {
    te.caret.setPosition(15);
    te.notifier.notify({ type: 'keyCommand', keyCode: 'A'.charCodeAt(0), ctrlKey: true });
    expect(te.marker.position).to.be(13);
  });

  it('ctrl+K removes the proceeding characters from the caret position', function() {
    te.caret.setPosition(3);
    te.notifier.notify({ type: 'keyCommand', keyCode: 'K'.charCodeAt(0), ctrlKey: true });
    expect(te.caret._getLine().toString()).to.be('123abc def\n');
  });

  it('can move to the end of the last line', function() {
    var te = te = TextEditor.create({
      notifier: NotifierCollection.create(),
      source: '123\n' +
      '456'
    });

    te.caret.setPosition(4);
    te.notifier.notify({ type: 'keyCommand', keyCode: 'E'.charCodeAt(0), ctrlKey: true });
    expect(te.marker.position).to.be(7);
  });

  // it('can add text anywhere ')
});
