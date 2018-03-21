"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sagas_1 = require("./sagas");
var reducers_1 = require("./reducers");
var aerial_common2_1 = require("aerial-common2");
exports.initApplication = function (initialState) { return aerial_common2_1.initBaseApplication2(initialState, reducers_1.mainReducer, sagas_1.mainSaga); };
//# sourceMappingURL=application.js.map