'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _watchProperty = require('./watch-property');

var _watchProperty2 = _interopRequireDefault(_watchProperty);

var _mesh = require('mesh');

var _observable = require('../../object/mixins/observable');

var _observable2 = _interopRequireDefault(_observable);

var _object = require('../../object');

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe(__filename + '#', function () {
  var _class;

  var ObservableObject = (0, _observable2.default)(_class = function (_CoreObject) {
    _inherits(ObservableObject, _CoreObject);

    function ObservableObject() {
      _classCallCheck(this, ObservableObject);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableObject).apply(this, arguments));
    }

    return ObservableObject;
  }(_object2.default)) || _class;

  it('throws an error if the bus property does not exist', function () {
    (0, _expect2.default)(function () {
      (0, _watchProperty2.default)({}, 'name');
    }).to.throwError();
  });

  it('can watch the observable object for a simple change', function () {

    var v;
    var target = ObservableObject.create({ bus: _mesh.NoopBus.create() });

    (0, _watchProperty2.default)(target, 'name', function (name) {
      v = name;
    });

    target.setProperties({ name: 'blarg' });
    (0, _expect2.default)(v).to.be('blarg');
  });

  xit('can watch a nested property', function () {
    var v;
    var target = ObservableObject.create({ bus: _mesh.NoopBus.create() });
    (0, _watchProperty2.default)(target, 'a.b', function (value) {
      v = value;
    });

    target.setProperties({ a: { b: 1 } });

    (0, _expect2.default)(v).to.be(1);
  });
});