'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _string = require('./string');

var _string2 = _interopRequireDefault(_string);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {

  var tok = _string2.default.create();

  it('can tokenize a simple string', function () {
    (0, _expect2.default)(tok.tokenize('abc  d e\n\r\t')).to.eql([{ type: 'text', value: 'abc', length: 3 }, { type: 'space', value: '  ', length: 2 }, { type: 'text', value: 'd', length: 1 }, { type: 'space', value: ' ', length: 1 }, { type: 'text', value: 'e', length: 1 }, { type: 'newLine', value: '\n', length: 1 }, { type: 'newLine', value: '\r', length: 1 }, { type: 'tab', value: '\t', length: 1 }]);
  });
});