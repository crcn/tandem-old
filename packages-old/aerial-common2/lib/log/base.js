"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { readAll } from "mesh";
var bus_1 = require("../bus");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 2] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 4] = "INFO";
    LogLevel[LogLevel["WARNING"] = 8] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 16] = "ERROR";
    LogLevel[LogLevel["LOG"] = 32] = "LOG";
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
    LogLevel[LogLevel["DEFAULT"] = 28] = "DEFAULT";
    LogLevel[LogLevel["ALL"] = 62] = "ALL";
    LogLevel[LogLevel["VERBOSE"] = 62] = "VERBOSE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LogActionTypes;
(function (LogActionTypes) {
    LogActionTypes["LOG"] = "LOG";
})(LogActionTypes = exports.LogActionTypes || (exports.LogActionTypes = {}));
exports.logAction = function (level, text) { return bus_1.createAction(LogActionTypes.LOG, {
    level: level,
    text: text
}); };
// export const logger = (dispatch: Dispatcher<any>): Logger => (action: LogAction) => readAll(dispatch(action));
// export const prefixedLogger = (prefix: string, dispatch: Dispatcher<any>): Logger => (action: LogAction) => readAll(dispatch({ ...action, text: `${prefix}${action.text}` }));
exports.logDebugAction = function (text) { return exports.logAction(LogLevel.DEBUG, text); };
exports.logInfoAction = function (text) { return exports.logAction(LogLevel.INFO, text); };
exports.logWarningAction = function (text) { return exports.logAction(LogLevel.WARNING, text); };
exports.logErrorAction = function (text) { return exports.logAction(LogLevel.ERROR, text); };
//# sourceMappingURL=base.js.map