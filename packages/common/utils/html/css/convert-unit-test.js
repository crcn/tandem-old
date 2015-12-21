import expect from 'expect.js';
import convertUnit from './convert-unit';

describe(__filename + '#', function() {
  [
    ['10px', 'pt', '7.502pt'],
    ['10cm', 'mm', '100.013mm']
  ].forEach(function([value, unit, equals]) {
    it('can convert ' + value + ' to ' + unit, function() {
      expect(convertUnit(value, unit)).to.be(equals);
    });
  });
});
