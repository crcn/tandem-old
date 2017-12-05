import { eventChannel, delay } from "redux-saga";
import { take, fork, put, spawn, call } from "redux-saga/effects";

const TAG = "$$" + Date.now() + "." + Math.random();

export function* ipcSaga() {
  yield fork(receiveMessages);
  yield spawn(sendMessages);
  yield fork(pingPong);
}

function* receiveMessages() {
  const chan = eventChannel((emit) => {
    process.on("message", emit);
    return () => {

    };
  });

  while(1) {
    const action = yield take(chan);
    action[TAG] = 1;
    yield put(action);
  }
}

function* sendMessages() {
  while(1) {
    const action = yield take();
    if (action[TAG] || !action.$public) continue;
    try {
      process.send(action);
    } catch(e) {
      console.warn("Cannot send", action.type);
    }
  }
}

function* pingPong() {
  let _ponged = false;
  yield spawn(function*() {
    while(1) {
      yield take("$$PONG");
      _ponged = true;
    }
  });
  yield spawn(function*() {
    while(1) {
      _ponged = false;
      yield put({ type: "$$PING", $public: true });
      yield call(delay, 1000 * 5);
      if (!_ponged) {
        console.log("Did not receive pong. Closing.");
        process.exit();
      }
    }
  });
}
