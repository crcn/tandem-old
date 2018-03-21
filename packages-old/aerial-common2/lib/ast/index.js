"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function expressionPositionEquals(a, b) {
    return (a == null && b == null) || (a && b && (a.line === b.line && a.column === b.column));
}
exports.expressionPositionEquals = expressionPositionEquals;
function expressionLocationEquals(a, b) {
    return (a == null && b == null) || (a && b && a.kind === b.kind && a.uri === b.uri && expressionPositionEquals(a.start, b.start) && expressionPositionEquals(a.end, b.end) && a.fingerprint === b.fingerprint);
}
exports.expressionLocationEquals = expressionLocationEquals;
//# sourceMappingURL=index.js.map