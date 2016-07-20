"use strict";
function default_1(documentation) {
    return (proto, name) => {
        if (!proto.__documentation) {
            proto.__documentation = {};
        }
        proto.__documentation[name] = documentation;
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=document.js.map