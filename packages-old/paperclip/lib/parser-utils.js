"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiagnosticType;
(function (DiagnosticType) {
    DiagnosticType["WARNING"] = "WARNING";
    DiagnosticType["ERROR"] = "ERROR";
})(DiagnosticType = exports.DiagnosticType || (exports.DiagnosticType = {}));
;
// TODO - possibly colorize
exports.generatePrettyErrorMessage = function (_a, source) {
    var location = _a.location, _b = _a.filePath, filePath = _b === void 0 ? "" : _b, message = _a.message;
    var prettyMessage = message + "\n\n";
    var sourceLines = source.split("\n");
    var targetLines = sourceLines.slice(location.start.line - 1, location.end.line).map(function (line) { return line + "\n"; });
    // const highlightedLines = [
    //   "\x1b[90m" + targetLines[0].substr(0, location.start.column)  + "\x1b[0m" +
    //   "\x1b[31m" + targetLines[0].substr(location.start.column) + "\x1b[0m",
    //   ...targetLines.slice(1, location.end.line - location.start.line).map(line => "\x1b[31m" + line + "\x1b[0m"),
    //   "\x1b[31m" + targetLines[targetLines.length - 1].substr(0, location.end.column) + "\x1b[0m" +
    //   "\x1b[90m" + targetLines[targetLines.length - 1].substr(location.end.column) + "\x1b[0m",
    // ];
    for (var i = 0, length_1 = targetLines.length; i < length_1; i++) {
        prettyMessage += location.start.line + i + "| " + targetLines[i];
    }
    return prettyMessage;
};
exports.diagnosticsContainsError = function (diagnostics) {
    return Boolean(diagnostics.find(function (diag) { return diag.type === DiagnosticType.ERROR; }));
};
//# sourceMappingURL=parser-utils.js.map