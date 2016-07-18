'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _observable = require('./observable');

var _observable2 = _interopRequireDefault(_observable);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _collection = require('../collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe(__filename + '#', function () {
  describe('objects', function () {
    it('can be made observable', function () {
      var _class;

      var ObservableObject = (0, _observable2.default)(_class = function (_CoreObject) {
        _inherits(ObservableObject, _CoreObject);

        function ObservableObject() {
          _classCallCheck(this, ObservableObject);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableObject).apply(this, arguments));
        }

        return ObservableObject;
      }(_index2.default)) || _class;

      ObservableObject.create();
    });

    it('includes all the changes on the object', function () {
      var _class2;

      var changes = [];
      var bus = {
        execute: function execute(event) {
          changes = event.changes;
        }
      };

      var ObservableObject = (0, _observable2.default)(_class2 = function (_CoreObject2) {
        _inherits(ObservableObject, _CoreObject2);

        function ObservableObject() {
          _classCallCheck(this, ObservableObject);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableObject).apply(this, arguments));
        }

        return ObservableObject;
      }(_index2.default)) || _class2;

      var ref = ObservableObject.create({ bus: bus });

      ref.setProperties({ a: 1 });

      (0, _expect2.default)(changes.length).to.be(1);
      (0, _expect2.default)(changes[0].type).to.be('create');
      (0, _expect2.default)(changes[0].property).to.be('a');
      (0, _expect2.default)(changes[0].value).to.be(1);
      (0, _expect2.default)(changes[0].oldValue).to.be(void 0);

      ref.setProperties({ a: void 0 });

      (0, _expect2.default)(changes[0].type).to.be('delete');
      (0, _expect2.default)(changes[0].oldValue).to.be(1);
      (0, _expect2.default)(changes[0].property).to.be('a');

      ref.setProperties({ a: 1 });
      ref.setProperties({ a: 2, b: 2 });

      (0, _expect2.default)(changes.length).to.be(2);
      (0, _expect2.default)(changes[0].type).to.be('update');
      (0, _expect2.default)(changes[0].oldValue).to.be(1);
      (0, _expect2.default)(changes[0].property).to.be('a');
      (0, _expect2.default)(changes[0].value).to.be(2);
    });
  });

  describe('collection', function () {
    it('can be made observable', function () {
      var _class3;

      var i = 0;
      var bus = {
        execute: function execute() {
          i++;
        }
      };

      var ObservableCollection = (0, _observable2.default)(_class3 = function (_Collection) {
        _inherits(ObservableCollection, _Collection);

        function ObservableCollection() {
          _classCallCheck(this, ObservableCollection);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableCollection).apply(this, arguments));
        }

        return ObservableCollection;
      }(_collection2.default)) || _class3;

      var ref = ObservableCollection.create({ bus: bus });

      ref.push(1, 2, 3);
      (0, _expect2.default)(i).to.be(1);
    });

    it('includes all changes', function () {
      var _class4;

      var changes = [];
      var bus = {
        execute: function execute(event) {
          changes = event.changes;
        }
      };

      var ObservableCollection = (0, _observable2.default)(_class4 = function (_Collection2) {
        _inherits(ObservableCollection, _Collection2);

        function ObservableCollection() {
          _classCallCheck(this, ObservableCollection);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableCollection).apply(this, arguments));
        }

        return ObservableCollection;
      }(_collection2.default)) || _class4;

      var ref = ObservableCollection.create({ bus: bus });
      changes = [];

      ref.push(1, 2);
      (0, _expect2.default)(changes.length).to.be(1);
      (0, _expect2.default)(changes[0].type).to.be('splice');
      (0, _expect2.default)(changes[0].values.length).to.be(2);
    });
  });

  it('throws an error if a class is made observable twice', function () {
    var _class5;

    var ObservableObject = (0, _observable2.default)(_class5 = function (_CoreObject3) {
      _inherits(ObservableObject, _CoreObject3);

      function ObservableObject() {
        _classCallCheck(this, ObservableObject);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableObject).apply(this, arguments));
      }

      return ObservableObject;
    }(_index2.default)) || _class5;

    var ObservableObject2 = function (_ObservableObject) {
      _inherits(ObservableObject2, _ObservableObject);

      function ObservableObject2() {
        _classCallCheck(this, ObservableObject2);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableObject2).apply(this, arguments));
      }

      return ObservableObject2;
    }(ObservableObject);

    (0, _expect2.default)(function () {
      (0, _observable2.default)(ObservableObject2);
    }).to.throwError();
  });
});