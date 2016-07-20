"use strict";
exports.VERBOSE = 1 << 1;
exports.INFO = exports.VERBOSE << 1;
exports.WARN = exports.INFO << 1;
exports.ERROR = exports.WARN << 1;
exports.ALL = exports.VERBOSE | exports.INFO | exports.WARN | exports.ERROR;
//# sourceMappingURL=levels.js.map