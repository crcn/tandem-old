'use strict';

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename + '#', function () {
  it('can parse functions', function () {
    var ast = _css2.default.parse('linear-gradient(0deg, blue, red)');
    (0, _expect2.default)(ast.type).to.be('call');
    (0, _expect2.default)(ast.name).to.be('linear-gradient');
    (0, _expect2.default)(ast.params[0].type).to.be('degree');
    (0, _expect2.default)(ast.params[0].value).to.be('0');
    (0, _expect2.default)(ast.params[2].path[0]).to.be('red');
  });

  it('can parse functions in functions', function () {
    var ast = _css2.default.parse('linear-gradient(0deg, rgba(0,0,0,0.1), blue)');
    (0, _expect2.default)(ast.type).to.be('call');
    (0, _expect2.default)(ast.name).to.be('linear-gradient');
    (0, _expect2.default)(ast.params.length).to.be(3);
    (0, _expect2.default)(ast.params[1].type).to.be('call');
    (0, _expect2.default)(ast.params[2].type).to.be('reference');
    (0, _expect2.default)(ast.params[2].path[0]).to.be('blue');
  });

  it('can parse lists', function () {
    var ast = _css2.default.parse('a, b, c');
    (0, _expect2.default)(ast.length).to.be(3);
    (0, _expect2.default)(ast[0].path[0]).to.be('a');
    (0, _expect2.default)(ast[1].path[0]).to.be('b');
    (0, _expect2.default)(ast[2].path[0]).to.be('c');
  });

  it('can parse a list of spaces', function () {
    var ast = _css2.default.parse('a  b c');
    (0, _expect2.default)(ast.length).to.be(3);
    (0, _expect2.default)(ast[0].path[0]).to.be('a');
    (0, _expect2.default)(ast[1].path[0]).to.be('b');
    (0, _expect2.default)(ast[2].path[0]).to.be('c');
  });

  it('can parse a function call with spaced params', function () {
    var ast = _css2.default.parse('linear-gradient(top left right, blue, red)');

    (0, _expect2.default)(ast.params.length).to.be(3);
    (0, _expect2.default)(ast.params[0].length).to.be(3);
    (0, _expect2.default)(ast.params[0][0].type).to.be('reference');
  });

  it('can parse a list of functions', function () {
    var ast = _css2.default.parse('linear-gradient(top right, blue, red), linear-gradient(10deg, blue 50%, rgb(0,0,0,0.1))');

    (0, _expect2.default)(ast.length).to.be(2);
    (0, _expect2.default)(ast[1].name).to.be('linear-gradient');
    (0, _expect2.default)(ast[1].params.length).to.be(3);
    (0, _expect2.default)(ast[1].params[2].params.length).to.be(4);
  });

  it('can parse colors', function () {
    var ast = _css2.default.parse('#FF6600');
    (0, _expect2.default)(ast.type).to.be('color');
    (0, _expect2.default)(ast.value).to.be('#FF6600');
  });

  it('can parse negative lengths', function () {
    var ast = _css2.default.parse('-10px');
    (0, _expect2.default)(ast.type).to.be('neg');
  });

  it('can parse - without busting', function () {
    _css2.default.parse('-');
  });

  it('parses double negs', function () {
    var ast = _css2.default.parse('--1');
    (0, _expect2.default)(ast.type).to.be('neg');
    (0, _expect2.default)(ast.value.type).to.be('neg');
  });
});