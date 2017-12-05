import { delay, eventChannel } from "redux-saga";
import { isPublicAction } from "../actions";
import { Selector, createSelector } from "reselect";
import { call, select, fork, take, spawn, put } from "redux-saga/effects";
import * as io from "socket.io";

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

export const createSocketIOSaga = (socket) => {
  return function*() {
    yield fork(function*() {
      while(true) {
        const action = yield take(isPublicAction);
        socket.emit("action", action);
      }
    });


    yield bubbleEventChannel((emit) => {
      socket.on("action", emit);
      socket.on("connection", connection => {
        connection.on("action", emit);
      });
      return () => {};
    })
  }
}

const TAG = "$$" + Date.now() + "." + Math.random();

function* bubbleEventChannel(subscribe: (emit: any) => () => any) {
  yield spawn(function*() {
    const chan = eventChannel(subscribe);
    while(true) {
      const event = yield take(chan);
      if (event[TAG]) continue;
      event[TAG] = 1;
      yield fork(function*() {
        yield put(event);
      });
    }
  });
}
