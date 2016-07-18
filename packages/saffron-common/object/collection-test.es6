'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('can be created', function () {
    var ref = _collection2.default.create();
    (0, _expect2.default)(ref).to.be.an(_collection2.default);
    (0, _expect2.default)(ref).to.be.an(Array);
  });

  it('can be created with initial array data', function () {
    var ref = _collection2.default.create([1, 2, 3, 4]);
    (0, _expect2.default)(ref.length).to.be(4);
    (0, _expect2.default)(ref[0]).to.be(1);
    (0, _expect2.default)(ref[2]).to.be(3);
  });

  it('can be created with properties', function () {
    var ref = _collection2.default.create({ a: 1, b: 2 });
    (0, _expect2.default)(ref.a).to.be(1);
    (0, _expect2.default)(ref.b).to.be(2);
  });

  it('can push() items onto the array', function () {
    var ref = _collection2.default.create();
    ref.push(1, 2);
    (0, _expect2.default)(ref[0]).to.be(1);
    (0, _expect2.default)(ref.length).to.be(2);
  });

  it('can unshift() items onto the array', function () {
    var ref = _collection2.default.create([1, 2]);
    ref.unshift(3, 4);
    (0, _expect2.default)(ref[0]).to.be(3);
    (0, _expect2.default)(ref.length).to.be(4);
  });

  it('can pop() the collection', function () {
    var ref = _collection2.default.create([1, 2]);
    (0, _expect2.default)(ref.pop()).to.be(2);
    (0, _expect2.default)(ref.length).to.be(1);
  });

  it('can shift() the collection', function () {
    var ref = _collection2.default.create([1, 2]);
    (0, _expect2.default)(ref.shift()).to.be(1);
    (0, _expect2.default)(ref.length).to.be(1);
  });
});