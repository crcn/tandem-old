import expect from 'expect.js';
import Scanner from './scanner';

describe(__filename + '#', function() {
  it('can be created', function() {
    Scanner.create();
  });

  it('can scan for tokens', function() {
    var s = Scanner.create('a bcde 123 4');
    expect(s.scan(/\w+/)).to.be('a');
    expect(s.scan(/\w+/)).to.be('bcde');
    expect(s.scan(/\s+/)).to.be(' ');
    expect(s.scan(/\d{1}/)).to.be('1');
    expect(s.scan(/\s/)).to.be(' ');
    expect(s.scan(/\d/)).to.be('4');
    expect(s.hasTerminated()).to.be(true);
  });
});
