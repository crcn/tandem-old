'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('invalid error is an error', function () {
    var error = _index.InvalidError.create('test');
    (0, _expect2.default)(error).to.be.an(_index.InvalidError);
    (0, _expect2.default)(error).to.be.an(_index.BaseError);
    (0, _expect2.default)(error).to.be.an(Error);
    (0, _expect2.default)(error.message).to.be('test');
  });
});