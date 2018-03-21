"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var ansi_up_1 = require("ansi_up");
// beat TS type checking
chalk["" + "enabled"] = true;
var logger_1 = require("../logger");
var messages_1 = require("../messages");
var services_1 = require("../application/services");
var ConsoleLogServiceAction = /** @class */ (function (_super) {
    __extends(ConsoleLogServiceAction, _super);
    function ConsoleLogServiceAction(type, match) {
        var _this = _super.call(this, type) || this;
        _this.match = match;
        return _this;
    }
    ConsoleLogServiceAction.HIGHLIGHT_LOG = "hlog"; // abbreviated to make
    return ConsoleLogServiceAction;
}(messages_1.CoreEvent));
exports.ConsoleLogServiceAction = ConsoleLogServiceAction;
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
// I'm against abbreviations, but it's happening here
// since all of these are the same length -- saves space in stdout, and makes
// logs easier to read.
var PREFIXES = (_a = {},
    _a[logger_1.LogLevel.DEBUG] = "DBG ",
    _a[logger_1.LogLevel.INFO] = "INF ",
    _a[logger_1.LogLevel.WARNING] = "WRN ",
    _a[logger_1.LogLevel.ERROR] = "ERR ",
    _a);
var ConsoleLogService = /** @class */ (function (_super) {
    __extends(ConsoleLogService, _super);
    function ConsoleLogService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConsoleLogService.prototype[logger_1.LogEvent.LOG] = function (_a) {
        var level = _a.level, text = _a.text, filterable = _a.filterable;
        var logOptions = this.config.log || { level: null, prefix: null };
        var logLevel = logOptions.level == null ? logger_1.LogLevel.ALL : logOptions.level;
        var logPrefix = logOptions.prefix || "";
        if (!(level & logLevel) && filterable !== false)
            return;
        // highlight log function from argv -- --hlog="something to highlight"
        var hlog = String(this.config && this.config.argv && this.config.argv.hlog || "");
        var log = (_b = {},
            _b[logger_1.LogLevel.DEBUG] = console.log.bind(console),
            _b[logger_1.LogLevel.LOG] = console.log.bind(console),
            _b[logger_1.LogLevel.INFO] = console.info.bind(console),
            _b[logger_1.LogLevel.WARNING] = console.warn.bind(console),
            _b[logger_1.LogLevel.ERROR] = console.error.bind(console),
            _b)[level];
        text = PREFIXES[level] + logPrefix + text;
        if (!this.config.argv || this.config.argv.color !== false) {
            text = colorize(text);
        }
        if (typeof window !== "undefined" && !window["$synthetic"]) {
            return styledConsoleLog(ansi_up_1.ansi_to_html(text));
        }
        if (hlog) {
            if (text.toLowerCase().indexOf(hlog.toLowerCase()) !== -1) {
                text = text.replace(new RegExp(hlog, "ig"), function (match) { return chalk.bold.bgMagenta(match); });
            }
        }
        log(text);
        var _b;
    };
    return ConsoleLogService;
}(services_1.CoreApplicationService));
exports.ConsoleLogService = ConsoleLogService;
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
var _a;
//# sourceMappingURL=console-log.js.map