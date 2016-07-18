'use strict';

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('can be created', function () {
    _collection2.default.create();
  });
});