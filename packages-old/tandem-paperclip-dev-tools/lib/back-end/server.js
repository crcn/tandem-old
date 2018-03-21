"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sagas_1 = require("./sagas");
var reducers_1 = require("./reducers");
var redux_saga_1 = require("redux-saga");
var actions_1 = require("./actions");
var redux_1 = require("redux");
var sagaMiddleware = redux_saga_1.default();
var store = redux_1.createStore(reducers_1.mainReducer, { fileCache: [], watchUris: [], componentScreenshots: [], previewDocuments: {} }, redux_1.applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas_1.mainSaga);
store.dispatch(actions_1.extensionActivated());
//# sourceMappingURL=server.js.map