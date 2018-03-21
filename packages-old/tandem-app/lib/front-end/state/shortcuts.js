"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeyboardShortcut = function (keyCombo, action, options) {
    if (options === void 0) { options = { keyup: false }; }
    return ({
        keyCombo: keyCombo,
        action: action,
        options: options
    });
};
//# sourceMappingURL=shortcuts.js.map