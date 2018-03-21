"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var index_1 = require("./index");
var aerial_common2_1 = require("aerial-common2");
// // TODO - point to browser prop on package.json
var FRONT_END_CSS_PATH = path_1.resolve(__dirname, "..", "front-end", "entry.bundle.css");
var FRONT_END_ENTRY_PATH = path_1.resolve(__dirname, "..", "front-end", "entry.bundle.js");
index_1.initApplication({
    http: {
        port: Number(process.env.PORT || 8084)
    },
    frontEnd: {
        entryPath: FRONT_END_ENTRY_PATH,
        cssPath: FRONT_END_CSS_PATH
    },
    log: {
        level: aerial_common2_1.LogLevel.VERBOSE
    }
});
//# sourceMappingURL=entry.js.map