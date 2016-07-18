'use strict';

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

describe(__filename + '#', function () {
  it('can be created', function () {
    _base2.default.create();
  });

  it('can be created with properties', function () {
    var app = _base2.default.create({ a: 'b' });
    (0, _expect2.default)(app.a).to.be('b');
  });

  it('cannot initialize the application twice', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var app, err;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = _base2.default.create();
            _context.next = 3;
            return app.initialize();

          case 3:
            err = void 0;
            _context.prev = 4;
            _context.next = 7;
            return app.initialize();

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](4);
            err = _context.t0;

          case 12:
            (0, _expect2.default)(err).not.to.be(void 0);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 9]]);
  })));
});