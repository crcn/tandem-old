import { delay } from "redux-saga";
import { Selector, createSelector } from "reselect";
import { call, select, fork, take } from "redux-saga/effects";

const WATCH_DELAY = 100;

export function* watch<T, U>(selector: Selector<T, U>, onChange: (value: U, state?: T) => any) {
  let currentValue = null;
  yield fork(function*() {
    while(true) {
      yield take();
      const newValue = yield select(selector);
      if (currentValue !== newValue) {
        currentValue = newValue;
        if ((yield call(onChange, currentValue, yield select())) !== true) {
          break;
        }
      }
    }
  });
}

export function* waitUntil<T, U>(test: (root) => boolean) {
  while(true) {
    if (test(yield select())) break;
    yield call(delay, WATCH_DELAY);
  }
}