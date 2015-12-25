import TextRuler from './text-ruler';
import expect from 'expect.js';
import encode from './encode';

describe(__filename + '#', function() {

  it('can be created', function() {
    TextRuler.create({});
  });

  [
    ['abc'],
    ['M437•'],
    ['\s\tabc']
  ].forEach(function([text, width]) {
    it('can calculate the size of ' + text, function() {
      var style = { fontSize: '14px' };

      var tr = TextRuler.create({
        style: style
      });

      var span = document.createElement('span');
      Object.assign(span.style, style);
      span.innerHTML = encode(text);
      document.body.appendChild(span);
      expect(tr.calculateSize(text)[0]).to.be(span.offsetWidth);
      document.body.removeChild(span);
    });
  });

  [
    ['abc', Infinity, 3],
    ['abc', 3, 0],
    ['abc', 4, 1],
    ['abc', 14, 2],
    ['a\t\s12', 7, 1]
  ].forEach(function([text, point, position]) {
    it('converts ' + point + ' point in ' + text + ' to ' + position + ' position', function() {
      var tr = TextRuler.create({});
      expect(tr.convertPointToCharacterPosition(text, point)).to.be(position);
    });
  })


});
