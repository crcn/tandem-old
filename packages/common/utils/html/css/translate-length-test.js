import translateLength from './translate-length';
import expect from 'expect.js';

describe(__filename + '#', function() {
  [
    [10, 'em', '0.625em'],
    [10, 'px', '10px'],
    [10, 'pt', '7.502pt'],
    [10, 'mm', '2.646mm'],
    [10, 'cm', '0.265cm'],
    [10, 'in', '0.104in'],
    [10, '%', '0.104in', function() {
      var div = document.createElement('div');
      div.style.width = '500px';

    }]
  ].forEach(function([pixels, length, equals, createRelativeElement = function() { }]) {
    xit('can convert ' + pixels + ' to ' + length, function() {
      expect(translateLength(pixels, length, createRelativeElement())).to.be(equals);
    });
  });
});
