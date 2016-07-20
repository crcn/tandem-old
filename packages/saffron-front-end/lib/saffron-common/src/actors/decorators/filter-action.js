"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (filter) => ((proto, name, inf) => {
    var oldValue = inf.value;
    inf.value = function (action) {
        if (filter(action)) {
            return oldValue.call(this, action);
        }
    };
});
//# sourceMappingURL=filter-action.js.map