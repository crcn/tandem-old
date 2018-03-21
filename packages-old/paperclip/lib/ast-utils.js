"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = function (type, pos, value) { return ({ type: type, pos: pos, value: value }); };
var _computePosLinesMemos = {};
var computePosLines = function (source) {
    if (_computePosLinesMemos[source])
        return _computePosLinesMemos[source];
    var cline = 1;
    var ccol = 0;
    var posLines = {};
    (source + " ").split("").forEach(function (c, p) {
        posLines[p] = [ccol, cline];
        if (c === "\n") {
            ccol = 0;
            cline++;
        }
        ccol++;
    });
    return _computePosLinesMemos[source] = posLines;
};
exports.getPosition = function (start, source) {
    var pos = typeof start === "number" ? start : start.pos;
    var _a = computePosLines(source)[pos], column = _a[0], line = _a[1];
    return { column: column, line: line, pos: pos };
};
exports.getLocation = function (start, end, source) { return ({
    start: start.line ? start : exports.getPosition(start, source),
    end: end && end.line ? end : exports.getPosition(end || source.length, source),
}); };
exports.getTokenLocation = function (token, source) { return exports.getLocation(token, token.pos + token.value.length, source); };
//# sourceMappingURL=ast-utils.js.map