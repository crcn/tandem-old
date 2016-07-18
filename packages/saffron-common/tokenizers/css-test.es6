'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {

  [['100px', [['100', 'number'], ['px', 'unit']]], ['.5em', [['.5', 'number'], ['em', 'unit']]], ['0.5vmin', [['0.5', 'number'], ['vmin', 'unit']]], ['calc(  100%)', [['calc', 'reference'], ['(', 'leftParen'], ['  ', 'space'], ['100', 'number'], ['%', 'unit'], [')', 'rightParen']]], ['10px - 5px', [['10', 'number'], ['px', 'unit'], [' ', 'space'], ['-', 'operator'], [' ', 'space'], ['5', 'number'], ['px', 'unit']]], ['calc(100%/6)', [['calc', 'reference'], ['(', 'leftParen'], ['100', 'number'], ['%', 'unit'], ['/', 'operator'], ['6', 'number'], [')', 'rightParen']]], ['10em/-10', [['10', 'number'], ['em', 'unit'], ['/', 'operator'], ['-', 'operator'], ['10', 'number']]], ['2-2', [['2', 'number'], ['-', 'operator'], ['2', 'number']]], ['10deg', [['10', 'degree']]], ['linear-gradient(to top, blue 50%, red)', [['linear-gradient', 'reference'], ['(', 'leftParen'], ['to', 'reference'], [' ', 'space'], ['top', 'reference'], [',', 'comma'], [' ', 'space'], ['blue', 'reference'], [' ', 'space'], ['50', 'number'], ['%', 'unit'], [',', 'comma'], [' ', 'space'], ['red', 'reference'], [')', 'rightParen']]]].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var source = _ref2[0];
    var matches = _ref2[1];

    it('can tokenize ' + source, function () {
      var tokens = _css2.default.tokenize(source).map(function (token) {
        return [token.value, token.type];
      });

      (0, _expect2.default)(tokens).to.eql(matches);
    });
  });
});