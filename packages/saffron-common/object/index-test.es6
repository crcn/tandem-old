'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('can be created', function () {
    var ref = _index2.default.create();
    (0, _expect2.default)(ref).to.be.an(_index2.default);
  });

  it('can be created with initial properties', function () {
    var ref = _index2.default.create({ a: 'b', c: 'd' });
    (0, _expect2.default)(ref.a).to.be('b');
    (0, _expect2.default)(ref.c).to.be('d');
  });
});