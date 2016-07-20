"use strict";
var __getters = {};
function get(target, path) {
    if (__getters[path])
        return __getters[path](target);
    const segments = path.split('.');
    const n = segments.length;
    __getters[path] = function (target2) {
        var ctarget = target2;
        var parent;
        for (let i = 0; i < n; i++) {
            const segment = segments[i];
            if (!ctarget)
                break;
            if (!ctarget.hasOwnProperty(segment) && (parent = ctarget['[[parent]]'])) {
                return get(parent, segments.slice(i).join('.'));
            }
            ctarget = ctarget[segment];
        }
        return ctarget;
    };
    return get(target, path);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = get;
//# sourceMappingURL=get.js.map