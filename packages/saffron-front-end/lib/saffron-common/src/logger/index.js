"use strict";
const LogLevel = require('./levels');
const sprintf_1 = require('sprintf');
const index_1 = require('../actions/index');
class Logger {
    constructor(bus, prefix = '') {
        this.bus = bus;
        this.prefix = prefix;
    }
    verbose(text, ...rest) {
        this._log(LogLevel.VERBOSE, text, ...rest);
    }
    info(text, ...rest) {
        this._log(LogLevel.INFO, text, ...rest);
    }
    warn(text, ...rest) {
        this._log(LogLevel.WARN, text, ...rest);
    }
    error(text, ...rest) {
        this._log(LogLevel.ERROR, text, text, ...rest);
    }
    _log(level, text, ...params) {
        function stringify(value) {
            if (typeof value === 'object') {
                value = JSON.stringify(value, null, 2);
            }
            return value;
        }
        var message = sprintf_1.sprintf(`${this.prefix}${stringify(text)}`, ...params.map(stringify));
        this.bus.execute(new index_1.LogAction(level, message));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logger;
//# sourceMappingURL=index.js.map