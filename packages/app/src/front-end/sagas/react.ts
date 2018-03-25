import { fork, put, take, select } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { RootState } from "../state";

export function* reactSaga() {
  while(1) {
    const root: RootState = yield select();
    ReactDOM.render(React.createElement(RootComponent, {
      root,
    }), root.mount);
    yield take();
  }
};
