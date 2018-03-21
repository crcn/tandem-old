"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sagas_1 = require("./sagas");
var actions_1 = require("./actions");
var reducers_1 = require("./reducers");
var redux_saga_1 = require("redux-saga");
var redux_1 = require("redux");
var sagaMiddleware = redux_saga_1.default();
var store = redux_1.createStore(reducers_1.mainReducer, {}, redux_1.applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas_1.mainSaga);
store.dispatch(actions_1.activated());
//# sourceMappingURL=entry.js.map