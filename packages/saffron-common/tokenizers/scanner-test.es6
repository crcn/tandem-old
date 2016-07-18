'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _scanner = require('./scanner');

var _scanner2 = _interopRequireDefault(_scanner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('can be created', function () {
    _scanner2.default.create();
  });

  it('can scan for tokens', function () {
    var s = _scanner2.default.create('a bcde 123 4');
    (0, _expect2.default)(s.scan(/\w+/)).to.be('a');
    (0, _expect2.default)(s.scan(/\w+/)).to.be('bcde');
    (0, _expect2.default)(s.scan(/\s+/)).to.be(' ');
    (0, _expect2.default)(s.scan(/\d{1}/)).to.be('1');
    (0, _expect2.default)(s.scan(/\s/)).to.be(' ');
    (0, _expect2.default)(s.scan(/\d/)).to.be('4');
    (0, _expect2.default)(s.hasTerminated()).to.be(true);
  });
});