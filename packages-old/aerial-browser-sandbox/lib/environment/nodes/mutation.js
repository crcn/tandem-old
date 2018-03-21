"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
exports.createInsertHTMLMutation = function (target, childIndex, html) { return ({
    type: constants_1.INSERT_HTML_EDIT,
    html: html,
    childIndex: childIndex,
    target: target
}); };
//# sourceMappingURL=mutation.js.map