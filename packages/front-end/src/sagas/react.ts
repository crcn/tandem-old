import { put, take, select, spawn, call } from "redux-saga/effects";
import { RootComponent } from "../components/root";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { RootState } from "../state";
import { eventChannel } from "redux-saga";

export function* reactSaga() {
  let dispatch: any = () => {};

  yield spawn(function*() {
    const chan = eventChannel(emit => {
      dispatch = emit;
      return () => {};
    });
    while (1) {
      yield put(yield take(chan));
    }
  });

  while (1) {
    // yield call(() => new Promise(requestAnimationFrame));
    const root: RootState = yield select();
    ReactDOM.render(
      React.createElement(
        RootComponent as any,
        {
          root,
          dispatch
        } as any
      ) as any,
      root.mount
    );
    yield take();
  }
}
