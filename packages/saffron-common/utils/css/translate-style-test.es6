'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _translateStyle = require('./translate-style');

var _translateStyle2 = _interopRequireDefault(_translateStyle);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {

  [[500, '4-2', '502-2'], [500, '4+2', '498+2'], [500, '4/2', '1000/2'], [500, '4*2', '250*2'], [500, '4*2/2 -2 - 1', '503*2/2 -2 - 1'], [500, '4*2 -2/2 - 1', '251*2 -2/2 - 1'], [500, '10em/2', '62.5em/2'], [500, '10pt/2 - 2cm', '863.601pt/2 - 2cm'], [500, '10pt/2 + 10in', '-690.173pt/2 + 10in'],
  // [100, '10mm/2 + 2cm', '12.919mm/2 + 2cm'],
  ['10em', '10pt', '120.03pt'], [100, '10%', '20%', createRelativeElement.bind(this, 500, 10)], [100, '10%', '33.333%', createRelativeElement.bind(this, 300, 10, 10)], [100, '10%', '33.784%', createRelativeElement.bind(this, 300, 10, '2px')], [-100, '0px', '-100px'], [-10, '10%', '-3.333%', createRelativeElement.bind(this, 300, 10, 10)], [5, '-10pt', '3.751pt'], [-4, '-2px', '-4px']].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 4);

    var fromLeft = _ref2[0];
    var toLeft = _ref2[1];
    var xEquals = _ref2[2];
    var createRelativeElement2 = _ref2[3];

    xit('can do a basic, fixed calculation from ' + fromLeft + ' to ' + toLeft, function () {
      var _ref3 = (createRelativeElement2 || noopElement)();

      var _ref4 = _slicedToArray(_ref3, 2);

      var root = _ref4[0];
      var relative = _ref4[1];

      // add to the DOM so that stuff can be calculated

      document.body.appendChild(root);

      var translated = (0, _translateStyle2.default)({ left: fromLeft }, { left: toLeft }, relative).left;

      document.body.removeChild(root);

      // expetation after cleanup, otherwise we'll have some garbage
      // issues
      (0, _expect2.default)(translated).to.be(xEquals);
    });
  });

  function createRelativeElement() {
    var parentWidth = arguments.length <= 0 || arguments[0] === undefined ? 500 : arguments[0];
    var childWidth = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
    var parentPadding = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    var parent = document.createElement('div');
    parent.style.width = parentWidth + 'px';
    parent.style.padding = parentPadding;

    var div = document.createElement('div');
    div.style.width = childWidth + 'px';
    parent.appendChild(div);

    return [parent, div];
  }

  function noopElement() {
    var div = document.createElement('div');
    return [div, div];
  }
});