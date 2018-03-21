"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
exports.PAPERCLIP_FILE_EXTENSION = "pc";
exports.CONFIG_NAMESPACE = "paperclip";
exports.CONFIG_NAME = "tandem.config";
exports.DEFAULT_BASE_DIRECTORY = "paperclip";
exports.PUBLIC_SRC_DIR_PATH = "/src";
exports.TMP_DIRECTORY = process.env.HOME + "/.paperclip-dev-server";
exports.DEFAULT_COMPONENT_SOURCE_DIRECTORY = "src/components";
exports.SCREENSHOTS_DIRECTORY = path.join(exports.TMP_DIRECTORY, "screenshots");
exports.DEFAULT_COMPONENT_PREVIEW_SIZE = { width: 300, height: 300 };
//# sourceMappingURL=index.js.map