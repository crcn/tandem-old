import expect from 'expect.js';
import Scanner from './scanner';

describe(__filename + '#', function() {

  it('can be created', function() {
    expect(Scanner.create()).to.be.an(Scanner);
  });

  it('can scan for various tokens', function() {
    var s = Scanner.create('a bcde efg');
    expect(s.scan(/\w+/)).to.be('a');
    expect(s.scan(/\w+/)).to.be('bcde');
    expect(s.scan(/\s\w/)).to.be(' e');
    expect(s.scan(/\w/)).to.be('f');
    expect(s.scan(/\w/)).to.be('g');
    expect(s.scan(/\w/)).to.be(void 0);
  });

  it('returns has terminated when there are no more characters to scan', function() {
    var s = Scanner.create('a bcde ');
    expect(s.scan(/.*/)).to.be('a bcde ');
    expect(s.hasTerminated()).to.be(true);
  });

  xit('can rewind the previously scanned item', function() {
    var s = Scanner.create('a bcd 123');
    s.scan(/\w+/)
  });
});
