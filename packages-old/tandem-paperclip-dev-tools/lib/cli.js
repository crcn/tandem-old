"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var index_1 = require("./index");
var constants_1 = require("./back-end/constants");
var cwd = process.cwd();
var port = Number(process.env.PORT || 8082);
var projectConfig = {
    sourceFilePattern: "{,!(node_modules)/**/}*.{css,pc}"
};
try {
    Object.assign(projectConfig, require(path.join(cwd, constants_1.CONFIG_NAME)));
}
catch (e) {
}
index_1.start({ projectConfig: projectConfig, cwd: cwd, port: port });
//# sourceMappingURL=cli.js.map