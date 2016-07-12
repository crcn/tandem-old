import translateStyle from './translate-style';
import expect from 'expect.js';

describe(__filename + '#', function () {

  [
    [500, '4-2', '502-2'],
    [500, '4+2', '498+2'],
    [500, '4/2', '1000/2'],
    [500, '4*2', '250*2'],
    [500, '4*2/2 -2 - 1', '503*2/2 -2 - 1'],
    [500, '4*2 -2/2 - 1', '251*2 -2/2 - 1'],

    [500, '10em/2', '62.5em/2'],
    [500, '10pt/2 - 2cm', '863.601pt/2 - 2cm'],
    [500, '10pt/2 + 10in', '-690.173pt/2 + 10in'],
    // [100, '10mm/2 + 2cm', '12.919mm/2 + 2cm'],
    ['10em', '10pt', '120.03pt'],
    [100, '10%', '20%', createRelativeElement.bind(this, 500, 10)],
    [100, '10%', '33.333%', createRelativeElement.bind(this, 300, 10, 10)],
    [100, '10%', '33.784%', createRelativeElement.bind(this, 300, 10, '2px')],
    [-100, '0px', '-100px'],
    [-10, '10%', '-3.333%', createRelativeElement.bind(this, 300, 10, 10)],
    [5, '-10pt', '3.751pt'],
    [-4, '-2px', '-4px'],
  ].forEach(function ([fromLeft, toLeft, xEquals, createRelativeElement2]) {
    xit('can do a basic, fixed calculation from ' + fromLeft + ' to ' + toLeft, function () {

      var [root, relative] = (createRelativeElement2 || noopElement)();

      // add to the DOM so that stuff can be calculated
      document.body.appendChild(root);

      const translated = translateStyle({ left: fromLeft }, { left: toLeft }, relative).left;

      document.body.removeChild(root);

      // expetation after cleanup, otherwise we'll have some garbage
      // issues
      expect(translated).to.be(xEquals);
    });
  });

  function createRelativeElement(parentWidth = 500, childWidth = 10, parentPadding = 0) {
    const parent = document.createElement('div');
    parent.style.width = parentWidth + 'px';
    parent.style.padding = parentPadding;

    const div = document.createElement('div');
    div.style.width = childWidth + 'px';
    parent.appendChild(div);

    return [parent, div];
  }

  function noopElement() {
    var div = document.createElement('div');
    return [div, div];
  }


});
