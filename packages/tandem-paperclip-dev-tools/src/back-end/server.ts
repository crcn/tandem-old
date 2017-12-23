import * as path from "path";
import { mainSaga } from "./sagas";
import { mainReducer } from "./reducers";
import createSagaMiddleware from "redux-saga";
import {extensionActivated } from "./actions";
import { createStore, applyMiddleware } from "redux";
import { CONFIG_NAMESPACE, DEFAULT_BASE_DIRECTORY } from "./constants";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  mainReducer,
  { fileCache: [], watchUris: [], componentScreenshots: [], previewDocuments: {} },
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(mainSaga);
store.dispatch(extensionActivated());
