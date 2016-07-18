'use strict';

var _get = require('./get');

var _get2 = _interopRequireDefault(_get);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('can get a property on an object', function () {
    var target = { a: 1 };
    (0, _expect2.default)((0, _get2.default)(target, 'a')).to.be(1);
  });

  it('can get a nested property on an object', function () {
    var target = { a: { b: 2 } };
    (0, _expect2.default)((0, _get2.default)(target, 'a.b')).to.be(2);
  });

  it('returns undefined if a property does not exist', function () {
    var target = { a: 1, b: { c: void 0 } };

    (0, _expect2.default)((0, _get2.default)(target, 'a.b.c')).to.be(void 0);
    (0, _expect2.default)((0, _get2.default)(target, 'b.c.d')).to.be(void 0);
  });

  it('can return a value from a [[parent]] object', function () {
    var target = { '[[parent]]': { a: 1 } };

    (0, _expect2.default)((0, _get2.default)(target, 'a')).to.be(1);
  });

  it('does not inherit a property if one is defined ', function () {
    var target = { '[[parent]]': { a: 1 }, a: void 0 };

    (0, _expect2.default)((0, _get2.default)(target, 'a')).to.be(void 0);
  });
});