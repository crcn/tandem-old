'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('can be created', function () {
    _index2.default.create();
  });

  it('can push something to update', function () {
    var rl = _index2.default.create();
    var i = 0;
    rl.deferOnce({
      update: function update() {
        i++;
      }
    });
    (0, _expect2.default)(i).to.be(0);
    rl.runNow();
    (0, _expect2.default)(i).to.be(1);
  });
});