"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (proto, name) => {
    if (!proto.__publicProperties) {
        proto.__publicProperties = [];
    }
    proto.__publicProperties.push(name);
};
//# sourceMappingURL=public.js.map