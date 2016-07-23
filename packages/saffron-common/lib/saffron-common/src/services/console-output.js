"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const services_1 = require('saffron-base/src/services');
const fragments_1 = require('saffron-core/src/fragments');
const document_1 = require('saffron-core/src/decorators/document');
const sift = require('sift');
const levels_1 = require('saffron-core/src/logger/levels');
const chalk = require('chalk');
class ConsoleService extends services_1.Service {
    setLogFilter(action) {
        this._filter = sift(action.text);
    }
    log({ level, text }) {
        if (this._filter && !this._filter(text))
            return;
        var log = {
            [levels_1.VERBOSE]: console.log.bind(console),
            [levels_1.INFO]: console.info.bind(console),
            [levels_1.WARN]: console.warn.bind(console),
            [levels_1.ERROR]: console.error.bind(console)
        }[level];
        var color = {
            [levels_1.VERBOSE]: 'grey',
            [levels_1.INFO]: 'blue',
            [levels_1.WARN]: 'yellow',
            [levels_1.ERROR]: 'red',
        }[level];
        if (typeof window !== 'undefined') {
            log('%c: %c%s', `color: ${color}`, 'color: black', text);
        }
        else {
            log('%s %s', chalk[color].bold(':'), text);
        }
    }
}
__decorate([
    document_1.default('sets a log filter for stdout.')
], ConsoleService.prototype, "setLogFilter", null);
__decorate([
    document_1.default('logs to stdout')
], ConsoleService.prototype, "log", null);
exports.fragment = new fragments_1.ClassFactoryFragment('application/services/console', ConsoleService);
//# sourceMappingURL=console-output.js.map