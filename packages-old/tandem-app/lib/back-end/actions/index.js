"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG = "LOG";
exports.HTTP_SERVER_STARTED = "HTTP_SERVER_STARTED";
exports.log = function (text) { return ({
    type: exports.LOG,
    text: text
}); };
exports.httpServerStarted = function (expressServer) { return ({
    type: exports.HTTP_SERVER_STARTED,
    expressServer: expressServer
}); };
//# sourceMappingURL=index.js.map