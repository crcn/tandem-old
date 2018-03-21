"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
exports.insertCSSRuleText = function (target, childIndex, cssText) { return ({
    type: constants_1.CSS_INSERT_CSS_RULE_TEXT,
    target: target,
    childIndex: childIndex,
    cssText: cssText,
}); };
//# sourceMappingURL=mutation.js.map