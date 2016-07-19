'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fragment = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fragments = require('saffron-common/lib/fragments/index');

var _object = require('saffron-common/lib/object');

var _object2 = _interopRequireDefault(_object);

var _sass = require('sass.js');

var _sass2 = _interopRequireDefault(_sass);

var _fragment = require('saffron-common/lib/section/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyleEntityController = function (_CoreObject) {
  _inherits(StyleEntityController, _CoreObject);

  function StyleEntityController(properties) {
    _classCallCheck(this, StyleEntityController);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StyleEntityController).call(this, properties));

    _this.section = _fragment2.default.create();
    _this.entity.visible = false;
    return _this;
  }

  _createClass(StyleEntityController, [{
    key: 'setAttribute',
    value: function setAttribute(key, value) {}
  }, {
    key: 'load',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref) {
        var _this2 = this;

        var section = _ref.section;

        var source, _ref4, text, node;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                source = this.entity.expression.childNodes[0].nodeValue;

                // TODO
                // const _watchFile = async (path) => {
                //   var stream = this.bus.execute({
                //     type: 'watchFile',
                //     path: path
                //   });
                //   let value;
                //   while ({ value } = await stream.read()) {
                //     console.log(value);
                //   }
                // };

                _sass2.default.importer(function () {
                  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, resolve) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this2.bus.execute({
                              type: 'readFile',
                              path: request.resolved
                            }).read();

                          case 2:
                            _context.t0 = _context.sent.value;
                            resolve(_context.t0);

                          case 4:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this2);
                  }));

                  return function (_x2, _x3) {
                    return _ref3.apply(this, arguments);
                  };
                }());

                _context2.next = 4;
                return new Promise(function (resolve, reject) {
                  _sass2.default.compile(source, { inputPath: _this2.file.path }, function (result) {
                    if (result.text) return resolve(result);
                    reject(result);
                  });
                });

              case 4:
                _ref4 = _context2.sent;
                text = _ref4.text;
                node = this.node = document.createElement('style');

                node.setAttribute('type', 'text/css');
                node.appendChild(document.createTextNode(text));

                section.appendChild(node);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function load(_x) {
        return _ref2.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: 'update',
    value: function update() {}
  }]);

  return StyleEntityController;
}(_object2.default);

exports.default = StyleEntityController;
var fragment = exports.fragment = _fragments.new FactoryFragment({
  ns: 'entity-controllers/style',
  test: function test(entity) {
    return entity.attributes.type === 'text/scss';
  },

  factory: StyleEntityController
});