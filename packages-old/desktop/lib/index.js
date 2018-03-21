"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reducers_1 = require("./reducers");
var sagas_1 = require("./sagas");
var redux_saga_1 = require("redux-saga");
var redux_1 = require("redux");
var init = function (initialState) {
    var sagaMiddleware = redux_saga_1.default();
    var store = redux_1.createStore(reducers_1.mainReducer, initialState, redux_1.applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(sagas_1.mainSaga);
};
init({});
//# sourceMappingURL=index.js.map