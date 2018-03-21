"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var effects_1 = require("redux-saga/effects");
var ansi_up_1 = require("ansi_up");
var base_1 = require("./base");
// beat TS type checking
chalk.enabled = true;
function createLogColorizer(tester, replaceValue) {
    return function (input) {
        if (!tester.test(input))
            return input;
        return input.replace(tester, replaceValue);
    };
}
var cwd = process.cwd();
var highlighters = [
    createLogColorizer(/^INF/, function (match) { return chalk.bgCyan(match); }),
    createLogColorizer(/^ERR/, function (match) { return chalk.bgRed(match); }),
    createLogColorizer(/^DBG/, function (match) { return chalk.grey.bgBlack(match); }),
    createLogColorizer(/^WRN/, function (match) { return chalk.bgYellow(match); }),
    // timestamp
    createLogColorizer(/\[\d+\.\d+\.\d+\]/, function (match, inner) { return "[" + chalk.grey(inner) + "]"; }),
    // URL
    createLogColorizer(/((\w{3,}\:\/\/)|([^\/\s\("':]+)?\/)([^\/\)\s"':]+\/?)+/g, function (match) {
        return chalk.yellow(/\w+:\/\//.test(match) ? match : match.replace(cwd + "/", ""));
    }),
    // duration
    createLogColorizer(/\s\d+(\.\d+)?(s|ms|m|h|d)(\s|$)/g, function (match) { return chalk.bold.cyan(match); }),
    // numbers
    createLogColorizer(/\b\d+(\.\d+)?\b/g, function (match, inner) { return "" + chalk.cyan(match); }),
    // strings
    createLogColorizer(/"(.*?)"/g, function (match, inner) { return "\"" + chalk.blue(inner) + "\""; }),
    // tokens
    createLogColorizer(/([\:\{\}",\(\)]|->|null|undefined|Infinity)/g, function (match) { return chalk.grey(match); }),
    // <<output - green (from audio again)
    createLogColorizer(/<<(.*)/g, function (match, word) { return chalk.green(word); }),
    // >>input - magenta (from audio)
    createLogColorizer(/>>(.*)/g, function (match, word) { return chalk.magenta(word); }),
    // **BIG EMPHASIS**
    createLogColorizer(/\*\*(.*?)\*\*/, function (match, word) { return chalk.bgBlue(word); }),
    // *emphasis*
    createLogColorizer(/\*(.*?)\*/g, function (match, word) { return chalk.bold(word); }),
    // ___underline___
    createLogColorizer(/___(.*?)___/g, function (match, word) { return chalk.underline(word); }),
    // ~de emphasis~
    createLogColorizer(/~(.*?)~/g, function (match, word) { return chalk.grey(word); }),
];
function colorize(input) {
    var output = input;
    for (var i = 0, n = highlighters.length; i < n; i++)
        output = highlighters[i](output);
    return output;
}
function styledConsoleLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var argArray = [];
    if (args.length) {
        var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
        var endTagRe = /<\/span>/gi;
        var reResultArray;
        argArray.push(arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c'));
        while (reResultArray = startTagRe.exec(arguments[0])) {
            argArray.push(reResultArray[2]);
            argArray.push('');
        }
        // pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
        for (var j = 1; j < arguments.length; j++) {
            argArray.push(arguments[j]);
        }
    }
    console.log.apply(console, argArray);
}
// I'm against abbreviations, but it's happening here
// since all of these are the same length -- saves space in stdout, and makes
// logs easier to read.
var PREFIXES = (_a = {},
    _a[base_1.LogLevel.DEBUG] = "DBG ",
    _a[base_1.LogLevel.INFO] = "INF ",
    _a[base_1.LogLevel.WARNING] = "WRN ",
    _a[base_1.LogLevel.ERROR] = "ERR ",
    _a);
var defaultState = { level: base_1.LogLevel.ALL, prefix: "" };
function consoleLogSaga() {
    var _a, acceptedLevel, prefix, _b, text, level, log, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.select()];
            case 1:
                _a = ((_d.sent()) || defaultState).log, acceptedLevel = _a.level, prefix = _a.prefix;
                return [4 /*yield*/, effects_1.take(base_1.LogActionTypes.LOG)];
            case 2:
                _b = (_d.sent()), text = _b.text, level = _b.level;
                if (!(acceptedLevel & level))
                    return [3 /*break*/, 0];
                log = (_c = {},
                    _c[base_1.LogLevel.DEBUG] = console.log.bind(console),
                    _c[base_1.LogLevel.LOG] = console.log.bind(console),
                    _c[base_1.LogLevel.INFO] = console.info.bind(console),
                    _c[base_1.LogLevel.WARNING] = console.warn.bind(console),
                    _c[base_1.LogLevel.ERROR] = console.error.bind(console),
                    _c)[level];
                text = PREFIXES[level] + (prefix || "") + text;
                text = colorize(text);
                if (typeof window !== "undefined" && !window["$synthetic"]) {
                    return [2 /*return*/, styledConsoleLog(new ansi_up_1.default().ansi_to_html(text))];
                }
                log(text);
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
exports.consoleLogSaga = consoleLogSaga;
var _a;
//# sourceMappingURL=console.js.map