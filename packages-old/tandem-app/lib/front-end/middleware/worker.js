"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkerMiddleware = function () { return function (store) {
    return function (next) { return function (action) {
        return next(action);
    }; };
}; };
//# sourceMappingURL=worker.js.map