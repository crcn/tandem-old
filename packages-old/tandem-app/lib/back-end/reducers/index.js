"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var aerial_common2_1 = require("aerial-common2");
exports.mainReducer = function (state, event) {
    switch (event.type) {
        case actions_1.HTTP_SERVER_STARTED: {
            var expressServer = event.expressServer;
            return aerial_common2_1.updateIn(state, ["http", "expressServer"], expressServer);
        }
    }
    return state;
};
//# sourceMappingURL=index.js.map