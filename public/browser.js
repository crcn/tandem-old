/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _collection = __webpack_require__(1);

	var _collection2 = _interopRequireDefault(_collection);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var c = _collection2.default.create();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _class = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Base collection which is treated like a *native* array
	 * @extends Array
	 */

	var Collection = function (_Array) {
	    _inherits(Collection, _Array);

	    function Collection() {
	        var properties = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

	        _classCallCheck(this, Collection);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this));

	        if (properties != void 0) {
	            _this.setProperties(properties);
	        }
	        return _this;
	    }
	    /**
	     * sets properties into the base collection
	     * @param properties
	     */


	    _createClass(Collection, [{
	        key: 'setProperties',
	        value: function setProperties(properties) {
	            Object.assign(this, properties);
	        }
	    }, {
	        key: 'push',
	        value: function push() {
	            return this.splice.apply(this, [this.length, 0].concat(Array.prototype.slice.call(arguments)));
	        }
	    }, {
	        key: 'unshift',
	        value: function unshift() {
	            return this.splice.apply(this, [0, 0].concat(Array.prototype.slice.call(arguments)));
	        }
	    }, {
	        key: 'shift',
	        value: function shift() {
	            return this.splice(0, 1);
	        }
	    }, {
	        key: 'pop',
	        value: function pop() {
	            return this.splice(this.length - 1, 1);
	        }
	        /**
	         * removes an value from the collection if it exists
	         * @param values
	         */

	    }, {
	        key: 'remove',
	        value: function remove() {
	            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
	                values[_key] = arguments[_key];
	            }

	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var value = _step.value;

	                    var i = this.indexOf(value);
	                    if (~i) this.splice(i, 1);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	        /**
	         * es6 includes() method
	         */

	    }, {
	        key: 'includes',
	        value: function includes(value) {
	            return this.indexOf(value) > -1;
	        }
	        /**
	         * all mutation methods go through here
	         */

	    }, {
	        key: 'splice',
	        value: function splice() {
	            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                args[_key2] = arguments[_key2];
	            }

	            // OVERRIDE ME!
	            return Array.prototype.splice.apply(this, args);
	        }
	    }]);

	    return Collection;
	}(Array);

	Collection.create = (0, _class.createFactory)(Array);
	// CANNOT extend array. Copy props instead
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
	    for (var _iterator2 = Object.getOwnPropertyNames(Array.prototype)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var prop = _step2.value;

	        if (Collection.prototype[prop]) continue;
	        var value = Array.prototype[prop];
	        if (typeof value === 'function') Collection.prototype[prop] = value;
	    }
	} catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	} finally {
	    try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	        }
	    } finally {
	        if (_didIteratorError2) {
	            throw _iteratorError2;
	        }
	    }
	}

	Collection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
	exports.default = Collection;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(3);

	Object.defineProperty(exports, 'create', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_create).default;
	  }
	});

	var _createFactory = __webpack_require__(4);

	Object.defineProperty(exports, 'createFactory', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_createFactory).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createFactory = __webpack_require__(4);

	var _createFactory2 = _interopRequireDefault(_createFactory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _createFactory2.default)(Object);

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * creates a new factory for creating items
	 */

	exports.default = function () {
	    var contextClass = arguments.length <= 0 || arguments[0] === undefined ? Object : arguments[0];

	    // creates an object from *any* native class
	    function createFromContext() {
	        var context = new contextClass();
	        context.__proto__ = this.prototype;
	        this.apply(context, arguments);
	        return context;
	    }
	    // creates a new object from a class
	    function create() {
	        // dirty but fast
	        switch (arguments.length) {
	            case 1:
	                return new this(arguments[0]);
	            case 2:
	                return new this(arguments[0], arguments[1]);
	            case 3:
	                return new this(arguments[0], arguments[1], arguments[2]);
	            case 4:
	                return new this(arguments[0], arguments[1], arguments[2], arguments[3]);
	            default:
	                return createFromContext.apply(this, arguments);
	        }
	    }
	    // context class Object? Use the faster method instead.
	    return contextClass === Object ? create : createFromContext;
	};

/***/ }
/******/ ]);