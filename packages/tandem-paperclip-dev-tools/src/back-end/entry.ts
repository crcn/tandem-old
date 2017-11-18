import * as path from "path";
import { mainSaga } from "./sagas";
import { Config } from "./state";
import { mainReducer } from "./reducers";
import createSagaMiddleware from "redux-saga";
import {extensionActivated } from "./actions";
import { createStore, applyMiddleware } from "redux";
import { CONFIG_NAME, CONFIG_NAMESPACE, DEFAULT_BASE_DIRECTORY } from "./constants";

const cwd = process.cwd();
const port = Number(process.env.PORT || 8082);
let config: Config;

try {
  config = require(path.join(cwd, CONFIG_NAME))[CONFIG_NAMESPACE] || {
    componentsDirectory: path.join(cwd, "paperclip")
  };  
} catch(e) {
  throw new Error(`tandem.config not found`);
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  mainReducer,
  { cwd, port, config, fileCache: [], watchUris: [], componentScreenshots: {} , componentScreenshotQueue: [] },
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(mainSaga);
store.dispatch(extensionActivated());
